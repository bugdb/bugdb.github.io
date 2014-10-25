directory.BugController = function(id, pos)
{
	this.id = id;
	this.position = pos;
	this.title;
	this.report = null;
	this.simple = null;
	this.patch = null;
	this.rawLinks = [];
	this.reportJSON;
	this.comments;
	this.displayer = new directory.BugDisplayer(this);
	this.categories;
	this.isActive = false;
	this.config;
	this.bugDegree = 0;
	
	var self = this;
	var counter = 0; 
	
	//@public
	
	this.load = function(urls)
	{
		$.each(urls, function(i, url){
			loadContent(url, urls.length);
			self.rawLinks[i] = [directory.store.CONTENT_WORDING[url.split("/")[0]], directory.store.RAW_LINK.replace(directory.store.PATH, url)];
		});
	};
	
	this.display = function()
	{
		$.each(directory.store.bugs, function(i, bug) {
			bug.isActive = false;
		});
		
		this.isActive = true;
		
		this.displayer.display();
	};
	
	this.setComments = function(comments)
	{
		this.comments = comments;
		
		if(this.isActive)
		{
			this.displayer.display();
		}
	};
	
	this.match = function(value)
	{
		//function used to search through the bugs
		
		value = value.toLowerCase();
		
		if((this.id != undefined && this.id.toLowerCase().indexOf(value) != -1) ||
			(this.simple != undefined && this.simple.toLowerCase().indexOf(value) != -1) ||
			(this.report != undefined && this.report.toLowerCase().indexOf(value) != -1))
		{
			return true;
		}
		
		return false;
	};
	
	this.hide = function()
	{
		this.displayer.hide();
	};
	
	this.show = function()
	{
		this.displayer.show();
	};
	
	//@private
	
	var loadContent = function(path, total)
	{	
		var type = path.substring(0, path.indexOf("/"));
		
		$.ajax({
			url : directory.store.RESOURCE_PATH.replace(directory.store.PATH, path),
			type : "GET",
			dataType : "jsonp",
			success : function(data)
			{			
				switch(type)
				{
					case directory.store.FOLDERS[0]:
						self.report = data.data;
						self.reportJSON = jsyaml.load(self.report);
						break;
					case directory.store.FOLDERS[1]:
						self.simple = directory.utils.getEncodedCCode(data.data);
						break;
					case directory.store.FOLDERS[2]:
						self.patch = directory.utils.getEncodedCCode(data.data);
						break;
					default:
						break;
				}
				
				counter ++;
				
				if(counter == total)
				{
					self.title = directory.utils.getSentenceUppercase(self.reportJSON["descr"].split('\n')[0]);
					
					self.categories = new TwoDimensionsDictionary();
					loadCategories(self.reportJSON);
					
					$(self).trigger(directory.store.bugLoader.isLoadedEvent + self.id, self.position);
				}
			},
			error : function(data)
			{
				console.log(data);
			}
		});
	};
	
	//definition of the categories for filtering bugs in the search page
	
	var loadCategories = function(json)
	{
		for(var key in json)
		{
			if(typeof json[key] == "string")
			{
				if(directory.store.INDEX_WORDING.hasOwnProperty(key))
				{					
					var value = json[key].replace(/\s+/g, "");
					var sep;
					var matches;
						
					switch(key)
					{
						case "fix-in":
						case "C-features":
							sep = ",";
							break;
						case "config":
							value = value.replace("(", "").replace(")", "");
							sep = /[&|]+/;
							matches = value.split(sep);
							
							self.config = matches;
							self.bugDegree = matches.length;
							
							if(directory.store.INDEX_WORDING.hasOwnProperty("deg"))
							{
								directory.store.categories.add("deg", directory.utils.getOrdinal(self.bugDegree));
								self.categories.add("deg", directory.utils.getOrdinal(self.bugDegree));
							}
							
							break;
						default:
							sep = " ";
						break;
					}
						
					matches = value.split(sep);
					
					$.each(matches, function(i, match) {
						if(match != "")
						{
							directory.store.categories.add(key, match);
							self.categories.add(key, match);
						}
					});
				}
			}else{
				loadCategories(json[key]);
			}
		}
	};
};

directory.BugController.prototype = directory.BugController;