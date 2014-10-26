directory.ContributionView = directory.AView.extend({
	
	init : function() {
		this.index = 3;
	},
	
	load : function() {
		self = this;
	},
	
	display : function() {
		this.toggleNav();
	}
});
