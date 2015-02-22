function TotalsRow()
{
	this.dateTotalArray = [];
	this.dateTotal = document.body.querySelector("#dateTotal");
	for (var i = 0; i < 5; i++)
	{
		var dateTotal = new DateTotal(i, this.dateTotal);
		this.dateTotalArray.push(dateTotal);
	}
	this.totalDiv=document.createElement("div");
	this.totalDiv.className="timeTable-totalDiv";
	this.dateTotal.appendChild(this.totalDiv);
}

TotalsRow.prototype.addValueToTotalForWeek=function(value)
{
	this.totalDiv.innerHTML=value;
}

TotalsRow.prototype.getArray=function()
{
	return this.dateTotalArray;
}

TotalsRow.prototype.changeValue=function(index,total)
{
	this.dateTotalArray[index].changeValue(total);
}

TotalsRow.prototype.addUpDateTotals=function()
{
	var tempTotal = 0;
	for (var j = 0; j < this.dateTotalArray.length; j++)
	{
		var value = this.dateTotalArray[j].getValue();
		tempTotal = tempTotal + value;
	}
	this.addValueToTotalForWeek(tempTotal);
}