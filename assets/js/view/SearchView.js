directory.SearchView = directory.AView.extend({
	
	searchCriteria : "",
	
	init : function() {
		this.index = 2;
	},
	
	build : function(criteria) {
		this.searchCriteria = criteria;
		
		directory.BugView.__super__.build.apply(this);
	},
	
	load : function() {
		self = this;
		
		this.loadData(directory.store.bugLoader, directory.store.bugLoader.isLoadedEvent);
	},
	
	loaded : function() {
		this.buildIndex();
	},
	
	display : function(criteria) {
		this.searchCriteria = criteria;
		
		self = this;
		
		this.toggleNav();
		this.buildIndex();
	},
	
	buildIndex : function()
	{
		directory.router.navigate("search/"+this.searchCriteria);
		
		//function to construct the filter list
		
		var index = this.$("#index_nav .nav li.active").index();
		index = index == -1 ? 0 : index - 1;
		
		this.$("#index_nav .nav .index a").unbind("click");
		this.$("#index_nav .nav .index > a > .dropdown ul a").unbind("click");
		
		this.$("#index_nav .nav .index").remove();
			
		for(var key in directory.store.INDEX_WORDING) {
			var indexButton = $('<li class="index"><a href="#" class="'+key+'">'+directory.store.INDEX_WORDING[key]+'</a></li>');
			
			directory.store.categories.get(key).sort();
			
			if(this.$("#index_nav .nav li.index").length == index)
			{
				indexButton.addClass("active");
				
				this.indexBy(key);
			}
			
			var dropDownMenu = $('<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">&nbsp;<span class="caret"></span></a><ul class="dropdown-menu" role="menu"></ul></li>');
			
			$.each(directory.store.categories.content[key], function(i, category) {
				dropDownMenu.find("ul").append('<li><a href="#'+self.getCategoryId(category)+'">'+self.getCategoryLabel(category)+'</a></li>');
			});
			
			indexButton.find("a").append(dropDownMenu);
				
			this.$("#index_nav .nav").append(indexButton);
		}
		
		this.$("#index_nav .nav .index > a").bind("click", function(event) {
			event.preventDefault();
			
			$("#index_nav .nav li").removeClass("active");
				
			self.indexBy($(this).attr("class"));
				
			$(this).parent().addClass("active");
		});
		
		this.$("#index_nav .nav .index > a > .dropdown ul a").bind("click", function(event) {
			event.preventDefault();
			
			directory.router.navigate($(this).attr("href"), true);
			directory.router.navigate("search/"+encodeURIComponent(self.searchCriteria), false);
		});
		
		this.$("#index_nav").removeClass("hide");
	},
	
	indexBy : function(key)
	{
		this.$("#search_list").empty();
		
		//function called to create section categories and display bugs
		
		$.each(directory.store.categories.content[key], function(i, category) {
			var hasSection = false;
			
			$.each(directory.store.bugs, function(i, bug) {
				if(bug.match(self.searchCriteria) && bug.categories.content.hasOwnProperty(key))
				{
					$.each(bug.categories.content[key], function(i, value) {
						if(category == value)
						{
							if(!hasSection)
							{
								hasSection = true;
								
								self.$("#search_list").append('<a id="'+self.getCategoryId(category)+'" class="list-group-item disabled">'+self.getCategoryLabel(category)+'</a>');
							}
							self.$("#search_list").append('<a href="#bug/'+bug.id+'" class="list-group-item">'+bug.title+'</a>');							
						}
					});
				}
			});
		});
		
		if(this.$("#search_list a").length == 0)
		{
			this.showInfo();
		}else{
			this.hideInfo();
		}
	},
	
	matchCategory : function(json, property, category)
	{
		for(var key in json)
		{
			if(typeof json[key] == "string")
			{
				if(key == property && json[key].indexOf(category) != -1)
				{
					return true;
				}
			}else{
				return self.matchCategory(json[key], property, category);
			}
		}
		
		return false;
	},
	
	getCategoryLabel : function(category)
	{
		var label = category;
		
		if (directory.store.taxonomy.hasOwnProperty(category))
		{
			var node = directory.store.taxonomy[category];
			label = node.text;	
		}
		
		return label;
	},
	
	getCategoryId : function(category)
	{
		return category.replace(" ", "_").toLowerCase();
	},
	
	showInfo : function()
	{
		$("#info").removeClass("hide");
	},
	
	hideInfo : function()
	{
		$("#info").addClass("hide");
	}
});
