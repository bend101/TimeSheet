Utils={};

/**
 * example usage:
 * 	Utils.xhr {url:"http://localhost:9090/AppName/Stuff", onSuccess:fnSuccess});
 * 	possible params:
 * 		url -  required
 * 		onSuccess - required
 * 		postData - optional, but required for POST
 * 		onError - optional
 *
 * @param options
 */
Utils.xhr=function( options)
{
	var method = "GET";
	if (options.postData)
	{
		method="POST";
	}

	var request = new XMLHttpRequest();
	request.open(method, options.url, true);

	request.onreadystatechange = function ()
	{
		if (request.readyState === 4 ) // request finished
		{
			if (request.status===200)
			{
				console.log(request);
				options.onSuccess(request.response);
			}
			else
			{
				console.log(request.statusText);
				if (options.onError)
				{
					options.onError(request.statusText);
				}
			}
		}
	};

	var postData=null;
	request.setRequestHeader('Content-Type', 'application/json');
	if(options.postData)
	{
		postData=options.postData;
	}
	request.send(postData);
}

