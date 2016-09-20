Pages={};
Pages.list=[];
Pages.callbackAfterShow=function(){};
Pages.currentId=0;

Pages.colors=["fern","chateauGreen","mountainMeadow","persianGreen","pictonBlue","curiousBlue","mariner","denim","wisteria","blueGem","chambray","blueWhale","neonCarrot","sun","terraCotta","valencia","cinnabar","wellRed","ironGray"];

Pages.get=function(id){
	var obj=undefined;
	$.each(Pages.list,function(i,o){
		if(o.id==id) obj=o;
	});
	return obj;
}
Pages.delete=function(id){
	Pages.list=$.grep(Pages.list,function(obj){return obj.id==parseInt(id);},true);
}

Pages.push=function(url,params,title,show,callback){
	show=show||false;
	params=params||{};
	callback=callback||function(){};
	
	$.post(url,params,function(data){
		var uId=GetUID();
		$("<div />").css({display:"none"}).addClass("page").attr("data-id",uId).append(data).appendTo(Pages.$.find(">.pagesHolder"));
		ReSize();
		
		Pages.$.find(">.pagesHolder>.page[data-id='"+uId+"']").show(200,function(){
			Pages.callbackAfterShow();
		});
		
		Pages.list.push({id:uId,url:url,params:params,title:title,$:Pages.$.find(">.pagesHolder>.page[data-id='"+uId+"']")});
		
		if(show) Pages.goTo(uId,function(){callback(Pages.list[Pages.list.length-1]);});
		else callback(Pages.list[Pages.list.length-1]);
	});
}

Pages.goTo=function(id,callback){
	callback=callback||function(){};
	var item=Pages.get(id);
	if(item===undefined) return;
	
	Menu.setTitle(item.title);
	
	Pages.currentId=id;
	Pages.$.find(">.pagesHolder").stop(true,false).animate({left:-(item.$.index()*Pages.$.width())},520,"easeOutCubic",function(){
		callback();
	});
}
Pages.goBack=function(){
	Menu.hideShareButton();
	
	if(Pages.list.length<=2){
		Menu.onClickAction="openMenu";
		Menu.showIcon("menu",320,240,"easeOutSine");
	}
	Pages.remove(Pages.currentId,function(){
	
	});
}

Pages.remove=function(id,callback){
	callback=callback||function(){};
	var item=Pages.get(id);
	if(item===undefined) return;
	
	if(item.$.index()==0&&Pages.list.length==1) item.$.fadeOut(220,function(){
			$(this).remove();
			Pages.list=[];
			Pages.currentId=0;
			callback();
		});
	else if(item.$.index()==0){
		// Where's animation? We will remove item and that will scroll content to next item. We can't make animation here.
		Pages.currentId=item.$.next().attr("data-id");
		item.$.remove();
		Pages.delete(item.id);
		callback();
	}else{
		Pages.goTo(parseInt(item.$.prev().attr("data-id")),function(){
			item.$.remove();
			Pages.delete(item.id);
			callback();
		});
	}
}

Pages.blur=function(c){
	Pages.$.addClass(c||"lightBlur");
}
Pages.unblur=function(c){
	Pages.$.removeClass(c||"lightBlur");
}

////////////////////////////////
// Add CSS / JS
Pages.addCSS=function(links){
	$.each(links,function(i,l){
		if($("head>link[href='"+l+"']").length==0) $("head").append("<link rel='stylesheet' href='"+l+"' type='text/css' />");
	});
}
Pages.addJS=function(links){
	$.each(links,function(i,l){
		if($("head>script[src='"+l+"']").length==0) $("head").append("<script src='"+l+"'></script>");
	});
}

$(document).ready(function(){
	Pages.$=$(".pages");
});