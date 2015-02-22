function InputBox(index, fnChangeInInputBox, project, hours)
{
	this.fnChangeInInputBox = fnChangeInInputBox;
	this.inputElement = document.createElement("input");
	this.inputElement.className = "inputbox-hours";
	this.inputElement.addEventListener("keypress", this.keyPressInInputBox.bind(this));
	this.inputElement.addEventListener("change", this.changeInInputBox.bind(this));

	this.index = index;
	this.project = project;
	if (hours===0)
	{
		this.inputElement.value = "";
	}
	else
	{
		this.inputElement.value = hours;
	}
}

InputBox.prototype.keyPressInInputBox = function (event)
{
	var isNumber = this.isNumber(event.which);
	var decimals = this.checkForDecimals();
	if (isNumber === false || (decimals !== -1 && event.which === 46))
	{
		event.preventDefault();
	}
}

InputBox.prototype.changeInInputBox = function ()
{
	this.value = parseFloat(this.inputElement.value);
	this.fnChangeInInputBox(this);
}

InputBox.prototype.isNumber = function (key)
{

	if (key > 31 && (key < 48 || key > 57) && key !== 46)
	{
		return false;
	}
	else
	{
		return true;
	}
}

InputBox.prototype.checkForDecimals = function ()
{
	return this.inputElement.value.indexOf(".");
}

InputBox.prototype.getElement = function ()
{
	return this.inputElement;
}

InputBox.prototype.setValue = function (value)
{
	this.inputElement.value = value;
}

InputBox.prototype.getValue = function ()
{
	if (isNaN(parseFloat(this.inputElement.value)) === true)
	{
		return 0;
	}
	return parseFloat(this.inputElement.value);
}
