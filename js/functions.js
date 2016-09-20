function escapeHtml(text) {
	return text.replace(/[&<>"']/g, function(m) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]; });
}

function Post(w,a,d,s,e){
	if(w=="") return c2();
	d=d||{};
	s=s||function(){};
	e=e||function(){};
	d.w=w;
	d.a=a;
	ShowLoader();
	$.post("post.php",d,function(r){
		if(r=="") e(); else s(r);
		HideLoader();
	});
}

function ShowLoader(){
	$(".loader .animatedLoader").css({"margin-top":($(document).height()/2)-40});
	$(".loader").fadeIn(120);
}
function HideLoader(){
	$(".loader").fadeOut(120);
}
$(window).resize(function(){
	$(".loader .animatedLoader").css({"margin-top":($(document).height()/2)-40});
});

function SelectInput(el){
	var doc=document,text=el,range,selection;   
	
	if(doc.body.createTextRange){
		range=document.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	}else if(window.getSelection){
		selection=window.getSelection();        
		range=document.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}