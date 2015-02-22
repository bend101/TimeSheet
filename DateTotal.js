function DateTotal(index,div)
{
	this.index=index;
	this.div=div;
	this.dateTotalDiv=document.createElement("div");
	this.dateTotalDiv.className="dateTotal";
	this.div.appendChild(this.dateTotalDiv);
	this.value=0
}

DateTotal.prototype.changeValue=function(value)
{
	this.dateTotalDiv.innerHTML=value;
	this.value=value;
}
DateTotal.prototype.getValue=function()
{
	return this.value;
}