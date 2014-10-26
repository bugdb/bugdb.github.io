directory.BugDisplayer = function(controller)
{	
	var self = this;
	
	//@public
	
	this.display = function()
	{
		directory.bugView.hideInfo();
		
		var index = directory.bugView.$("#report > .nav li.active").index();
		index = index == -1 ? 0 : index;
		
		directory.bugView.$(".misc").remove();
		
		directory.bugView.$("#report .nav").empty();
		directory.bugView.$("#report .tab-content").empty();
		directory.bugView.$("#bug_content table tbody").empty();
		directory.bugView.$("#raw > ul.dropdown-menu").empty();
		directory.bugView.$("#descr").empty();
		
		$.each(controller.rawLinks, function(i, link) {
			directory.bugView.$("#raw > ul.dropdown-menu").append('<li><a href="'+link[1]+'" target="_blank">'+link[0]+'</a></li>');
		});
		
		directory.bugView.$("#bug_content .page-header > h3").text(controller.title);
		directory.bugView.$("#bug_content .page-header > span").text(controller.id);
		
		if (controller.reportJSON.hasOwnProperty("links")) {
			directory.bugView.$("#links").removeClass("hide");
		}else{
			directory.bugView.$("#links").addClass("hide");
		}
		
		printCode(controller.simple, directory.store.CONTENT_WORDING.simple);
		printCode(controller.patch, directory.store.CONTENT_WORDING.patch);
		
		printJSON(controller.reportJSON);
		
		printComments();
		
		directory.bugView.$("#report > .nav li:eq("+index+")").addClass("active");
		directory.bugView.$("#report > .tab-content div:eq("+index+")").addClass("active");
	};
	
	//@private
	
	var printJSON = function(json)
	{
		var keyFound = false;
		
		//recursive function to print the report JSON object (transformed in JSON from YAML)
		
		for (var key in json) {
			if (json.hasOwnProperty(key)) {
				if(typeof json[key] == "string")
				{
					$.each(directory.store.HIDDEN_FIELDS, function(i, hiddenKey){
						if(hiddenKey == key)
						{
							keyFound = true;
							return false;
						}
					});
					
					if(keyFound)
					{
						keyFound = false;
						continue;
					}
					
					$.each(directory.store.TABLE_INFO, function(i, tableKey){
						if(tableKey == key)
						{
							keyFound = true;
							return false;
						}
					});
					
					var label = directory.utils.getHTMLLineBreak(json[key]);
					
					switch(key)
					{
						case "type":
							if (directory.store.taxonomy.hasOwnProperty(label))
							{
								var node = directory.store.taxonomy[label];
								
								label = node.text;
								
								if (node.hasOwnProperty("cwe") && node.hasOwnProperty("class"))
								{
									label = ' <a href="'+directory.store.CWE_LINK.replace(directory.store.PATH, node.cwe)+'" target="_blank">'+node.text+' (CWE '+node.cwe+')</a>';
								}
							}
						break;
						case "trace":
							var trace = "";
							
							//generate highlighted trace data
							
							$.each(label.split("<br/>"), function(i, line) {
								if(line != "")
								{
									var pos = -1;
									var indent = "";
									
									$.each(line, function(j, char) {
										if(char != ".") return false;
										pos = j;
										indent += "&nbsp;&nbsp;&nbsp;&nbsp;";
									});

									line = line.substring(pos + 1, line.length);
									
									//code and line number highlight
									
									var reg = new RegExp("([0-9]+[:])");
									var result;
									var lineNumber;
									if ((result = reg.exec(line)) !== null)
									{
										var match = result[0];
										lineNumber = line.substring(line.indexOf(match), line.indexOf(match) + match.length - 1);
										
										line = line.substring(0, line.indexOf(match)) + '<span class="number">' + lineNumber + '</span>:' + '<span class="line">'+line.substring(line.indexOf(match) + match.length, line.length)+'</span>';
									}	
									
									//comments highlight
									
									if(line.indexOf("//") != -1)
									{
										line = '<span class="comment">'+line+'</span>';
									}
									
									//error line highlight
									
									if(line.indexOf("ERROR") != -1)
									{
										line = line.replace("ERROR", '<span class="error">ERROR</span>');
									}
									
									//mapping of call statements to wording / symbols
									
									for(var key in directory.store.CALL_WORDING)
									{
										if(line.indexOf(" "+key) != -1)
										{
											var resource = line.substring(line.indexOf(key) + key.length, line.indexOf("<span") - 1);

											line = line.replace(key, directory.store.CALL_WORDING[key]);
										}
									}
									
									//link generation to the call in commit file and line number
									
									if(controller.reportJSON["bugfix"] != undefined && controller.reportJSON["bugfix"]["hash"] != undefined)
									{
										reg = new RegExp("([a-zA-Z0-9_.-]+[/]+)+([a-zA-Z0-9_.-])+");
										
										if((result = reg.exec(line)) !== null)
										{
											match = result[0];
											
											var link = directory.store.COMMIT_LINK + controller.reportJSON["bugfix"]["hash"];
											link = link.replace("commit", "tree/"+match);
											link = link + "^#n" + lineNumber;
											
											line = line.replace(match, '<a href="'+link+'" target="_blank">'+match+'</a>');
										}
									}
									
									trace += indent + '<span class="trace">'+line+'</span>' + "<br/>";
								}
							});
							
							label = trace != "" ? trace : label;
							
							directory.bugView.$("#report .nav").append('<li><a href="#'+key+'" role="tab" data-toggle="tab">'+getFieldWording(key)+'</a></li>');
							directory.bugView.$("#report .tab-content").append('<div class="tab-pane" id="'+key+'">'+label+'</div>');
							continue;
						break;
						case "descr":
							label = label.replace(label.split('<br/>')[0]+'<br/>', "");
							directory.bugView.$("#descr").html(label);
							continue;
						break;
						case "links":
							directory.bugView.$("#links > ul.dropdown-menu").html(directory.utils.getHTMLLink(json[key]));
							continue;
						break;
						case "hash":
							directory.bugView.$("#commit_info a:eq(0)").attr("href", directory.store.COMMIT_LINK+label);
							directory.bugView.$("#commit_info a:eq(0)").text(label.substring(0, 11));
							directory.bugView.$("#commit_info a:eq(1)").attr("href", directory.store.COMMIT_LINK.replace("commit", "tree")+label+"^");
							continue;
						break;
						case "config":
							$.each(controller.config, function(i, conf) {
								label = label.replace(conf, '<a href="'+directory.store.CATEE_LINK+conf+'" target="_blank">'+conf+'</a>');
							});
							
							label += " ("+directory.utils.getOrdinal(controller.bugDegree)+" degree)";
						break;
						default:
						break;
					}
					
					if(label != "")
					{
						if(keyFound)
						{
							//written in the table
							
							directory.bugView.$("#bug_content table tbody").append("<tr><th>"+getFieldWording(key)+"</th><td>"+label+"</td></tr>");
							
							keyFound = false;
						}else{
							//written in the page
							
							directory.bugView.$("#descr + .row").after('<h3 class="misc">'+getFieldWording(key)+'</h3><p class="misc">'+label+'</p>');
						}						
					}
				}else{
					printJSON(json[key]);
				}
			}
		}
	};
	
	var printCode = function(program, label)
	{
		if(program == null) return;

		var codeId = label.replace(" ", "_").toLowerCase();
		
		var container = $('<div class="tab-pane" id="'+codeId+'"></div>');
		var code = $('<code class="language-c">'+program+'</code>');
		
		container.append(code);	
		
		directory.bugView.$("#report .nav").append('<li><a href="#'+codeId+'" role="tab" data-toggle="tab">'+label+'</a></li>');
		directory.bugView.$("#report .tab-content").append(container);
		
		code.syntaxHighlight();
		
		if(!(code.find("li:first-child span:first-child").text().indexOf("diff") != -1))
		{	
			//highlight of the error comment of the simplified bug
			
			code.find(".com").each(function(i, comment) {
				if($(comment).text().indexOf("ERROR") != -1)
				{
					$(comment).parent().addClass("red");
				}
			});
		}else{
			//highlight of diff of the patch file (- and +)
			
			code.find("li span.pln:first-child").each(function(i, char) {
				if($(char).text() == "")
				{
					if($(char).next(".pun").text().indexOf("+") != -1)
					{
						$(char).parent().addClass("green");
					}else if($(char).next(".pun").text().indexOf("-") != -1)
					{
						$(char).parent().addClass("red");
					}
				}
			});
		}
	};
	
	var printComments = function()
	{
		//we load the tab template from the index page
		
		var tab = $('<div class="tab-pane" id="comments">'+directory.templates["comment_tab"].html()+'</div>');
		
		if(controller.comments == undefined)
		{
			tab.find("span").removeClass("hide");
		}else{
			$.each(controller.comments, function(i, com) {		
				var json = {
						"author":com.author,
						"date":com.date,
						"content":com.content,
				};
				
				//we load block templates from the index page and create one block per comment
				
				var block = _.template(directory.templates["comment_block"].html(), json);
				
				tab.find("section").append(block);
			});	
		}
		
		directory.bugView.$("#report .nav").append('<li><a href="#comments" role="tab" data-toggle="tab">'+directory.store.DISCUSSION_TAB_LABEL+'</a></li>');
		directory.bugView.$("#report .tab-content").append(tab);
	};
	
	var getFieldWording = function(field)
	{
		if (directory.store.FIELD_WORDING.hasOwnProperty(field))
		{
			return directory.store.FIELD_WORDING[field];
		}
		
		return directory.utils.getSentenceUppercase(field);
	};
};

directory.BugDisplayer.prototype = directory.BugDisplayer;