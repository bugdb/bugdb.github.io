directory.DataProvider = function()
{
	this.isLoadedEvent = "IS_LOADED";
	this.isUpdatedEvent = "IS_UPDATED";
	this.isLoading = false;
	
	this.load = function(toUpdate) {
		console.log("override the load method");
	};
	
	this.updateProgressBar = function(percent)
	{
		$("#bar .progress-bar").text("Loading in progress " + percent + "%");
		$("#bar .progress-bar").attr("aria-valuenow", percent);
		$("#bar .progress-bar").css("width", percent+"%");
		
		if(percent == 100)
		{
			$("#bar").delay(900).fadeOut();
		}
		
		if($("#bar").css("display") == "none")
		{
			$("#bar").fadeIn();
		}
	};
};