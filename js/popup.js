var jPopup=function(html,cfg){
	var SELF=this;
	SELF.id=GetUID();
	SELF.zIndex=GetPZIndex();
	SELF.$=false;
	SELF.state=false;
	SELF.cfg=cfg||{};
	cfg.width=cfg.width||720;
	cfg.buttons=cfg.buttons||[];
	if(cfg.closeOnBgClick===true) cfg.closeOnBgClick=true; else cfg.closeOnBgClick=false;
	if(cfg.bgOpacity===undefined) cfg.bgOpacity=.48;
	
	// Initialize
	var $_background=$("<div />").addClass("background");
	if(cfg.closeOnBgClick===true) $_background.one("click",function(){SELF.close(true);});
	var $_content=$("<div />").addClass("content");
	$_content.width(cfg.width);
	$_content.append(html);
	
	if(cfg.buttons.length>0){
		var $_footer=$("<div />").addClass("footer");
		$.each(cfg.buttons,function(i,button){
			var $_button=$('<button />').addClass("color").append(button.text||"Button");
			if(button.class!==undefined) $_button.addClass(button.class); else $_button.addClass("iron");
			$_button.bind("click",function(){
				if(typeof button.callback==="function") button.callback(SELF);
			});
			if(button.triggerKey!==undefined){
				$(document).bind("keydown",function(e){
					if(e.which===button.triggerKey) $_button.trigger("click");
				});
			}
			$_button.bind("mouseenter",function(){$(this).addClass("hover");});
			$_button.bind("mouseleave",function(){$(this).removeClass("hover");});
			$_footer.append($_button);
		});
		$_content.append($_footer);
		$_footer.wrapInner($('<div class="buttons" />'));
		if(typeof cfg.leftFooter==="object"&&cfg.leftFooter instanceof jQuery){
			var $_buttons=$_footer.find(">.buttons");
			$_buttons.detach();
			$_footer.empty().append('<table width="100%"><tr><td></td><td align="right"></td></tr></table>');
			$_footer.find(">table>tbody>tr>td:first()").append(cfg.leftFooter);
			$_footer.find(">table>tbody>tr>td:last()").append($_buttons);
		}
	}
	
	SELF.$=$("<div />").addClass("popup").attr("data-id",SELF.id).css({"z-index":SELF.zIndex}).hide();
	SELF.$.append($_background);
	SELF.$.append($_content);
	$(".popups").append(SELF.$);
	
	if(typeof cfg.onLoaded==="function") cfg.onLoaded(SELF);
	// End of Initialization
	
	SELF.open=function(){
		if(SELF.$===false||SELF.state===true) return false;
		SELF.state=true;
		
		Pages.blur();
		
		SELF.$.find(".background").css({opacity:0}).show();
		SELF.$.find(".content").css({opacity:0}).show();
		SELF.$.show();
		
		SELF.$.find(".content").css({top:($(window).height()/2)-(SELF.$.find(".content").height()/2),left:($(window).width()/2)-(SELF.$.find(".content").width()/2)});
		
		SELF.$.find(".background").css({opacity:SELF.cfg.bgOpacity});
		SELF.$.find(".content").css({opacity:1,transform:"scale(1)"});
		
		setTimeout(function(){if(typeof SELF.cfg.onOpened==="function") SELF.cfg.onOpened(SELF);},380);
		
		return SELF;
	}
	
	SELF.close=function(terminateAfter){
		if(SELF.$===false||SELF.state===false) return false;
		SELF.state=false;
		
		Pages.unblur();
		
		SELF.$.find(".background").css({opacity:0});
		SELF.$.find(".content").css({opacity:0,transform:"scale(.82)"});
		
		setTimeout(function(){
			if(typeof SELF.cfg.onClosed==="function") SELF.cfg.onClosed();
			if(terminateAfter===true) SELF.terminate();
		},380);
		
		return SELF;
	}
	
	SELF.terminate=function(terminateAfter){
		if(SELF.$===false) return false;
		if(typeof SELF.cfg.onTerminated==="function") SELF.cfg.onTerminated();
		SELF.$.remove();
		SELF.$=false;
		SELF=false;
		return true;
	}
	
	return SELF;
}

$(window).resize(function(){
	$.each($(".popups>.popup>.content"),function(){
		$(this).css({top:($(window).height()/2)-($(this).height()/2),left:($(window).width()/2)-($(this).width()/2)});
	});
});