Menu={};
Menu.iconClass="";
Menu.onClickAction="";
Menu.preventClick=false;
Menu.isCircleAnimating=false;
Menu.isTitleAnimating=false;
Menu.titleChangePoolInterval=false;
Menu.titleAnimationPool=[];

Menu.setTitle=function(title){
	if(Menu.isTitleAnimating){
		Menu.titleAnimationPool.push(title);
		if(!Menu.titleChangePoolInterval){
			Menu.titleChangePoolInterval=setInterval(function(){
				// Check each 20 seconds if animation is done
				if(!Menu.isTitleAnimating){
					// Check length of pool
					if(Menu.titleAnimationPool.length<=1){
						clearInterval(Menu.titleChangePoolInterval);
						Menu.titleChangePoolInterval=false;
					}
					// Call self but with first item from pool
					Menu.setTitle(Menu.titleAnimationPool.shift());
					// shift will remove first item from array and return that item
				}
			},20);
		}
		return false;
	}
	Menu.isTitleAnimating=true;
	var length=$(".headerContent .pageTitle>div").length;
	var hideSpeed=10;
	var showSpeed=10;
	
	if(length>80) hideSpeed=3; else if(length>60) hideSpeed=5; else if(length>40) hideSpeed=7; else if(length>20) hideSpeed=15; else hideSpeed=30;
	if(title.length>80) showSpeed=3; else if(title.length>60) showSpeed=5; else if(title.length>40) showSpeed=7; else if(title.length>20) showSpeed=15; else showSpeed=30;
	
	if(length>0){
		for(var i=length-1;i>=0;i--){
			setTimeout(function(index){$(".headerContent .pageTitle>div").eq(index).addClass("hidden");},((length-1-i)*hideSpeed),i);
		}
	}
	
	setTimeout(function(){
		$(".headerContent .pageTitle").empty();
		for(var i=0;i<title.length;i++){
			var ch=title.charAt(i).replace(/ /g, '\u00a0');
			$(".headerContent .pageTitle").append($("<div />").addClass("hidden").append(ch));
			setTimeout(function(index){$(".headerContent .pageTitle>div").eq(index).removeClass("hidden");},(i*showSpeed),i);
		}
		setTimeout(function(){Menu.isTitleAnimating=false;},(title.length*showSpeed)+200);
	},(length*hideSpeed)+100);
}

Menu.getTitle=function(){
	return $(".headerContent .pageTitle").text();
}

Menu.showCircle=function(d,c){
	c=c||function(){};
	$(".menuSvg .circle").css({"stroke-dashoffset":120}).show();
	$({p:120}).animate({p:0},{easing:"easeOutQuart",duration:d||800,step:function(){
		$(".menuSvg .circle").css({"stroke-dashoffset":this.p});
	},complete:function(){
		$(".menuSvg .circle").css({"stroke-dashoffset":0});
		c();
	}});
}
Menu.hideCircle=function(d,c){
	c=c||function(){};
	$({p:0}).animate({p:120},{easing:"easeInCubic",duration:d||600,step:function(){
		$(".menuSvg .circle").css({"stroke-dashoffset":this.p});
	},complete:function(){
		$(".menuSvg .circle").css({"stroke-dashoffset":120});
		$(".menuSvg .circle").hide();
		c();
	}});
}

Menu.animateCircle=function(d,e,f,c){
	if(f===true) Menu.isCircleAnimating=true;
	$(".menuSvg .circle").css({"stroke-dashoffset":120}).show();
	$({p:120}).animate({p:240},{easing:e,duration:d,step:function(){
		$(".menuSvg .circle").css({"stroke-dashoffset":this.p});
	},complete:function(){
		if(!Menu.isCircleAnimating){
			$(".menuSvg .circle").css({"stroke-dashoffset":240});
			c();
		}else{
			$({p:240}).animate({p:360},{easing:"easeOutCubic",duration:d,step:function(){
				$(".menuSvg .circle").css({"stroke-dashoffset":this.p});
			},complete:function(){
				if(Menu.isCircleAnimating) Menu.animateCircle(d,e,false,c);
				else{
					$(".menuSvg .circle").css({"stroke-dashoffset":360});
					c();
				}
			}});
		}
	}});
}
Menu.stopCircleAnimation=function(){
	Menu.isCircleAnimating=false;
}

Menu.showIcon=function(i,d,d2,e,c){
	d=d||320;
	d2=d2||240;
	e=e||"linear";
	c=c||function(){};
	if(Menu.iconClass==i) return;
	else if(Menu.iconClass!=""){
		Menu.hideIcon(d,e,function(){setTimeout(function(){
			Menu.showIcon(i,d,d2,e,c);
		},d2);});
	}else{
		Menu.iconClass=i;
		$(".menuSvg ."+i).css({"stroke-dashoffset":$(".menuSvg ."+i).attr("stroke-dasharray")}).show();
		$({p:$(".menuSvg ."+i).attr("stroke-dasharray")}).animate({p:0},{easing:e,duration:d,step:function(){
			$(".menuSvg ."+i).css({"stroke-dashoffset":this.p});
		},complete:function(){
			$(".menuSvg ."+i).css({"stroke-dashoffset":0});
			c();
		}});
	}
}
Menu.hideIcon=function(d,e,c){
	d=d||600;
	e=e||"linear";
	c=c||function(){};
	if(Menu.iconClass=="") return;
	
	$({p:0}).animate({p:$(".menuSvg ."+Menu.iconClass).attr("stroke-dasharray")},{easing:e,duration:d,step:function(){
		$(".menuSvg ."+Menu.iconClass).css({"stroke-dashoffset":this.p});
	},complete:function(){
		$(".menuSvg ."+Menu.iconClass).hide();
		$(".menuSvg ."+Menu.iconClass).css({"stroke-dashoffset":$(".menuSvg ."+Menu.iconClass).attr("stroke-dasharray")});
		Menu.iconClass="";
		c();
	}});
}

Menu.click=function(e){
	if(!Menu.$.parent().hasClass("pointer")||Menu.preventClick) return false;
	
	if(Menu.onClickAction=="goBack"){
		Pages.goBack();
	}else if(Menu.onClickAction=="openMenu"){
		if($(".menuContent").length==1){
			Pages.blur("blur");
			$(".overLayers").fadeIn(320);
			$(".menuContent").addClass("visible");
		}
	}
}

$(document).ready(function(){
	Menu.$=$(".menuSvg");
	Menu.$.parent().bind("click",Menu.click);
});

// Share Button
$(document).on("click",".shareButton",function(){
	var url=$(this).attr("data-url").trim();
	if(url.length>0) Menu.openSharePopup(url);
});

Menu.showShareButton=function(url){
	$(".shareButton").attr("data-url",url).fadeIn(120);
}

Menu.hideShareButton=function(){
	$(".shareButton").attr("data-url","").fadeOut(120);
}

Menu.openSharePopup=function(url){
	if(url.length<1) return false;
	
	var _content='';
	var _onLoaded=function(){};
	var _onOpened=function(e){};
	
	_content+='<div style="margin:10px;" class="default">';
		_content+='Page Link';
		_content+='<div style="margin:10px 0px 10px 0px;position:relative;">';
		_content+='<div class="fakeInput">'+url+'</div>';
		_content+='<div class="copyHolder ns">';
			_content+='<div style="position:absolute;right:8px;top:8px;" class="ic icCopy"></div>';
			_content+='<embed class="ns" style="position:absolute;right:0px;top:0px;" width="32" height="32" menu="false" wmode="transparent" type="application/x-shockwave-flash" allowfullscreen="false" flashvars="text='+url+'" src="lib/clipboard.swf">';
		_content+='</div>';
		_content+='</div>';
		
		_content+='Social Media';
		_content+='<div class="media" style="margin:10px 0px 0px 0px;" data-url="'+btoa(url)+'">';
			_content+='<div class="ic icSocFB"></div>';
			_content+='<div class="ic icSocTW"></div>';
			_content+='<div class="ic icSocGP"></div>';
			_content+='<div class="ic icSocIN"></div>';
		_content+='</div>';
	_content+='</div>';
	
	var popup=new jPopup(_content,{buttons:[{text:"Close",class:"chateauGreen",callback:function(e){e.close(true);},triggerKey:27}],
									 onOpened:_onOpened,
									 onLoaded:_onLoaded,
									 leftFooter:false,
									 closeOnBgClick:true,
									 width:420});
									 
	setTimeout(function(){popup.open();},200);
}

$(document).on("mousedown",".copyHolder",function(e){
	e.preventDefault();
	e.stopPropagation();
	return false;
});
$(document).on("mouseup",".copyHolder",function(){
	var obj=$(this);
	if(obj.hasClass("animating")) return false;
	obj.addClass("animating");
	obj.find("embed").hide();
	obj.find(".ic").addClass("hide");
	setTimeout(function(){
		obj.find(".ic").removeClass("icCopy").addClass("icCopyOk").removeClass("hide");
		setTimeout(function(){
			obj.find(".ic").addClass("hide");
			setTimeout(function(){
				obj.find(".ic").removeClass("icCopyOk").addClass("icCopy").removeClass("hide");
				obj.find("embed").show();
				obj.removeClass("animating");
			},180);
		},620);
	},180);
});

// Social Media button click
$(document).on("click",".media>.ic",function(){
	var url=atob($(this).parent().attr("data-url"));
	if($(this).hasClass("icSocFB"))		url="http://www.facebook.com/sharer.php?u="+url;
	else if($(this).hasClass("icSocTW"))	url="http://twitter.com/share?url="+url;
	else if($(this).hasClass("icSocGP"))	url="https://plus.google.com/share?url="+url;
	else if($(this).hasClass("icSocIN"))	url="http://www.linkedin.com/shareArticle?mini=true&url="+url;
	else url="";
	
	if(url!="") window.open(url,'shareWindow','top=80,left=80,toolbar=0,status=0,width=520,height=350');
});