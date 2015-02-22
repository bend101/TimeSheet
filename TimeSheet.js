function TimeSheet()
{
	// get elements
	this.mainDiv = document.body.querySelector(".mainDiv");

	this.sideBar=new SideBar(this.addNewRow.bind(this));
	this.header=new Header(this);

	// find the first day of the current week
	this.currentDate = new Date();
	this.firstDay = new Date();
	this.firstDay.setDate((this.firstDay.getDate()) - this.firstDay.getDay() + 1);
	console.log(this.firstDay);

	this.rowArray = [];

	this.totalsRow=new TotalsRow();
	this.dateTotalArray=this.totalsRow.getArray();
	// creates date total divs at bottom of table

	this.store = new Store();
	this.createWeek(0);
	this.user=this.getSaveName();
}

TimeSheet.prototype.createWeek = function (daysToAdd)
{
	// remove existing rows
	for (var a = 0; a < this.rowArray.length; a++)
	{
		this.mainDiv.removeChild(this.rowArray[a].rowDiv);
	}
	this.rowArray = [];
	// update first day of week
	this.firstDay.setDate((this.firstDay.getDate() + daysToAdd) - this.firstDay.getDay() + 1);
	this.header.fillHeader(this.firstDay);

	this.load();
}

TimeSheet.prototype.changeInRow = function (inputBox, row)
{
	this.save(row);
	var index = inputBox.index;
	this.addUpTotals(index);

	var date=new Date();
	date.setTime(this.firstDay.getTime());
	var index=inputBox.index;
	date.setDate(date.getDate()+index);
	var dateString=this.toyyyymmdd(date);
	var data = {
		name: this.user,
		project: row.project,
		date: dateString,
		hours: inputBox.getValue()
	}
	console.log(data);

	this.saveToServer(data);

}

/**
 * Save rows to local storage in the format:
 * [
 *   {project:"a project", valueArray:[1,2,3,4,5]},
 *   {project:"b project", valueArray:[1,2,3,4,5]}
 * ]
 * @param row
 */
TimeSheet.prototype.save = function ()
{
	//var arrayOfRowObjects = [];
	//for (var i = 0; i < this.rowArray.length; i++)
	//{
	//	var jsonObject = this.rowArray[i].save();
	//	arrayOfRowObjects.push(jsonObject);
	//}
	//this.store.save(this.firstDay, arrayOfRowObjects);
}

TimeSheet.prototype.onPreviousClick = function ()
{
	this.createWeek(-7);
}

TimeSheet.prototype.onNextClick = function ()
{
	this.createWeek(7);
}

TimeSheet.dateString = function (date)
{
	var day= date.getDate();
	day=TimeSheet.addZeroToDate(day);
	var month=date.getMonth()+1;
	month=TimeSheet.addZeroToDate(month);
	var year=date.getFullYear();
		return day+ "/" + month + "/" + year ;
}

TimeSheet.prototype.load = function ()
{
	this.user=this.getSaveName();
	this.requestWeekData(function(rowsJson)
	{
		for (var i = 0; i < rowsJson.length; i++)
		{
			var project = new Row(rowsJson[i].project, this, this.changeInRow.bind(this), this.firstDay, rowsJson[i].hours,i);
			this.rowArray.push(project);
		}

		for (var i = 0; i < 5; i++)
		{
			this.addUpTotals(i);
		}
	}.bind(this));

	//var rowsJson = this.store.load(this.firstDay);

}

TimeSheet.prototype.addUpTotals = function (index)
{
	var total=0;
	for (var i = 0; i < this.rowArray.length; i++)
	{
		var returnedValue = this.rowArray[i].getHours(index);
		total = total + returnedValue;
	}
	this.totalsRow.changeValue(index,total);

	this.totalsRow.addUpDateTotals();
}

TimeSheet.prototype.removeRow=function(index)
{
	var project=this.rowArray[index].project;
	var user=this.user;
	var date=this.toyyyymmdd(this.firstDay);
	this.rowArray.splice(index, 1);
	this.save();
	this.reloadIndexes();
	var data= {
		firstDateOfWeek: date,
		project: project,
		user: this.user
	}
	this.removeWeekFromServer(data);

}

TimeSheet.prototype.reloadIndexes=function()
{
	for (var i=0;i<this.rowArray.length;i++)
	{
		this.rowArray[i].index=i;
	}
}

TimeSheet.addZeroToDate=function(dayOrMonth)
{
	if (dayOrMonth<10)
	{
		return dayOrMonth="0"+dayOrMonth;
	}
	else
	{
		return dayOrMonth;
	}
}

TimeSheet.prototype.addNewRow=function(value)
{
	var project = new Row(value, this, this.changeInRow.bind(this), this.firstDay, [0,0,0,0,0],(this.rowArray.length));
	this.rowArray.push(project);
	console.log(this.rowArray);
	var dateString=this.toyyyymmdd(this.firstDay);
	var project=value;
	var data= {
		firstDateOfWeek: dateString,
		project: project,
		user: this.user
	}
	this.saveWeekToServer(data);

}

TimeSheet.prototype.toyyyymmdd=function(dateObject)
{
	var year=dateObject.getFullYear();
	var month=TimeSheet.addZeroToDate(dateObject.getMonth()+1);
	var day=TimeSheet.addZeroToDate(dateObject.getDate());
	var date=year+month+day+"";
	return date;
}

TimeSheet.prototype.saveToServer=function(dataObject)
{
	Utils.xhr({
		url:"http://localhost:3000/updateProjectHours",
		postData:JSON.stringify(dataObject),
		onSuccess:function (response)
		{
			console.log(response);
		}
	})
}
TimeSheet.prototype.saveWeekToServer=function(dataObject)
{
	Utils.xhr({
		url:"http://localhost:3000/addProject",
		postData:JSON.stringify(dataObject),
		onSuccess:function (response)
		{
			console.log(response);
		}
	})
}

TimeSheet.prototype.removeWeekFromServer=function(dataObject)
{
	Utils.xhr({
		url:"http://localhost:3000/removeProject",
		postData:JSON.stringify(dataObject),
		onSuccess:function (response)
		{
			console.log(response);
		}
	})
}

TimeSheet.prototype.requestWeekData=function(fnCallback)
{
	var dateString=this.toyyyymmdd(this.firstDay);
	this.user=this.getSaveName();
	Utils.xhr(
		{
			url:"http://localhost:3000/requestweek?week="+dateString+"&user="+this.user,
			onSuccess:function (response)
			{
				fnCallback(JSON.parse(response));
			}
		}
	)
}


TimeSheet.prototype.getSaveName=function()
{
		var queryString=window.location.search.substring(1);
		var pieces=queryString.split("=");
		if (pieces[0]==="user")
		{
			console.log(pieces[1]);
			return pieces[1];
		}
}



