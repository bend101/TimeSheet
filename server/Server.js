'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
//var basicAuth = require('basic-auth-connect');

var cors = require('cors');

var server = express();
server.use(cors());
//server.use(basicAuth("testUser", "testPass"));

server.use(bodyParser.json());       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
server.post('/updateProjectHours', onUpdateProjectHours);
server.post('/addProject', onAddProject);
server.post('/removeProject', onRemoveProject);
server.get('/requestweek', onRequestWeek);

server.listen(3000, function ()
{
	console.log("Server Ready");
});

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('timesheet.db');

function onUpdateProjectHours(req, res)
{
	var date = req.body.date;
	var user = req.body.name;
	var project = req.body.project;
	var hours = req.body.hours;

	update(date, user, project, hours);

	function update(date, user, project, hours)
	{
		var st = db.prepare("UPDATE timetable SET Hours=? WHERE Project=? AND Date=? AND User=?");

		st.run(hours, project, date, user, step2);

		st.finalize();
	}

	function step2(err, row) //if record doesnt exist insert it
	{
		var updated = this.changes;
		//console.log( this.changes);
		if (this.changes === 0)
		{
			var st = db.prepare("INSERT INTO timetable (Date,Project,Hours,User) VALUES (?,?,?,?)");

			st.run(date, project, hours, user);
			st.finalize();

		}
	}

	res.json(200, {});
}

function onAddProject(req, res)
{
	var firstDate = req.body.firstDateOfWeek;
	var user = req.body.user;
	var project = req.body.project;

	var st = db.prepare("INSERT INTO Projects (WeekDateStart,Project,User)Values (?,?,?) ");
	st.run(firstDate, project, user);

	st.finalize();

	res.json(200, {});
}

function onRemoveProject(req, res)
{
	var firstDate = req.body.firstDateOfWeek;
	var user = req.body.user;
	var project = req.body.project;

	var st = db.prepare("DELETE FROM Projects WHERE WeekDateStart=? AND Project=? AND User=?");
	st.run(firstDate, project, user);

	st.finalize();

	res.json(200, {});
}

function onRequestWeek(req, res)
{
	var weekDate = req.query.week;
	var user = req.query.user;
	var weekArray = createWeekArray(req.query.week);

	var projects = [];

	var st = db.prepare("SELECT * FROM Projects WHERE WeekDateStart=? AND User=?");
	st.all(weekDate, user, step1);

	function step1(err, projectRows)
	{
		for (var i = 0; i < projectRows.length; i++)
		{
			var project = {
				project: projectRows[i].Project,
				hours: []
			};
			projects.push(project);
		}

		var st = db.prepare("SELECT * FROM timetable WHERE Date BETWEEN ? AND ? AND User=?");
		st.all(weekArray[0], weekArray[4], user, step2); //put in firstday and last day
		st.finalize();
	}

	function step2(err, timetableRows)
	{
		for (var j = 0; j < projects.length; j++)
		{
			for (var k = 0; k < weekArray.length; k++)
			{
				var projectName = projects[j].project;
				var hours = findHours(timetableRows, weekArray[k], projectName);
				projects[j].hours.push(hours);

			}
		}
		res.json(200, projects);
	}
}

function findHours(timetableRows, dateStr, projectName)
{
	var rtn = 0;
	for (var i = 0; i < timetableRows.length; i++)
	{
		if (timetableRows[i].Date == dateStr && timetableRows[i].Project === projectName)
		{
			rtn = timetableRows[i].Hours;
			break;
		}
	}

	return rtn;
}

function createWeekArray(dateString)
{
	var month = dateString.substr(4, 2) - 1;
	var day = dateString.substr(6, 2);
	var year = dateString.substr(0, 4);
	var date = new Date(year, month, day);

	var array = [];
	for (var i = 0; i < 5; i++)
	{
		var newDate = new Date;
		newDate.setTime(date.getTime());
		newDate.setDate(newDate.getDate() + i);
		var string = toyyyymmdd(newDate);
		array.push(string);
	}

	return array;
}

function toyyyymmdd(dateObject)
{
	var year = dateObject.getFullYear();
	var month = addZeroToDate(dateObject.getMonth() + 1);
	var day = addZeroToDate(dateObject.getDate());
	var date = year + month + day + "";
	return date;
}

function addZeroToDate(dayOrMonth)
{
	if (dayOrMonth < 10)
	{
		return dayOrMonth = "0" + dayOrMonth;
	}
	else
	{
		return dayOrMonth;
	}
}

