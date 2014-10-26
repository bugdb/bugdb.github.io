directory.HomeView = directory.AView.extend({
	
	page : 0,
	articleIndex : 0,
	isEventAttached : false,
	
	init : function() {
		this.index = 1;
		directory.store.news = [];
	},
	
	load : function() {
		self = this;
		this.loadData(directory.store.newsLoader, directory.store.newsLoader.isLoadedEvent);
	},
	
	loaded : function() {
		for(var i = this.articleIndex; i < directory.store.news.length; i ++)
		{
			this.$(".blog-main").append(directory.store.news[i]);
		}
		
		this.articleIndex = directory.store.news.length;
		
		if(!this.isEventAttached)
		{
			this.isEventAttached = true;
			
			this.$(".blog-main").infinitescroll({
				navSelector : '#pagination',
				nextSelector : '#pagination a',
				itemSelector : '.blog-post',
				scrollNearBottomCallback : function() {
					
					//function called when the user scroll to the bottom of the home page
					
					var currentLocation = $("#header .nav li.active a").attr("href");
					if(currentLocation != undefined && currentLocation.indexOf("home") != -1) directory.homeView.load();
				}
			});
		}
	},
	
	display : function() {
		this.toggleNav();
	}
});
