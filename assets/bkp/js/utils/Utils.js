directory.Utils = function()
{
	this.getFileName = function(filePath) {
		return filePath.substring(filePath.indexOf("/") + 1, filePath.indexOf("."));
	};
	
	this.isValidEmail = function(email) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		return reg.test(email) == true;
	};
	
	this.getNoCachedResourceUrl = function(url)
	{
		return url + "?nocache=" + (new Date()).getTime();
	};
	
	this.getSentenceUppercase = function(string)
	{
		return (string.charAt(0).toUpperCase() + string.slice(1));
	};
	
	this.getEncodedCCode = function(string)
	{
		return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	};
	
	this.getHTMLLineBreak = function(string)
	{
		return string.replace(/\n/g, "<br/>");
	};
	
	this.getHTMLLink = function(string)
	{
		if(string.indexOf("*") != -1)
		{
			var strings = string.split("*");
			string = "";
			
			$.each(strings, function(i, str){
				if(str == "") return true;
				
				if(str.indexOf("://") != -1)
				{
					string += '<li><a href="'+str.substring(str.indexOf("(") + 1, str.indexOf(")"))+'" target="_blank">'+str.substring(str.indexOf("[") + 1, str.indexOf("]"))+'</a></li>';				
				}else{
					string += '<li>'+str+'</li>';
				}
			});
		}	
		return string;
	};
	
	this.getOrdinal = function(n)
	{
		var s = ["th", "st", "nd", "rd"];
		var v = n % 100;
		
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	};
};