if(typeof Home!=="object") Home={};

Home.bubbles={};
Home.bubbles.list=[];
Home.bubbles.bubble={};

Home.bubbles.refresh=function(){
	var sW=$(".pageHome .bubbles").width();
	var pad=20;
	
	$.each($(".bubbles"),function(){
		var bH=$(this).find(">.bubble").first().outerHeight(true);
		var xPos=pad;
		var yPos=pad;

		$.each($(this).find(">.bubble"),function(i){
			if(xPos+pad+$(this).outerWidth(true)>sW){
				xPos=pad;
				yPos+=bH+pad;
			}
			
			var $bubble=$(this),t=yPos,l=xPos;
			setTimeout(function(){
				$bubble.css({top:t,left:l,opacity:1});
				$bubble.next().css({top:t+$bubble.find(">div").position().top,left:l+$bubble.find(">div").position().left,opacity:1});
			},10*i);
			
			xPos+=$bubble.outerWidth(true)+pad;
		});
		$(this).height(yPos+bH+pad);
	});
}

Home.bubbles.open=function(el){
	ShowLoader();
	__OL_PreventClick=true;
	Menu.preventClick=true;
	Menu.hideIcon(320,"easeOutSine",function(){});
	Menu.hideCircle(600,function(){
		Menu.animateCircle(800,"easeOutCubic",true,function(){
			Menu.showCircle(800,function(){
				Menu.showIcon("arrow",320,240,"easeOutSine");
				Menu.onClickAction="goBack";
				Menu.preventClick=false;
			});
		});
		Pages.push("get.php",{w:"groups",id:el.attr("data-id")},el.find(">div").html(),true,function(data){
			Menu.stopCircleAnimation();
			HideLoader();
			__OL_PreventClick=false;
		});
	});
}

$(window).resize(function(){
	Home.bubbles.refresh();
});

Home.bubbles.bubble.mouseDown=function(el,e){
	el.addClass("pressed");
	document.getSelection().removeAllRanges();
	
	if(e.which==3){
		Context.open({x:e.pageX,y:e.pageY},Context.getBubbleStack(function(){
			Home.bubbles.bubble.moveLeft(el);
		},function(){
			Home.bubbles.bubble.moveRight(el);
		},function(){
			Home.bubbles.bubble.remove(el);
		},function(){
			Home.bubbles.bubble.edit(el);
		}),{delay:400});
	}
}
Home.bubbles.bubble.click=function(el,e){
	if(e.which==1) Home.bubbles.open(el);
}

// BUBBLE CONTEXT MENU FUNCTIONS
Home.bubbles.bubble.add=function(obj){
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(e){e.$.find("input.title").focus();};
	
	_content+='<div style="margin:10px;" class="default">';
		_content+='Category Name';
		_content+='<div style="margin:10px 0px 10px 0px;">';
		_content+='<input class="title" type="text" placeholder="Enter new category name" style="width:384px;" value="" />';
		_content+='</div>';
		
		_content+='Choose Color';
		_content+='<div class="colors" style="margin:10px 0px 0px 0px;">';
		$.each(__colors,function(i,color){
			_content+='<div class="'+color.CLASS+' color '+(i===0?"active":"")+'" data-id="'+color.ID+'"></div>';
		});
		_content+='<div class="clear"></div>';
		_content+='</div>';
	_content+='</div>';
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												// Check if title is not empty and color is selected
												if(e.$.find("input.title").val().replace(/[\s]/g,"")==""){
													e.$.find("input.title").focus();
													return false;
												}
												if(e.$.find(".colors>.active").length<1){
													e.$.find("input.title").focus();
													return false;
												}
												
												// Get title and color
												var title=e.$.find("input.title").val();
												var color=e.$.find(".colors>.active").attr("class").replace(/ns|color|pressed|hover|active|[\s]/g,"");
												
												// Save it in database and in case of success, append new element
												Post("category","insert",{project_id:__projectId,title:title,color:e.$.find(".colors>.active").attr("data-id")},function(data){
													obj.find(".bubbles").append('<div data-id="'+data.replace(/[^0-9]/g,"")+'" class="bubble color ns '+color+'"><div>'+title+'</div></div><div class="bubbleText ns">'+title+'</div>');
													Home.bubbles.refresh();
													e.close(true);
													
													Home.bubbles.saveOrder(obj.find(".bubbles"));
												},function(){
													e.$.find("input.title").focus();
												});
											},triggerKey:13},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 leftFooter:false,
									 closeOnBgClick:false,
									 width:420});
									 
	setTimeout(function(){popup.open();},200);
}
Home.bubbles.bubble.moveLeft=function(obj){
	var prev=obj.prev();
	var obj2=obj.next();
	if(prev.length===1){
		obj.detach().insertBefore(prev.prev());
		obj2.detach().insertAfter(obj);
	}
	Home.bubbles.refresh();
	Home.bubbles.saveOrder(obj.parents(".bubbles").first());
}
Home.bubbles.bubble.moveRight=function(obj){
	var next=obj.next().next();
	var obj2=obj.next();
	if(next.length===1){
		obj.detach().insertAfter(next.next());
		obj2.detach().insertAfter(obj);
	}
	Home.bubbles.refresh();
	Home.bubbles.saveOrder(obj.parents(".bubbles").first());
}
Home.bubbles.bubble.remove=function(obj){
	_content='<div style="margin:10px;">You are going to delete <strong>'+obj.find(">div").html()+'</strong> category. All content inside of this category will be deleted. Are you sure?</div>';
	var popup=new jPopup(_content,{buttons:[{text:"Confirm",class:"chateauGreen",callback:function(e){
												e.close(true);
												
												// Confirmed
												Post("category","delete",{id:obj.attr("data-id")},function(data){
													var parent=obj.parents(".bubbles").first();
													obj.next().remove();
													obj.remove();
													Home.bubbles.refresh();
													
													Home.bubbles.saveOrder(parent);
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
Home.bubbles.bubble.edit=function(obj){
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(){};
	
	var _currentColor=obj.attr("class").replace(/bubble|ns|color|pressed|hover|active|[\s]/g,"");
	
	_content+='<div style="margin:10px;" class="default">';
		_content+='Category Name';
		_content+='<div style="margin:10px 0px 10px 0px;">';
		_content+='<input class="title" type="text" placeholder="Enter category name" style="width:384px;" value="'+obj.find(">div").html()+'" />';
		_content+='</div>';
		
		_content+='Choose Color';
		_content+='<div class="colors" style="margin:10px 0px 0px 0px;">';
		$.each(__colors,function(i,color){
			_content+='<div class="'+color.CLASS+' color '+(color.CLASS==_currentColor?"active":"")+'" data-id="'+color.ID+'"></div>';
		});
		_content+='<div class="clear"></div>';
		_content+='</div>';
	_content+='</div>';
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												// Check if title is not empty and color is selected
												if(e.$.find("input.title").val().replace(/[\s]/g,"")==""){
													e.$.find("input.title").focus();
													return false;
												}
												if(e.$.find(".colors>.active").length<1){
													e.$.find("input.title").focus();
													return false;
												}
												
												// Get title and color
												var title=e.$.find("input.title").val();
												var color=e.$.find(".colors>.active").attr("class").replace(/ns|color|pressed|hover|active|[\s]/g,"");
												
												// Save it in database and in case of success, update element
												Post("category","update",{id:obj.attr("data-id"),title:title,color:e.$.find(".colors>.active").attr("data-id")},function(data){
													obj.find(">div").empty().append(title);
													obj.next().empty().append(title);
													obj.attr("class","bubble ns color "+color);
													obj.attr("data-order",data);
													Home.bubbles.refresh();
													e.close(true);
												},function(){
													e.$.find("input.title").focus();
												});
											},triggerKey:13},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 leftFooter:false,
									 closeOnBgClick:false,
									 width:420});
									 
	setTimeout(function(){popup.open();},200);
}

Home.bubbles.saveOrder=function(obj){
	var orderIds=[];
	$.each(obj.find(">.bubble"),function(){
		orderIds.push($(this).attr("data-id"));
	});
	if(orderIds.length>0) Post("category","order",{project_id:__projectId,ids:orderIds.join(",")});
}

// MOUSE ENTER
$(document).on("mouseenter",".bubbles>.bubble",function(){
	$(this).addClass("hover");
});
$(document).on("mouseenter",".bubbles>.bubbleText",function(){
	$(this).prev().addClass("hover");
});
$(document).on("mouseleave",".bubbles>.bubble",function(){
	$(this).removeClass("hover");
});

$(document).on("mouseenter",".bubbles>.bubble,.bubbles>.bubbleText",function(e){$(this).addClass("hovered");});
$(document).on("mouseleave",".bubbles>.bubble,.bubbles>.bubbleText",function(e){$(this).removeClass("hovered");});

$(document).on("mouseenter",".popup>.content .colors>.color",function(){$(this).addClass("hover");});
$(document).on("mouseleave",".popup>.content .colors>.color",function(){$(this).removeClass("hover");});

// MOUSE DOWN
$(document).on("mousedown",".pageHome .bubbles>.bubble",function(e){
	Home.bubbles.bubble.mouseDown($(this),e);
});
$(document).on("mousedown",".pageHome .bubbles>.bubbleText",function(e){
	Home.bubbles.bubble.mouseDown($(this).prev(),e)
});
$(document).bind("mouseup",function(){
	$(".pageHome .bubbles>.bubble").removeClass("pressed");
});

$(document).on("mousedown",".pageHome:last()",function(e){
	document.getSelection().removeAllRanges();
	var $el=$(this);
	if(e.which==3&&$el.find(".bubbles>.hovered").length===0){
		Context.open({x:e.pageX,y:e.pageY},Context.getHomePageStack(function(){
			Home.bubbles.bubble.add($el);
		}),{delay:400});
	}
});

// CLICK
$(document).on("click",".pageHome .bubbles>.bubble",function(e){
	Home.bubbles.bubble.click($(this),e);
});
$(document).on("click",".pageHome .bubbles>.bubbleText",function(e){
	Home.bubbles.bubble.click($(this).prev(),e);
});

$(document).on("click",".popup>.content .colors>.color",function(){
	$(this).parent().find(">.color").removeClass("active");
	$(this).addClass("active");
});

// CONTEXT
$(document).on("contextmenu",".pageHome .bubbles>.bubble,.pageHome .bubbles>.bubbleText",function(e){e.preventDefault();});