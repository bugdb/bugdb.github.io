var directory = {

	views : {},

	models : {},

	loadTemplates : function(views, callback)
	{
		var deferreds = [];

		$.each(views, function(index, view) {
			if (directory[view]) {
				deferreds.push($.get('assets/template/' + view + '.html', function(data) {
					directory[view].prototype.template = _.template(data);
				}, 'html'));
			} else {
				alert(view + " not found");
			}
		});

		$.when.apply(null, deferreds).done(callback);
	}
};

directory.Router = Backbone.Router.extend({

	routes : {
		"" : "displayHome",
		"home" : "displayHome",
		"home/" : "displayHome",
		"bug" : "displaySearch",
		"bug/" : "displaySearch",
		"bug/:id" : "displayBug",
		"search" : "displaySearch",
		"search/" : "displaySearch",
		"search/:criteria" : "displaySearch",
		"contribution" : "displayContribution",
		"contribution/" : "displayContribution"
	},

	initialize : function()
	{
		this.$content = $("#content");
	},

	displayHome : function()
	{
		this.displayView("homeView", "HomeView", "");
	},
	
	displayBug : function(id)
	{	
		this.displayView("bugView", "BugView", "", id);
	},
	
	displaySearch : function(criteria)
	{
		criteria = criteria == null ? "" : criteria;
		
		this.displayView("searchView", "SearchView", decodeURIComponent(criteria), criteria);
	},
	
	displayContribution : function()
	{
		this.displayView("contributionView", "ContributionView", "");
	},
	
	displayView : function(viewName, className, searchValue, param)
	{
		$("#search").val(searchValue);
		
		if (!directory[viewName]) {
			directory[viewName] = new directory[className]();
			directory[viewName].render();
			directory[viewName].build(param);
			this.$content.html(directory[viewName].el);
		} else {
			directory[viewName].delegateEvents();
			this.$content.html(directory[viewName].el);
			directory[viewName].display(param);
		}
	}
});

$(document).on("ready", function() {
	
	$("#recaptcha_widget_div").addClass("hide");
	
	directory.loadTemplates(["HomeView", "BugView", "SearchView", "ContributionView"], function()
	{
		//initialization function called when the templates have been successfully loaded
		
		directory.templates = {};
		
		$("script").each(function(index){
			if($(this).attr("type") == "text/template")
			{
				directory.templates[$(this).attr("id")] = $(this);
			}
		});
		
		directory.store = new directory.Store();
		directory.router = new directory.Router();
		directory.utils = new directory.Utils();
		Backbone.history.start();
		
		//event listener for the search input field on the page header
		
		$("#search").bind("keyup", function(event) {
			value = $(this).val();
			
			directory.router.navigate("search/"+encodeURIComponent(value), true);
		});
	});
});
