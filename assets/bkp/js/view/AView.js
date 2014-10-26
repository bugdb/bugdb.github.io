directory.AView = Backbone.View.extend({
	
	index : 0,
	self : null,

	initialize : function() {
		this.on("change", this.render, this);
		this.init();
	},
	
	init : function() {
		console.log("override the init method");
	},
	
	build : function() {
		this.trigger("change");
		
		this.load();

		this.toggleNav();
	},
	
	toggleNav : function() {
		//call to change the active link in the header's navigation
		
		$("#header .nav li").removeClass("active");
		$("#header .nav li:nth-child("+this.index+")").addClass("active");
	},
	
	load : function() {
		console.log("override the load method");
	},
	
	loadData : function(loader, type, params) {
		$(loader).bind(type, function() {
			$(loader).unbind(type);

			self.loaded();
		});
		
		loader.load(params);
	},
	
	loaded : function() {
		console.log("override the loaded method");
	},
	
	display : function() {
		console.log("override the display method");
	},

	render : function() {
		this.$el.html(this.template());

		return this;
	}
}); 