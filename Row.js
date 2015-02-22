function Row(project, timetable, fnChangeInRow, firstDay, hoursArray, index)
{
	this.project = project;
	this.fnChangeInRow = fnChangeInRow;
	this.index=index;
	this.timeTable=timetable;

	this.mainDiv = timetable.mainDiv;
	this.firstDay = firstDay;
	this.inputArray = [];
	this.inputBoxChanged = null;
	this.rowDiv = document.createElement("div");
	this.mainDiv.appendChild(this.rowDiv);

	this.rowHeader=document.createElement("div");
	this.rowHeader.className="rowHeader";
	this.rowDiv.appendChild(this.rowHeader);

	this.headerTitle=document.createElement("div");
	this.headerTitle.className="headerTitle";
	this.headerTitle.innerHTML=this.project;
	this.rowHeader.appendChild(this.headerTitle);

	this.deleteButton=document.createElement("div");
	this.deleteButton.className="deleteButton";
	this.rowHeader.appendChild(this.deleteButton);
	this.deleteButton.addEventListener("click",this.onDeleteClick.bind(this));

	this.totalRow = document.createElement("div");
	this.totalRow.className = "row-totalRow";

	this.innerRowDiv=document.createElement("div");
	this.innerRowDiv.className="row-innerRow";
	this.rowDiv.appendChild(this.innerRowDiv);

	for (var i = 0; i < hoursArray.length; i++)
	{
		var inputBox = new InputBox(i, this.changeInInputBox.bind(this), this.project, hoursArray[i]);
		this.inputArray.push(inputBox);

		this.innerRowDiv.appendChild(inputBox.getElement());
	}
	this.innerRowDiv.appendChild(this.totalRow);
	this.addUpRow();

	if (this.index%2===0)
	{
		this.rowDiv.style.backgroundColor="#F5F5F5";
	}
}

Row.prototype.changeInInputBox = function (inputBox)
{
	this.inputBoxChanged = inputBox;
	this.addUpRow();
	this.fnChangeInRow(this.inputBoxChanged, this);
}

/**
 * Saves the row to a simple json object with project and array of hours
 * @returns object of form {project:"a project", valueArray:[1,2,3,4,5]}
 */
Row.prototype.save = function ()
{
	var json = {};
	json.project = this.project;
	json.valueArray = [];
	for (var i = 0; i < this.inputArray.length; i++)
	{
		json.valueArray.push(this.inputArray[i].getValue());
	}
	return json;
}

/**
 *
 * @param object the json row object to load
 */
//Row.prototype.load=function(object)
//{
//	var project=object.project;
//	for (var i=0;i<this.inputArray.length;i++)
//	{
//		console.log(this.inputArray[i]);
//		this.inputArray[i].setValue(object.valueArray[i]);
//		this.inputArray[i].project=project;
//		console.log(this.inputArray[i]);
//	}
//}

Row.prototype.getHours = function (index)
{
	return this.inputArray[index].getValue();
}

Row.prototype.addUpRow=function()
{
	var total = 0;
	for (var i = 0; i < this.inputArray.length; i++)
	{
		total = total + this.inputArray[i].getValue();
	}
	this.totalRow.innerHTML = total;
}


Row.prototype.onDeleteClick=function()
{
	this.timeTable.removeRow(this.index);
	this.mainDiv.removeChild(this.rowDiv);
}
