var jScrollBox=function(box,cfg){
	var SELF=this;
	SELF.$BOX=false;
	SELF.$SCROLL=false;
	SELF.$SCROLLBAR=false;
	SELF.cfg=cfg||{};
	SELF.preventWheel=false;
	SELF.scrollDragging=false;
	SELF.scrollDragOffsetY=0;
	SELF.scrollHideInterval=false;
	if(box instanceof jQuery) SELF.$BOX=box; else SELF.$BOX=$(box);
	if(SELF.$BOX===false||SELF.$BOX.length!==1) return false;
	
	////////////////////////////////////////////////
	// - Set Defaults
	////////////////////////////////////////////////
	SELF.cfg.wheel=typeof SELF.cfg.wheel!=="undefined"?SELF.cfg.wheel:true;
	SELF.cfg.scrollBar=typeof SELF.cfg.scrollBar!=="undefined"?SELF.cfg.scrollBar:true;
	SELF.cfg.step=typeof SELF.cfg.step!=="undefined"?SELF.cfg.step:40;
	SELF.cfg.height=typeof SELF.cfg.height!=="undefined"?SELF.cfg.height:false;
	SELF.cfg.animationSpeed=typeof SELF.cfg.animationSpeed!=="undefined"?SELF.cfg.animationSpeed:220;
	SELF.cfg.scroll=typeof SELF.cfg.scroll==="object"?SELF.cfg.scroll:{};
	SELF.cfg.scroll.visible=typeof SELF.cfg.scroll.visible!=="undefined"?SELF.cfg.scroll.visible:false;
	SELF.cfg.scroll.showOnMouseWheel=typeof SELF.cfg.scroll.showOnMouseWheel!=="undefined"?SELF.cfg.scroll.showOnMouseWheel:true;
	SELF.cfg.scroll.delay=typeof SELF.cfg.scroll.delay!=="undefined"?SELF.cfg.scroll.delay:800;
	SELF.cfg.scroll.width=typeof SELF.cfg.scroll.width!=="undefined"?SELF.cfg.scroll.width:4;
	SELF.cfg.scroll.opacity=typeof SELF.cfg.scroll.opacity!=="undefined"?SELF.cfg.scroll.opacity:.28;
	SELF.cfg.scroll.color=typeof SELF.cfg.scroll.color!=="undefined"?SELF.cfg.scroll.color:"#000000";
	////////////////////////////////////////////////
	
	
	////////////////////////////////////////////////
	// - Configure Box
	////////////////////////////////////////////////
	if(SELF.cfg.scrollBar===true){
		SELF.$BOX.wrapInner($("<div />"));
		SELF.$SCROLL=$("<div />").css({"position":"absolute","top":0,"width":"100%","background-color":SELF.cfg.scroll.color,"opacity":0,"transition":"opacity .14s"});
		SELF.$SCROLLBAR=$("<div />").addClass("jScrollBoxBar").css({"position":"absolute","top":0,"right":0,"bottom":0,"width":SELF.cfg.scroll.width+"px"}).append(SELF.$SCROLL);
		SELF.$BOX.append(SELF.$SCROLLBAR);
		SELF.$BOX=SELF.$BOX.find(">div").first();
	}
	SELF.$BOX.addClass("jScrollBox").css({"overflow":"hidden","scroll-behavior":"smooth","position":"absolute","top":0,"right":0,"bottom":0,"left":0});
	if(SELF.cfg.height!==false) SELF.$BOX.css({"max-height":SELF.cfg.height});
	////////////////////////////////////////////////
	
	
	////////////////////////////////////////////////
	// - Mouse Wheel
	////////////////////////////////////////////////
	SELF.mouseWheel=function(e){
		var e=window.event||e;
		e.preventDefault();
		if(e.ctrlKey===true) return false;
		e.stopPropagation(); // Stop it after checking ctrl key. Because we may handle CTRL+Scroll Wheel
		var delta=Math.max(-1,Math.min(1,(e.wheelDelta||-e.detail)));
		var contentH=SELF.$BOX.prop("scrollHeight");
		var maxS=contentH-SELF.$BOX.height();
		
		if(SELF.$BOX.prop("scrollHeight")<=SELF.$BOX.height()) return false;
		
		var to=SELF.$BOX.prop("scrollTop")+(delta<0?SELF.cfg.step:-SELF.cfg.step);
		if(to<0) to=0; else if(to>maxS) to=maxS;
		
		if("scroll-behavior" in document.body.style) SELF.$BOX.scrollTop(to);
		else SELF.$BOX.stop(true,true).animate({scrollTop:to},SELF.cfg.animationSpeed);
		
		if(SELF.$SCROLLBAR instanceof jQuery){
			SELF.refreshScrollBox();
			
			// Show/Hide Scroll Box
			if(SELF.cfg.scroll.showOnMouseWheel===true){
				SELF.showScrollBox();
				SELF.hideScrollBox(SELF.cfg.scroll.delay);
			}
		}
	}
	SELF.mouseWheelHandler=function(e){
		if(SELF.cfg.wheel===false||SELF.preventWheel===true) return false;
		SELF.mouseWheel(e);
	}
	if(SELF.$BOX[0].addEventListener){
		SELF.$BOX[0].addEventListener("mousewheel",SELF.mouseWheelHandler,false);
		SELF.$BOX[0].addEventListener("DOMMouseScroll",SELF.mouseWheelHandler,false);
	}else SELF.$BOX[0].attachEvent("onmousewheel",SELF.mouseWheelHandler);
	////////////////////////////////////////////////
	

	
	////////////////////////////////////////////////
	// - Scroll Box
	////////////////////////////////////////////////
	SELF.refreshScrollBox=function(){
		if(!SELF.$SCROLLBAR instanceof jQuery) return false;
		
		var to=SELF.$SCROLLBAR.height()/(SELF.$BOX.prop("scrollHeight")/SELF.$BOX.height());
		if(to<30) to=30;
		SELF.$SCROLL.height(to);
		
		var maxS=SELF.$SCROLLBAR.height()-SELF.$SCROLL.height();
		
		$({x:SELF.cfg.animationSpeed}).animate({x:0},{
			step:function(){
				// Repeat this process SELF.cfg.animationSpeed times because of scroll animation
				to=SELF.$BOX.prop("scrollTop")*maxS/(SELF.$BOX.prop("scrollHeight")-SELF.$BOX.height());
				if(to<0) to=0; else if(to>maxS) to=maxS;
				SELF.$SCROLL.css({top:to});
			}
		},SELF.cfg.animationSpeed);
	}
	SELF.showScrollBox=function(){
		var to=SELF.$SCROLLBAR.height()/(SELF.$BOX.prop("scrollHeight")/SELF.$BOX.height());
		if(to<30) to=30;
		SELF.$SCROLL.css({height:to,opacity:SELF.cfg.scroll.opacity});
	}
	SELF.hideScrollBox=function(d){
		if(SELF.scrollDragging===true||SELF.cfg.scroll.visible===true) return;
		if(d){
			clearInterval(SELF.scrollHideInterval);
			SELF.scrollHideInterval=setInterval(function(){
				clearInterval(SELF.scrollHideInterval);
				SELF.hideScrollBox();
			},SELF.cfg.scroll.delay);
		}else SELF.$SCROLL.css({opacity:0});
	}
	////////////////////////////////////////////////
	
	
	////////////////////////////////////////////////
	// - jQuery Events
	////////////////////////////////////////////////
	SELF.$BOX.bind("mouseenter",function(){$(this).data("hovered",true);});
	SELF.$BOX.bind("mouseleave",function(){$(this).data("hovered",false);});
	if(SELF.$SCROLLBAR instanceof jQuery){
		SELF.$SCROLLBAR.bind("mouseenter",function(){
			if(SELF.$BOX.prop("scrollHeight")<=SELF.$BOX.height()) return false;
			
			clearInterval(SELF.scrollHideInterval);
			SELF.$SCROLLBAR.data("hovered",true);
			SELF.showScrollBox();
		});
		SELF.$SCROLLBAR.bind("mouseleave",function(){
			SELF.$SCROLLBAR.data("hovered",false);
			SELF.hideScrollBox();
		});
		
		SELF.$SCROLL.bind("mousedown",function(e){
			e.preventDefault();
			e.stopPropagation();
			SELF.preventWheel=true;
			SELF.scrollDragging=true;
			SELF.scrollDragOffsetY=e.pageY-SELF.$SCROLL.offset().top;
		});
		
		$(document).bind("mousemove",function(e){
			if(SELF.scrollDragging!==true) return false;
			
			var maxS=SELF.$SCROLLBAR.height()-SELF.$SCROLL.height();
			var to=e.pageY-SELF.$SCROLLBAR.offset().top-SELF.scrollDragOffsetY;
			if(to<0) to=0; else if(to>maxS) to=maxS;
			SELF.$SCROLL.css({top:to});
			
			to=to*(SELF.$BOX.prop("scrollHeight")-SELF.$BOX.height())/maxS;
			SELF.$BOX.scrollTop(to);
		});
		$(document).bind("mouseup",function(e){
			SELF.scrollDragging=false;
			SELF.preventWheel=false;
			if(SELF.$SCROLLBAR.data("hovered")!==true) SELF.hideScrollBox();
		});
	}
	////////////////////////////////////////////////
	
	if(SELF.cfg.scroll.visible===true) SELF.showScrollBox();
	
	return SELF;
}