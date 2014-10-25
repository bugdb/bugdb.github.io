directory.NewsLoader = function()
{
	var self = this;
	
	this.load = function()
	{
		var page = directory.homeView.page;
		
		if(page == "null") return;
		
		//load the next articles according to the pagination number
		
		$.ajax({
			url : directory.store.NEWS_WEBSERVICE,
			type : "GET",
			data : {
				page : page
			},
			dataType : "json",
			success : function(data) {
				var counter = 0;
				
				directory.homeView.page = data.next;
				
				$.each(data.news, function(i, articlePath) {
					$.ajax({
						url : directory.store.NEWS + articlePath,
						type : "GET",
						success : function(article) {
							directory.store.news.push(article);
							
							counter ++;
							
							self.updateProgressBar(Math.round((counter * 100) / data.news.length));
							
							if(counter == data.news.length)
							{
								$(self).trigger(self.isLoadedEvent);
							}
						}
					});			
				});
			}
		});
	};
};

directory.NewsLoader.prototype = new directory.DataProvider();
directory.NewsLoader.prototype.constructor = directory.NewsLoader;