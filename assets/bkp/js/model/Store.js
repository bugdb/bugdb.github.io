directory.Store = function()
{	
	//constants
	this.REPOSITORY = "iago/spl-bugs";
	this.BRANCH = "default/";
	this.FOLDERS = ["report", "simple", "patch"];
		
	this.TABLE_INFO = ["type", "symptom", "keywords", "config", "source", "fix-in", "C-features", "loc"];
	this.HIDDEN_FIELDS = ["repo", "source"];
		
	this.PATH = "{path}";
	this.RESOURCE_PATH = "https://bitbucket.org/api/1.0/repositories/"+this.REPOSITORY+"/src/"+this.BRANCH+this.PATH;
	this.RAW_LINK = "https://bitbucket.org/"+this.REPOSITORY+"/raw/"+this.BRANCH+this.PATH;
	this.TAXONOMY_PATH = "taxonomy";
	
	this.COMMENTS = "data/comments.json";
	this.COMMENTS_WEBSERVICE = "script/comments.php";
	
	this.NEWS = "data/news/";
	this.NEWS_WEBSERVICE = "script/news.php";
	
	this.COMMIT_LINK = "http://git.kernel.org/cgit/linux/kernel/git/stable/linux-stable.git/commit/?id=";

	this.CWE_LINK = "http://cwe.mitre.org/data/definitions/"+this.PATH+".html";
	this.CATEE_LINK = "http://cateee.net/lkddb/web-lkddb/";
	
	this.RECAPTCHA_PUBLIC_KEY = "6LcSC_cSAAAAAOn0-n9O2c6WlZ7Mld2rN31psKLx";
	
	this.DISCUSSION_TAB_LABEL = "Discussion";
	
	//arrays
	this.bugs = [];
	this.news = [];
	
	//dictionary
	this.categories = new TwoDimensionsDictionary();
	
	//objects
	this.CONTENT_WORDING = {
			"report" : "Info",
			"simple" : "Simplified bug",
			"patch" : "Simplified patch"
	};
	this.FIELD_WORDING = {
			"descr" : "Description",
			"loc" : "Location"
	};
	this.INDEX_WORDING = {
			"type" : "Bug type",
			"fix-in" : "Fix-in",
			"config" : "Configuration",
			"deg" : "Degree",
			"C-features" : "C-features"
	};
	this.CALL_WORDING = {
			"call" : "&#8618;",
			"dyn-call" : "&#8627;"
	};
	this.taxonomy = null;
	
	//data provider
	this.bugLoader = new directory.BugLoader();
	this.newsLoader = new directory.NewsLoader();
};