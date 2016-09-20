if(typeof Home!=="object") Home={};

Home.bubble={};
Home.bubble.groupItem={};
Home.bubble.groupItem.dragAfterDuration=440;
Home.bubble.groupItem.pressed=false;
Home.bubble.groupItem.pressedCheckInterval=false;
Home.bubble.groupItem.dragging=false;
Home.bubble.groupItem.popAnimHold=false;
Home.bubble.groupItem.dragOffset={top:0,left:0};
Home.bubble.group={};

Home.bubble.refresh=function(){
	$.each($(".groups"),function(){
		$(this).find(".groupHolder").width($(this).find(".groupHolder>.group").outerWidth(true)*$(this).find(".groupHolder>.group").length);
		
		$.each($(this).find(">.groupHolder>.group"),function(){
			$(this).find(".groupItems").height($(this).height()-$(this).find(".groupTitle").outerHeight(true));
			$(this).find(">.groupScroller").css({top:$(this).find(">.groupTitle").outerHeight(true)});
			$.each($(this).find(".groupItems>.groupItemsHolder .groupItem"),function(){
				$(this).next().css({top:$(this).position().top+8,left:$(this).position().left+12});
				if(!$(this).next().hasClass("hidden")) $(this).next().css({opacity:1});
			});
		});
	});
}

Home.bubble.open=function(el){
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
		Pages.push("get.php",{w:"post",id:el.attr("data-id")},el.find(">div").html(),true,function(data){
			Menu.stopCircleAnimation();
			HideLoader();
			__OL_PreventClick=false;
		});
	});
}

$(window).resize(function(){
	Home.bubble.refresh();
});


// GROUP CONTEXT MENU FUNCTIONS
Home.bubble.group.add=function(obj){
	var _content='<div style="margin:10px;" class="default">Adding new group in <em>'+Menu.getTitle()+'</em>.</div>';
	var _onLoaded=function(){};
	var _onOpened=function(e){e.$.find("input.title").focus();};
	var $_leftFooter=$('<input class="title" type="text" placeholder="Enter new group name" style="width:236px;" />').val("").append('');
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												// - Apply Changes after Save Button clicked
												var title=e.$.find("input.title").val();
												
												if(title.replace(/[\s]/g,"")==""){
													e.$.find("input.title").focus();
													return false;
												}
												
												// Save it in database and in case of success, append new element
												Post("group","insert",{category_id:obj.attr("data-categoryId"),title:title},function(data){
													obj.find(".groupHolder").append('<div class="group" data-id="'+data+'"><div class="groupTitle ns">'+title+'</div><div class="groupItems"><div class="groupItemsHolder"></div></div></div>');
													new jScrollBox(obj.find(".groupHolder>.group:last()>.groupItems>.groupItemsHolder"),{step:100,scroll:{color:"#FFFFFF"}});
													Home.bubble.refresh();
													e.close(true);
													Home.bubble.group.saveOrder(obj);
												},function(){
													e.$.find("input.title").focus();
												});
											},triggerKey:13},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 leftFooter:$_leftFooter,
									 closeOnBgClick:false,
									 width:420});
									 
	setTimeout(function(){popup.open();},200);
}
Home.bubble.group.moveLeft=function(obj){
	var prev=obj.prev();
	if(prev.length===1) obj.detach().insertBefore(prev);
	Home.bubble.group.saveOrder(obj.parents(".groups").first());
}
Home.bubble.group.moveRight=function(obj){
	var next=obj.next();
	if(next.length===1) obj.detach().insertAfter(next);
	Home.bubble.group.saveOrder(obj.parents(".groups").first());
}
Home.bubble.group.remove=function(obj){
	_content='<div style="margin:10px;">You are going to delete <strong>'+obj.find(">.groupTitle").html()+'</strong> group. All content inside of this group will be deleted. Are you sure?</div>';
	var popup=new jPopup(_content,{buttons:[{text:"Confirm",class:"chateauGreen",callback:function(e){
												e.close(true);
												
												// Confirmed
												Post("group","delete",{id:obj.attr("data-id")},function(data){
													var parent=obj.parents(".groups").first();
													obj.remove();
													Home.bubble.group.saveOrder(parent);
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
Home.bubble.group.edit=function(obj){
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(e){e.$.find("input.title").focus();};
	var $_leftFooter=$('<input class="title" type="text" placeholder="Enter group name" style="width:236px;" />').val(obj.find(">.groupTitle").html()).append('');
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												// - Apply Changes after Save Button clicked
												var title=e.$.find("input.title").val();
												
												if(title.replace(/[\s]/g,"")==""){
													e.$.find("input.title").focus();
													return false;
												}
												
												// Save it in database and in case of success, append new element
												Post("group","update",{id:obj.attr("data-id"),title:title},function(data){
													obj.find(">.groupTitle").empty().append(title);
													Home.bubble.refresh();
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
									 leftFooter:$_leftFooter,
									 closeOnBgClick:false,
									 width:420});
									 
	setTimeout(function(){popup.open();},200);
}
Home.bubble.group.saveOrder=function(obj){
	var orderIds=[];
	$.each(obj.find(".groupHolder>.group"),function(){
		orderIds.push($(this).attr("data-id"));
	});
	if(orderIds.length>0) Post("group","order",{category_id:obj.attr("data-categoryId"),ids:orderIds.join(",")});
}

// GROUP ITEM DRAG FUNCTIONS
Home.bubble.groupItem.mouseDown=function(el,e){
	el.addClass("pressed");
	document.getSelection().removeAllRanges();
	
	if(e.which==1){
		Home.bubble.groupItem.pressed=el;
		Home.bubble.groupItem.pressedCheckInterval=setInterval(function(){Home.bubble.groupItem.startDrag(e);},Home.bubble.groupItem.dragAfterDuration);
	}else if(e.which==3){
		Context.open({x:e.pageX,y:e.pageY},Context.getGroupItemStack(function(){
			Home.bubble.groupItem.moveUp(el);
		},function(){
			Home.bubble.groupItem.moveDown(el);
		},function(){
			Home.bubble.groupItem.remove(el);
		},function(){
			Home.bubble.groupItem.edit(el);
		}),{delay:400,color:"random"});
	}
}
Home.bubble.groupItem.click=function(el,e){
	if(e.which==1&&Home.bubble.groupItem.popAnimHold===false) Home.bubble.open(el);
}
Home.bubble.groupItem.startDrag=function(e){
	if(Home.bubble.groupItem.pressed===false) return;
	var el=Home.bubble.groupItem.pressed;
	
	$(document).trigger("mouseup"); // This will clear interval too
	
	Home.bubble.groupItem.popAnimHold=true;
	
	// Wait for item mouseup animation
	setTimeout(function(){
		el.parent().find(">.groupItemText").addClass("hidden").css({opacity:0});
		el.parent().find(">.groupItem>div").css({opacity:1});
	
		el.addClass("dragging").stop(true,false).animate({opacity:0},120);
		el.next().addClass("dragging").stop(true,false).animate({opacity:0},120,function(){});
		$(".groupItemDrag").empty().append(el.find(">div").html());
		$(".groupItemDrag").css({width:el.width(),top:el.offset().top,left:el.offset().left,opacity:1});
		
		Home.bubble.groupItem.dragOffset.top=e.pageY-el.offset().top;
		Home.bubble.groupItem.dragOffset.left=e.pageX-el.offset().left;
		
		Home.bubble.groupItem.popAnimHold=false;
		Home.bubble.groupItem.dragging=true;
	},300);
}
Home.bubble.groupItem.stopDrag=function(){
	if(Home.bubble.groupItem.pressed===false) return;
	var el=Home.bubble.groupItem.pressed;
	
	Home.bubble.groupItem.pressed=false;
	Home.bubble.groupItem.dragging=false;
	
	Home.bubble.refresh();
	Home.bubble.groupItem.saveOrder(el.parents(".group"));
	el.parent().find(">.groupItem>div").css({opacity:0});
	el.parent().find(">.groupItemText:not(.dragging)").removeClass("hidden").css({opacity:1});
	
	$(".groupItemDrag").stop(true,false).animate({top:el.offset().top,left:el.offset().left},120,function(){
		el.removeClass("dragging").stop(true,false).animate({opacity:1},120);
		el.next().removeClass("dragging").stop(true,false).animate({opacity:1},120,function(){
			$(".groupItemDrag").css({top:-999,left:-999,opacity:0});
			$(".groupItemDrag").empty();
			Home.bubble.groupItem.dragOffset.top=0;
			Home.bubble.groupItem.dragOffset.left=0;
		});
	});
}
Home.bubble.groupItem.dragMove=function(e){
	if(Home.bubble.groupItem.pressed===false||Home.bubble.groupItem.dragging===false) return;
	var el=Home.bubble.groupItem.pressed;

	var top=e.pageY-Home.bubble.groupItem.dragOffset.top;
	if(top<el.parent().offset().top) top=el.parent().offset().top;
	else if(top>(el.parent().offset().top+el.parent().height()-$(".groupItemDrag").outerHeight(true))) top=(el.parent().offset().top+el.parent().height()-$(".groupItemDrag").outerHeight(true));
	
	$(".groupItemDrag").css({top:top});
	
	var gOffsetTop=e.pageY-el.parent().offset().top;
	var overEl=false;
	var isBeforeEl=false;
	
	$.each(el.parent().find(".groupItem"),function(){
		if(($(this).position().top+($(this).outerHeight(true)/2))>gOffsetTop) return false;
		overEl=$(this);
	});
	
	var el2=el.next();
	if(overEl===false&&el.index()>0){
		var first=el.parent().find(".groupItem").first();
		el.detach().insertBefore(first);
		el2.detach().insertAfter(el);
	}else if(overEl!==false&&!overEl.hasClass("dragging")){
		el.detach().insertAfter(overEl.next());
		el2.detach().insertAfter(el);
	}
}

// GROUP ITEM CONTEXT MENU FUNCTIONS
Home.bubble.groupItem.add=function(obj){
	var _content='<div style="margin:10px;" class="default">Adding new post in <em>'+obj.find(">.groupTitle").html()+'</em>.</div>';
	var _onLoaded=function(){};
	var _onOpened=function(e){e.$.find("input.title").focus();};
	var $_leftFooter=$('<input class="title" type="text" placeholder="Enter new post name" style="width:236px;" />').val("").append('');
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												// - Apply Changes after Save Button clicked
												var title=e.$.find("input.title").val();
												
												if(title.replace(/[\s]/g,"")==""){
													e.$.find("input.title").focus();
													return false;
												}
												
												// Save it in database and in case of success, append new element
												Post("post","insert",{group_id:obj.attr("data-id"),title:title},function(data){
													obj.find(">.groupItems>.groupItemsHolder>.jScrollBox").append('<div data-id="'+data+'" class="groupItem ns"><div>'+title+'</div></div><div class="groupItemText ns">'+title+'</div>');
													Home.bubble.refresh();
													e.close(true);
													Home.bubble.groupItem.saveOrder(obj);
												},function(){
													e.$.find("input.title").focus();
												});
											},triggerKey:13},
											{text:"Cancel",class:"valencia",callback:function(e){
												e.close(true);
											},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 leftFooter:$_leftFooter,
									 closeOnBgClick:false,
									 width:420});
									 
	setTimeout(function(){popup.open();},200);
}
Home.bubble.groupItem.moveUp=function(obj){
	var prev=obj.prev();
	var obj2=obj.next();
	if(prev.length===1){
		obj.detach().insertBefore(prev.prev());
		obj2.detach().insertAfter(obj);
	}
	Home.bubble.refresh();
	Home.bubble.groupItem.saveOrder(obj.parents(".group").first());
}
Home.bubble.groupItem.moveDown=function(obj){
	var next=obj.next().next();
	var obj2=obj.next();
	if(next.length===1){
		obj.detach().insertAfter(next.next());
		obj2.detach().insertAfter(obj);
	}
	Home.bubble.refresh();
	Home.bubble.groupItem.saveOrder(obj.parents(".group").first());
}
Home.bubble.groupItem.remove=function(obj){
	_content='<div style="margin:10px;">You are going to delete <strong>'+obj.find(">div").html()+'</strong> post. All content inside of this post will be deleted. Are you sure?</div>';
	var popup=new jPopup(_content,{buttons:[{text:"Confirm",class:"chateauGreen",callback:function(e){
												e.close(true);
												
												// Confirmed
												Post("post","delete",{id:obj.attr("data-id")},function(data){
													var parent=obj.parents(".group").first();
													obj.next().remove();
													obj.remove();
													Home.bubble.refresh();
													Home.bubble.groupItem.saveOrder(parent);
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
Home.bubble.groupItem.edit=function(obj){
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(e){e.$.find("input.title").focus();};
	var $_leftFooter=$('<input class="title" type="text" placeholder="Enter post name" style="width:236px;" />').val(obj.find(">div").html()).append('');
	
	var popup=new jPopup(_content,{buttons:[{text:"Save",class:"chateauGreen",callback:function(e){
												// - Apply Changes after Save Button clicked
												var title=e.$.find("input.title").val();
												
												if(title.replace(/[\s]/g,"")==""){
													e.$.find("input.title").focus();
													return false;
												}
												
												// Save it in database and in case of success, append new element
												Post("post","update",{id:obj.attr("data-id"),title:title},function(data){
													obj.find(">div").empty().append(title);
													obj.next().empty().append(title);
													Home.bubble.refresh();
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
									 leftFooter:$_leftFooter,
									 closeOnBgClick:false,
									 width:420});
									 
	setTimeout(function(){popup.open();},200);
}
Home.bubble.groupItem.saveOrder=function(obj){
	var orderIds=[];
	$.each(obj.find(">.groupItems>.groupItemsHolder .groupItem"),function(){
		orderIds.push($(this).attr("data-id"));
	});
	if(orderIds.length>0) Post("post","order",{group_id:obj.attr("data-id"),ids:orderIds.join(",")});
}


// MOUSE DOWN/UP
$(document).on("mousedown",".groups",function(e){
	var $el=$(this);
	if(e.which==3&&$el.find(".groupHolder>.hovered").length===0){
		Context.open({x:e.pageX,y:e.pageY},Context.getBubblePageStack(function(){
			Home.bubble.group.add($el);
		}),{delay:400,color:"random"});
	}
});
$(document).on("mousedown",".groups>.groupHolder>.group",function(e){
	var $el=$(this);
	if(e.which==3&&$el.find(".groupItems>.groupItemsHolder .hovered").length===0){
		Context.open({x:e.pageX,y:e.pageY},Context.getGroupStack(function(){
			Home.bubble.groupItem.add($el);
		},function(){
			Home.bubble.group.moveLeft($el);
		},function(){
			Home.bubble.group.moveRight($el);
		},function(){
			Home.bubble.group.remove($el);
		},function(){
			Home.bubble.group.edit($el);
		}),{delay:400,color:"random"});
	}
});
$(document).on("mouseenter",".groups>.groupHolder>.group",function(e){$(this).addClass("hovered");});
$(document).on("mouseleave",".groups>.groupHolder>.group",function(e){$(this).removeClass("hovered");});
$(document).on("mouseenter",".groupItems>.groupItemsHolder .groupItem,.groupItems>.groupItemsHolder .groupItemText",function(e){$(this).addClass("hovered");});
$(document).on("mouseleave",".groupItems>.groupItemsHolder .groupItem,.groupItems>.groupItemsHolder .groupItemText",function(e){$(this).removeClass("hovered");});
$(document).on("mousedown",".groupItems>.groupItemsHolder .groupItem",function(e){
	Home.bubble.groupItem.mouseDown($(this),e);
});
$(document).on("mousedown",".groupItems>.groupItemsHolder .groupItemText",function(e){
	Home.bubble.groupItem.mouseDown($(this).prev(),e);
});
$(document).bind("mouseup",function(){
	if(Home.bubble.groupItem.dragging) Home.bubble.groupItem.stopDrag();
	else if(Home.bubble.groupItem.popAnimHold) setTimeout(function(){Home.bubble.groupItem.stopDrag();},300);
	clearInterval(Home.bubble.groupItem.pressedCheckInterval);
	$(".groupItems>.groupItemsHolder .groupItem").removeClass("pressed");
});

// MOUSE MOVE
$(document).bind("mousemove",function(e){
	if(Home.bubble.groupItem.dragging) Home.bubble.groupItem.dragMove(e);
});
$(document).on("mouseleave",".groupItems>.groupItemsHolder .groupItem",function(e){
	clearInterval(Home.bubble.groupItem.pressedCheckInterval);
});

// CLICK
$(document).on("click",".groupItems>.groupItemsHolder .groupItem",function(e){
	Home.bubble.groupItem.click($(this),e);
});
$(document).on("click",".groupItems>.groupItemsHolder .groupItemText",function(e){
	Home.bubble.groupItem.click($(this).prev(),e);
});

// CONTEXT
$(document).on("contextmenu",".groupItems>.groupItemsHolder .groupItem,.groupItems>.groupItemsHolder .groupItemText",function(e){e.preventDefault();});

// KEY DOWN
$(document).bind("keydown",function(e){
	var $p=Pages.get(Pages.currentId).$;
	if(!$p.find(">div").hasClass("bubblePage")) return true;
	
	var current=$p.find(".groups>.groupHolder").attr("data-current");
	if(current===undefined||current=="") current=0;
	var cLeft=parseInt($p.find(".groups>.groupHolder").css("left").replace("px",""));
	var count=$p.find(".groups>.groupHolder>.group").length;
	var wPerStep=380;
	var gpp=($(window).width()/wPerStep)|0;
	
	// Content is empty or content width is less than window width. We don't need to change position
	if(count<=0||$(window).width()>$p.find(".groups>.groupHolder").width()) return true;
	
	if(e.which==37) current--; else if(e.which==39) current++;
	
	if(current<0) current=0;
	if(current>count-gpp) current=count-gpp;
	cLeft=-wPerStep*current;
	if(cLeft>0) cLeft=0;
	
	$p.find(".groups>.groupHolder").css({left:cLeft});
	$p.find(".groups>.groupHolder").attr("data-current",current)
});

Home.bubble.mouseWheelHandler=function(e){
	if(e.ctrlKey){
		e.preventDefault();
		var e=window.event||e;
		var delta=Math.max(-1,Math.min(1,(e.wheelDelta||-e.detail)));
		
		var e=jQuery.Event("keydown");
		if(delta>0) e.which=37;
		else e.which=39;
		$(document).trigger(e);
	}
}