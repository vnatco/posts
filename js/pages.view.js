if(typeof Home!=="object") Home={};

Home.view={};
Home.view.item={};

Home.view.refresh=function(){
	
}

Home.view.item.moveUp=function(obj){
	var prev=obj.prev();
	if(prev.length>0) obj.detach().insertBefore(prev);
	
	Home.view.item.saveOrder(obj.parents(".viewPage").first());
}
Home.view.item.moveDown=function(obj){
	var next=obj.next();
	if(next.length>0) obj.detach().insertAfter(next);
	
	Home.view.item.saveOrder(obj.parents(".viewPage").first());
}
Home.view.item.remove=function(obj){
	_content='<div style="margin:10px;">You are going to delete selected field. This action can\'t be undone. Are you sure?</div>';
	var popup=new jPopup(_content,{buttons:[{text:"Confirm",class:"chateauGreen",callback:function(e){
												e.close(true);
												
												// Confirmed
												Post("field","delete",{id:obj.attr("data-id")},function(data){
													var parent=obj.parents(".viewPage").first();
													obj.parents(".viewPage").first().find(".vpItemPointer").css({opacity:0});
													obj.remove();
													Home.view.item.saveOrder(parent);
												},function(){});
												
											},triggerKey:false},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 leftFooter:false,
									 closeOnBgClick:true,
									 width:420});
	setTimeout(function(){popup.open();},200);
}
Home.view.item.edit=function(obj){
	var _textareaId=GetUID();
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(){};
	var cmView;
	var $_leftFooter=false;
	var _width=false;
	
	var $c=obj.find(">div");
	var modeName=$c.attr("data-modeName");
	if(modeName===undefined||modeName==="") modeName="Plain Text";
	
	// - Prepare popup content and callbacks
	if($c.hasClass("text")){
		// TEXT
		_content='<div style="height:428px;overflow:hidden;"><textarea style="height:360px;" id="pTextEditor_'+_textareaId+'"></textarea></div>';
		_onLoaded=function(){
			tinyMCE.execCommand('mceAddEditor',false,"pTextEditor_"+_textareaId);
			tinyMCE.get("pTextEditor_"+_textareaId).setContent($c.html());
		}
		_onOpened=function(){tinyMCE.execCommand('mceFocus',false,"pTextEditor_"+_textareaId);}
	}else if($c.hasClass("code")){
		// CODE
		_content='<div style="height:428px;overflow:hidden;"><div id="pCodeEditor_'+_textareaId+'" style="height:100%"></div></div>';
		_onLoaded=function(e){
			CodeMirror.modeURL="lib/codemirror/mode/%N/%N.js";
			cmView=CodeMirror(document.getElementById("pCodeEditor_"+_textareaId),{value:$c.find(">pre").text(),mode:"text/html",styleActiveLine:true,lineNumbers:true});
			var ext=CodeMirror.findModeByName(modeName);
			CodeMirror.autoLoadMode(cmView,ext.mode);
			cmView.setOption("mode",ext.mime);
			cmView.setOption("theme","base16-dark");
			cmView.setOption("scrollbarStyle","simple");
			
			new jScrollBox(e.$.find(".dropDown>.dropDownContent>.dropDownItems"),{step:180,scroll:{color:"#FFFFFF"}});
		}
		_onOpened=function(){
			cmView.refresh();
			cmView.focus();
		}
		
		
		if(typeof CodeMirror.modeInfo==="object"){
			$_leftFooter=$('<div class="dropDown"><div class="dropDownHeader ns">Mode: '+modeName+'</div><div class="dropDownContent"><div class="dropDownItems"><div class="dropDownItemsContent"></div></div></div>');
			$.each(CodeMirror.modeInfo,function(i,info){$("<div />").attr("data-value",info.name).addClass("dropDownItem ns").append(info.name).appendTo($_leftFooter.find(".dropDownItems>.dropDownItemsContent"));});
			
			$_leftFooter.find(".dropDownContent").bind("mouseenter",function(){$(this).parent().addClass("hovered");});
			$_leftFooter.find(".dropDownContent").bind("mouseleave",function(){$(this).parent().removeClass("hovered");});
			
			$_leftFooter.find(".dropDownHeader").bind("click",function(){
				$(this).parents(".dropDown").find(".dropDownContent").fadeIn(140);
				$(this).parents(".dropDown").addClass("opened");
			});
			$_leftFooter.find(".dropDownItem").bind("click",function(){
				$(this).parents(".dropDown").find(".dropDownHeader").empty().append("Mode: "+$(this).text());
				$(this).parents(".dropDown").find(".dropDownContent").fadeOut(140);
				$(this).parents(".dropDown").removeClass("opened");
				
				var ext=CodeMirror.findModeByName($(this).text());
				CodeMirror.autoLoadMode(cmView,ext.mode);
				cmView.setOption("mode",ext.mime);
				
				cmView.refresh();
			});
			
			$(document).bind("mouseup",function(){
				$(".dropDown.opened:not(.hovered)>.dropDownContent").fadeOut(140);
				$(".dropDown.opened:not(.hovered)").removeClass("opened");
			});
		}
	}else if($c.hasClass("image")){
		// IMAGE
		_width=420;
		_content='<div class="fafHolder"><div style="display:none;" class="fileUploadFrame icUpload" id="pImageUpload_'+_textareaId+'" data-allowed="jpg,jpeg,png,bmp,gif"><div><strong>Choose a file</strong> or drop it here.</div></div><input type="file" /></div>';
		_onLoaded=function(){}
		_onOpened=function(){
			$("#pImageUpload_"+_textareaId).trigger("upload-progress-changed",{data:$c.find(">img").attr("src")});
			setTimeout(function(){
				$("#pImageUpload_"+_textareaId).show();
			},240);
		}
		
		$_leftFooter=$('<div class="pOptions">'+
						'<table>'+
						  '<tr>'+
							'<td>'+
								'<div class="alignSelector">'+
									'<div data-value="left">L</div>'+
									'<div data-value="center">C</div>'+
									'<div data-value="right">R</div>'+
								'</div>'+
							'</td>'+
							'<td><div style="width:10px;"></div></td>'+
							'<td><input type="text" class="iWidth" placeholder="Width" /></td>'+
							'<td><div style="width:10px;"></div></td>'+
							'<td><input type="text" class="iHeight" placeholder="Height" /></td>'+
						  '</tr>'+
						'</table>'+
					   '</div>');
		$_leftFooter.find(".alignSelector>div[data-value='"+($c.attr("data-align")!==undefined?$c.attr("data-align"):"left")+"']").addClass("active");
		$_leftFooter.find(".iWidth").val(($c.attr("data-width")!==undefined?$c.attr("data-width"):""));
		$_leftFooter.find(".iHeight").val(($c.attr("data-height")!==undefined?$c.attr("data-height"):""));
		
		$(document).on("upload-progress-changed","#pImageUpload_"+_textareaId,function(e,obj){
			var el=$(this);
			var fHeight=244;
			if(obj.data===false) return;
		
			el.parent().append('<div class="viewUploadedFrame" style="opacity:0;"><div class="icRemove"></div></div>');
			var $img=$('<img src="'+obj.data+'" />').load(function(){
				$(this).appendTo(el.parent().find(">.viewUploadedFrame"));
				if($(this).width()<_width&&$(this).height()<fHeight){
					$(this).css({"margin-top":((fHeight/2)-($(this).height()/2)),"margin-left":((_width/2)-($(this).width()/2))});
				}else{
					$(this).width(_width);
					$(this).css({"margin-top":((fHeight/2)-($(this).height()/2))});
					if($(this).height()<fHeight){
						$(this).height(fHeight);
						$(this).css({"margin-top":0,"margin-left":((_width/2)-($(this).width()/2))});
					}
				}
				el.parent().find(">.viewUploadedFrame").css({opacity:1});
			});
			el.parent().find(">.viewUploadedFrame").one("click",function(){
				el.removeClass("inProcess").removeClass("icLoading").addClass("icUpload");
				el.find(">div").empty().append('<strong>Choose a file</strong> or drop it here.');
				$(this).fadeOut(220,function(){
					$(this).remove();
				});
			});
		});
		
	}else if($c.hasClass("file")){
		// FILE
		_content='<div style="height:428px;overflow:hidden;"></div>';
		_onLoaded=function(){}
		_onOpened=function(){}
	}else return false;
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												// - Apply Changes after Save Button clicked
												if($c.hasClass("text")){
													// TEXT
													var text=tinyMCE.get(e.$.find("textarea").attr("id")).getContent();
													if($(text).text().replace(/\s/g,"")=="") tinyMCE.execCommand('mceFocus',false,"pTextEditor_"+e.$.find("textarea").attr("id"));
													else{
														// Save it in database and in case of success, append new element
														Post("field","update",{id:obj.attr("data-id"),content:text,meta:""},function(data){
															obj.find(">.text").empty().append(text);
															e.close(true);
														},function(){
															e.$.find("input.title").focus();
														});
													}
												}else if($c.hasClass("code")){
													// CODE
													var text=cmView.getValue();
													if(text.replace(/\s/g,"")=="") cmView.focus();
													else{
														// Save it in database and in case of success, append new element
														Post("field","update",{id:obj.attr("data-id"),content:text,meta:JSON.stringify({mode:e.$.find(".dropDownHeader").text().replace("Mode: ","")})},function(data){
															obj.find(">.code>pre>code").empty().append(escapeHtml(text));
															obj.find(">.code>pre").removeClass("prettyprinted");
															obj.find(">.code").attr("data-modeName",e.$.find(".dropDownHeader").text().replace("Mode: ",""));
															PR.prettyPrint();
															
															e.close(true);
														},function(){
															e.$.find("input.title").focus();
														});
													}
												}else if($c.hasClass("image")){
													// IMAGE
													var $img=e.$.find(".viewUploadedFrame>img");
													if($img.length===1){
														var __align=e.$.find(".pOptions .alignSelector>div.active").attr("data-value");
														var __width=e.$.find(".pOptions .iWidth").val().replace(/[^0-9\%]/g,"");
														var __height=e.$.find(".pOptions .iHeight").val().replace(/[^0-9\%]/g,"");
														
														// Save it in database and in case of success, append new element
														Post("field","update",{id:obj.attr("data-id"),content:$img.attr("src"),meta:JSON.stringify({align:__align,width:__width,height:__height})},function(data){
															obj.find(">.image>img").attr("src",$img.attr("src"));
															obj.find(">.image").attr("data-align",__align).attr("align",__align);
															if(__width!=""){
																if(__width.indexOf("%")==-1) __width+="px";
																obj.find(">.image").attr("data-width",__width).find(">img").width(__width);
															}else obj.find(">.image").attr("data-width","").find(">img").width("");
															if(__height!=""){
																if(__height.indexOf("%")==-1) __height+="px";
																obj.find(">.image").attr("data-height",__height).find(">img").height(__height);
															}else obj.find(">.image").attr("data-height","").find(">img").height("");
															
															e.close(true);
														},function(){
															e.$.find("input.title").focus();
														});
													}else{
														e.$.find(".fileUploadFrame>div").css({color:"#f8675f"});
														setTimeout(function(){e.$.find(".fileUploadFrame>div").css({color:"#FFFFFF"});},620);
													}
												}else if($c.hasClass("file")){
													// FILE
												}
												
												///////////////////////////
												// - Send Data to Save - //
												///////////////////////////
												
												
											}},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 leftFooter:$_leftFooter,
									 width:_width,
									 closeOnBgClick:false});
									 
	setTimeout(function(){popup.open();},200);
}

Home.view.item.saveOrder=function(obj){
	var orderIds=[];
	$.each(obj.find(".viewPageContent>.vpItems>.vpItemsHolder>.vpItem"),function(){
		orderIds.push($(this).attr("data-id"));
	});
	if(orderIds.length>0) Post("field","order",{post_id:obj.attr("data-id"),ids:orderIds.join(",")});
}

$(window).resize(function(){
	Home.view.refresh();
});

// MOUSE
$(document).on("mousedown",".viewPage:not(.shared) .vpItems>.vpItemsHolder>.vpItem",function(e){
	var obj=$(this);
	if(e.which===3){
		Context.open({x:e.pageX,y:e.pageY},Context.getViewFieldStack(function(){Home.view.item.moveUp(obj);},
																	 function(){Home.view.item.moveDown(obj);},
																	 function(){Home.view.item.remove(obj);},
																	 function(){Home.view.item.edit(obj);}),{delay:400,color:"random"});
	}
});
$(document).bind("mouseup",function(e){
	
});


$(document).on("mouseenter",".vpItems>.vpItemsHolder>.vpItem",function(e){
	$(this).parents(".viewPage").first().find(".vpItemPointer").stop(true,false).animate({top:$(this).position().top,height:$(this).outerHeight(),opacity:1},240,function(){});
});
$(document).on("mouseleave",".vpItems",function(e){
	//$(this).parents(".viewPage").first().find(".vpItemPointer").stop(true,false).animate({opacity:0},140,function(){});
});

$(document).on("click",".alignSelector>div",function(){
	$(this).parent().find(">div").removeClass("active");
	$(this).addClass("active");
});

$(document).on("click",".vpItem>.image.opIm>img",function(){
	window.open($(this).attr("src"));
});


// ADD NEW TEXT
$(document).on("click",".viewPage .addNew button.text",function(){
	var $vp=$(this).parents(".viewPage").first();
	var _textareaId=GetUID();
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(){};
	
	_content='<div style="height:428px;overflow:hidden;"><textarea style="height:360px;" id="pTextEditor_'+_textareaId+'"></textarea></div>';
	_onLoaded=function(){tinyMCE.execCommand('mceAddEditor',false,"pTextEditor_"+_textareaId);}
	_onOpened=function(){tinyMCE.execCommand('mceFocus',false,"pTextEditor_"+_textareaId);}
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												var text=tinyMCE.get(e.$.find("textarea").attr("id")).getContent();
												if($(text).text().replace(/\s/g,"")=="") tinyMCE.execCommand('mceFocus',false,"pTextEditor_"+e.$.find("textarea").attr("id"));
												else{
													// Save it in database and in case of success, append new element
													Post("field","insert",{post_id:$vp.attr("data-id"),type_id:1,content:text,meta:""},function(data){
														$vp.find(".vpItems>.vpItemsHolder").append('<div class="vpItem" data-id="'+data+'"><div class="text">'+text+'</div></div>');
														e.close(true);
														
														Home.view.item.saveOrder($vp);
													},function(){
														e.$.find("input.title").focus();
													});
												}
											}},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 closeOnBgClick:false});
									 
	setTimeout(function(){popup.open();},200);
});

// ADD NEW IMAGE
$(document).on("click",".viewPage .addNew button.image",function(){
	var $vp=$(this).parents(".viewPage").first();
	
	var _textareaId=GetUID();
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(){};
	var $_leftFooter=false;
	var _width=false;
	
	_width=420;
	_content='<div class="fafHolder"><div style="display:none;" class="fileUploadFrame icUpload" id="pImageUpload_'+_textareaId+'" data-allowed="jpg,jpeg,png,bmp,gif"><div><strong>Choose a file</strong> or drop it here.</div></div><input type="file" /></div>';
	_onLoaded=function(){}
	_onOpened=function(){$("#pImageUpload_"+_textareaId).show();}
	
	$_leftFooter=$('<div class="pOptions">'+
					'<table>'+
					  '<tr>'+
						'<td>'+
							'<div class="alignSelector">'+
								'<div data-value="left">L</div>'+
								'<div data-value="center">C</div>'+
								'<div data-value="right">R</div>'+
							'</div>'+
						'</td>'+
						'<td><div style="width:10px;"></div></td>'+
						'<td><input type="text" class="iWidth" placeholder="Width" /></td>'+
						'<td><div style="width:10px;"></div></td>'+
						'<td><input type="text" class="iHeight" placeholder="Height" /></td>'+
					  '</tr>'+
					'</table>'+
				   '</div>');
	$_leftFooter.find(".alignSelector>div[data-value='left']").addClass("active");
	$_leftFooter.find(".iWidth").val("");
	$_leftFooter.find(".iHeight").val("");
	
	$(document).on("upload-progress-changed","#pImageUpload_"+_textareaId,function(e,obj){
		var el=$(this);
		var fHeight=244;
		if(obj.data===false) return;
	
		el.parent().append('<div class="viewUploadedFrame" style="opacity:0;"><div class="icRemove"></div></div>');
		var $img=$('<img src="'+obj.data+'" />').load(function(){
			$(this).appendTo(el.parent().find(">.viewUploadedFrame"));
			if($(this).width()<_width&&$(this).height()<fHeight){
				$(this).css({"margin-top":((fHeight/2)-($(this).height()/2)),"margin-left":((_width/2)-($(this).width()/2))});
			}else{
				$(this).width(_width);
				$(this).css({"margin-top":((fHeight/2)-($(this).height()/2))});
				if($(this).height()<fHeight){
					$(this).height(fHeight);
					$(this).css({"margin-top":0,"margin-left":((_width/2)-($(this).width()/2))});
				}
			}
			el.parent().find(">.viewUploadedFrame").css({opacity:1});
		});
		el.parent().find(">.viewUploadedFrame").one("click",function(){
			el.removeClass("inProcess").removeClass("icLoading").addClass("icUpload");
			el.find(">div").empty().append('<strong>Choose a file</strong> or drop it here.');
			$(this).fadeOut(220,function(){
				$(this).remove();
			});
		});
	});
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												var $img=e.$.find(".viewUploadedFrame>img");
												if($img.length===1){
													var obj=$('<div />').addClass("vpItem").append('<div class="image" data-align="left" align="left"><img src="" class="ns" draggable="false" /></div>');
													
													var __align=e.$.find(".pOptions .alignSelector>div.active").attr("data-value");
													var __width=e.$.find(".pOptions .iWidth").val().replace(/[^0-9\%]/g,"");
													var __height=e.$.find(".pOptions .iHeight").val().replace(/[^0-9\%]/g,"");
													
													obj.find(">.image").attr("data-align",__align).attr("align",__align);
													if(__width!=""){
														if(__width.indexOf("%")==-1) __width+="px";
														obj.find(">.image").attr("data-width",__width).find(">img").width(__width);
													}else obj.find(">.image").attr("data-width","").find(">img").width("");
													if(__height!=""){
														if(__height.indexOf("%")==-1) __height+="px";
														obj.find(">.image").attr("data-height",__height).find(">img").height(__height);
													}else obj.find(">.image").attr("data-height","").find(">img").height("");
													
													// Save it in database and in case of success, append new element
													Post("field","insert",{post_id:$vp.attr("data-id"),type_id:3,content:$img.attr("src"),meta:JSON.stringify({align:__align,width:__width,height:__height})},function(data){
														obj.attr("data-id",data);
														obj.find(">.image>img").attr("src",$img.attr("src"));
														$vp.find(".vpItems>.vpItemsHolder").append(obj);
														e.close(true);
														
														Home.view.item.saveOrder($vp);
													},function(){
														e.$.find("input.title").focus();
													});
													
												}else{
													e.$.find(".fileUploadFrame>div").css({color:"#f8675f"});
													setTimeout(function(){e.$.find(".fileUploadFrame>div").css({color:"#FFFFFF"});},620);
												}
											}},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 leftFooter:$_leftFooter,
									 width:_width,
									 closeOnBgClick:false});
									 
	setTimeout(function(){popup.open();},200);
});

// ADD NEW CODE
$(document).on("click",".viewPage .addNew button.code",function(){
	var $vp=$(this).parents(".viewPage").first();
	var _textareaId=GetUID();
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(){};
	var cmView;
	var $_leftFooter=false;
	
	var modeName="Plain Text";
	
	_content='<div style="height:428px;overflow:hidden;"><div id="pCodeEditor_'+_textareaId+'" style="height:100%"></div></div>';
	_onLoaded=function(e){
		CodeMirror.modeURL="lib/codemirror/mode/%N/%N.js";
		cmView=CodeMirror(document.getElementById("pCodeEditor_"+_textareaId),{value:"",mode:"text/html",styleActiveLine:true,lineNumbers:true});
		var ext=CodeMirror.findModeByName(modeName);
		CodeMirror.autoLoadMode(cmView,ext.mode);
		cmView.setOption("mode",ext.mime);
		cmView.setOption("theme","base16-dark");
		cmView.setOption("scrollbarStyle","simple");
		
		new jScrollBox(e.$.find(".dropDown>.dropDownContent>.dropDownItems"),{step:180,scroll:{color:"#FFFFFF"}});
	}
	_onOpened=function(){
		cmView.refresh();
		cmView.focus();
	}
	
	if(typeof CodeMirror.modeInfo==="object"){
		$_leftFooter=$('<div class="dropDown"><div class="dropDownHeader ns">Mode: '+modeName+'</div><div class="dropDownContent"><div class="dropDownItems"><div class="dropDownItemsContent"></div></div></div>');
		$.each(CodeMirror.modeInfo,function(i,info){$("<div />").attr("data-value",info.name).addClass("dropDownItem ns").append(info.name).appendTo($_leftFooter.find(".dropDownItems>.dropDownItemsContent"));});
		
		$_leftFooter.find(".dropDownContent").bind("mouseenter",function(){$(this).parent().addClass("hovered");});
		$_leftFooter.find(".dropDownContent").bind("mouseleave",function(){$(this).parent().removeClass("hovered");});

		$_leftFooter.find(".dropDownHeader").bind("click",function(){
			$(this).parents(".dropDown").find(".dropDownContent").fadeIn(140);
			$(this).parents(".dropDown").addClass("opened");
		});
		$_leftFooter.find(".dropDownItem").bind("click",function(){
			$(this).parents(".dropDown").find(".dropDownHeader").empty().append("Mode: "+$(this).text());
			$(this).parents(".dropDown").find(".dropDownContent").fadeOut(140);
			$(this).parents(".dropDown").removeClass("opened");
			
			var ext=CodeMirror.findModeByName($(this).text());
			CodeMirror.autoLoadMode(cmView,ext.mode);
			cmView.setOption("mode",ext.mime);
			
			cmView.refresh();
		});
		
		$(document).bind("mouseup",function(){
			$(".dropDown.opened:not(.hovered)>.dropDownContent").fadeOut(140);
			$(".dropDown.opened:not(.hovered)").removeClass("opened");
		});
	}
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												var text=cmView.getValue();
												if(text.replace(/\s/g,"")=="") cmView.focus();
												else{
													
													
													// Save it in database and in case of success, append new element
													Post("field","insert",{post_id:$vp.attr("data-id"),type_id:2,content:text,meta:JSON.stringify({mode:e.$.find(".dropDownHeader").text().replace("Mode: ","")})},function(data){
														$vp.find(".vpItems>.vpItemsHolder").append('<div class="vpItem" data-id="'+data+'"><div class="code" data-modeName="'+e.$.find(".dropDownHeader").text().replace("Mode: ","")+'"><pre class="prettyprint theme-snappy"><code>'+escapeHtml(text)+'</code></div></div>');
														PR.prettyPrint();
														e.close(true);
														
														Home.view.item.saveOrder($vp);
													},function(){
														e.$.find("input.title").focus();
													});
												}
											}},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 leftFooter:$_leftFooter,
									 closeOnBgClick:false});
									 
	setTimeout(function(){popup.open();},200);
});