directory.BugLoader = function()
{
	this.isComplete = false;
	
	var self = this;
	
	this.load = function(bugId)
	{
		if(self.isComplete)
		{
			$(self).trigger(self.isLoadedEvent);
			return;
		}
		
		//load taxonomy file
		
		if(directory.store.taxonomy == null)
		{
			$.ajax({
				url : directory.store.RESOURCE_PATH.replace(directory.store.PATH, directory.store.TAXONOMY_PATH),
				type : "GET",
				dataType : "jsonp",
				success : function(data)
				{
					directory.store.taxonomy = jsyaml.load(data.data);
				},
				error : function(data)
				{
					console.log(data);
				}
			});
		}
		
		var dictionary = new TwoDimensionsDictionary();
		var counter = 0;
		
		directory.store.bugs = [];
		
		//load the files list of each of the folders
		
		$.each(directory.store.FOLDERS, function(i, folder) {
			$.ajax({
				url : directory.store.RESOURCE_PATH.replace(directory.store.PATH, folder),
				type : "GET",
				dataType : "jsonp",
				success : function(data) {
					$.each(data.files, function(j, file) {
						dictionary.add(directory.utils.getFileName(file.path), file.path);
					});
					
					counter ++;

					if (counter == directory.store.FOLDERS.length)
					{
						counter = 0;
						var lastEvent = "";
						
						//create bug objects to load their own file data
						
						$.each(dictionary.keys, function(j, key) {
							if(bugId != undefined)
							{
								if(bugId != key) return true;
							}
							
							var bug = new directory.BugController(key, directory.store.bugs.length);
							
							directory.store.bugs.push(bug);
							
							$(bug).bind(self.isLoadedEvent + bug.id, function(event, pos) {
								event.stopPropagation();
								
								$(directory.store.bugs[pos]).unbind(self.isLoadedEvent + directory.store.bugs[pos].id);
								
								if(lastEvent != event.type + event.timeStamp)
								{
									lastEvent = event.type + event.timeStamp;
									counter ++;
								}
								
								if(bugId == undefined) self.updateProgressBar(Math.round((counter * 100) / directory.store.bugs.length));
								
								if(counter == directory.store.bugs.length)
								{
									if(bugId == undefined) self.isComplete = true;
									$(self).trigger(self.isLoadedEvent);
								}
							});
							
							bug.load(dictionary.get(key));
						});
						
						self.loadComments();
					}
				},
				error : function(data) {
					console.log(data);
				}
			});
		});
	};
	
	this.loadComments = function()
	{		
		//load all the comments for all the bugs at once
		
		$.ajax({
			url : directory.utils.getNoCachedResourceUrl(directory.store.COMMENTS),
			type : "GET",
			dataType : "json",
			success : function(data) {
				$.each(data.bugs, function(i, bug) {
					$.each(directory.store.bugs, function(j, b) {
						if (bug.id == b.id) {
							b.setComments(bug.comments);
						}
					});
				});
			}
		});
	};
};

directory.BugLoader.prototype = new directory.DataProvider();
directory.BugLoader.prototype.constructor = directory.BugLoader;