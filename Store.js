function Store ()
{
}

Store.prototype.save=function(date, jsonObject)
{
	var dateString=TimeSheet.dateString(date);
	var json1=JSON.stringify(jsonObject);
	localStorage.setItem(dateString, json1);
	console.log(json1);
}

Store.prototype.load=function(date)
{
	var dateString=TimeSheet.dateString(date);
	var returnedString=localStorage.getItem(dateString);
	if (returnedString != null)
	{
		var rowsJson = JSON.parse(returnedString);
		return rowsJson;
	}

	return [];
}