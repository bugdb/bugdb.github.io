directory.BugView = directory.AView.extend({
	
	bugId : null,
	
	init : function() {
		$.SyntaxHighlighter.init();
		this.index = 0;
	},
	
	build : function(id) {
		this.bugId = id;
		
		directory.BugView.__super__.build.apply(this);
	},
	
	load : function() {
		self = this;
		
		this.loadData(directory.store.bugLoader, directory.store.bugLoader.isLoadedEvent, this.bugId);
	},
	
	loaded : function() {
		this.display(this.bugId);
	},

	buildComments : function() {
		this.$('#comments_modal').on('hidden.bs.modal', function() {
			
			//call when the comment pop up is closed
			
			Recaptcha.destroy();
			
			self.$(".modal-body > center").addClass("hide");
			
			self.$("#comments_modal .alert-warning").addClass("hide");
			self.$("#comments_modal .alert-danger").addClass("hide");
			self.$("#comments_modal .alert-success").addClass("hide");
			
			self.$("#comments_modal textarea").val("");
		});
		
		this.$('#comments_modal').on('show.bs.modal', function() {
			
			//call when the comment pop up is opened
			
			Recaptcha.create(directory.store.RECAPTCHA_PUBLIC_KEY, 'recaptcha', {
				theme: "clean",
				callback: Recaptcha.focus_response_field
			});
			
			self.$("#submit").unbind("click");
			self.$("#submit").bind("click", function(event) {
				
				//function called when a new comment is submitted
				
				var id = self.$("#bug_content .page-header > span").text();
				var content = self.$("#comments_modal textarea").val();
				var email = self.$("#email_field").val();
				var challenge = Recaptcha.get_challenge();
				var response = Recaptcha.get_response();
				
				self.$(".modal-body > center").removeClass("hide");
				
				if (id != "" && content != "" && (email == "" || directory.utils.isValidEmail(email)) && challenge != "" && response != "")
				{
					$.ajax({
						url : directory.store.COMMENTS_WEBSERVICE,
						type : "POST",
						data : {
							id : id,
							author : self.$("#name_field").val() != "" ? self.$("#name_field").val() : "anonymous",
							email: email,
							content : content,
							challenge : challenge,
							response : response
						},
						success : function(data) {
							if(data == "success")
							{
								directory.store.bugLoader.loadComments();

								self.$("#comments_modal .alert-success").removeClass("hide");
								self.$("#comments_modal .alert-danger").addClass("hide");
								self.$("#comments_modal .alert-warning").addClass("hide");					
							}else{
								self.$("#comments_modal .alert-danger").text(data);

								self.$("#comments_modal .alert-danger").removeClass("hide");
								self.$("#comments_modal .alert-success").addClass("hide");
								self.$("#comments_modal .alert-warning").addClass("hide");
							}
							
							window.setTimeout(function() {
								self.$("#comments_modal").modal("hide");
							}, 900);
							
							self.$(".modal-body > center").addClass("hide");
						},
						error : function(data) {
							console.log(data);
							self.$(".modal-body > center").addClass("hide");
						}
					});
				} else {
					self.$("#comments_modal .alert-warning").removeClass("hide");
					self.$("#comments_modal .alert-danger").addClass("hide");
					self.$("#comments_modal .alert-success").addClass("hide");
					self.$(".modal-body > center").addClass("hide");
				}
			});
		});
	},
	
	display : function(id)
	{
		self = this;
		
		this.bugId = id;
		
		this.buildComments();
		
		if(this.bugId != null && this.bugId != undefined && this.bugId != "")
		{
			var isFound = false;
			
			$.each(directory.store.bugs, function(i, bug) {
				if(self.bugId == bug.id)
				{
					directory.store.bugs[i].display();
					
					isFound = true;
					
					return false;
				}
			});
			
			if(!isFound)
			{
				this.showInfo();
			}	
		}else{
			this.showInfo();
		}
		
		directory.router.navigate("bug/"+this.bugId);
		
		this.toggleNav();
	},
	
	showInfo : function()
	{
		this.$("#bug_content").addClass("hide");
		this.$("#info").removeClass("hide");
	},
	
	hideInfo : function()
	{
		this.$("#info").addClass("hide");
		this.$("#bug_content").removeClass("hide");
	}
}); 