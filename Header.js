function Header(timetable)
{
	this.timeTable=timetable;
	this.previousButton = document.body.querySelector("#previousButton");
	this.nextButton = document.body.querySelector("#nextButton");
	this.header = document.body.querySelector("#header");

	// add listeners to next/previous buttons
	this.previousButton.addEventListener("click", this.onPreviousClick.bind(this));
	this.nextButton.addEventListener("click", this.onNextClick.bind(this));
}

Header.prototype.onPreviousClick=function()
{
	this.timeTable.onPreviousClick();
}
Header.prototype.onNextClick=function()
{
	this.timeTable.onNextClick();
}

Header.prototype.fillHeader=function(firstDay)
{
	var firstDayString=TimeSheet.dateString(firstDay);
	var lastDay= new Date();
	lastDay.setTime(firstDay.getTime());
	lastDay.setDate((lastDay.getDate() + 4) - lastDay.getDay() + 1);
	var lastDayString=TimeSheet.dateString(lastDay);
	var header=firstDayString+" - "+lastDayString;
	this.header.innerHTML=header;
}
