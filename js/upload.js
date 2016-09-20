$(document).on("dragenter",".fileUploadFrame",function(e){
	e.stopPropagation();
    e.preventDefault();
});
$(document).on("dragover",".fileUploadFrame",function(e){
	e.stopPropagation();
    e.preventDefault();
});
$(document).on("drop",".fileUploadFrame",function(e){
	e.stopPropagation();
    e.preventDefault();
	
	if($(this).hasClass("inProcess")) return false;
	$(this).removeClass("icUpload").addClass("icLoading").addClass("inProcess");
	
	handleFileUpload(e.originalEvent.dataTransfer.files,$(this));
});
$(document).on("click",".fileUploadFrame",function(e){
	var el=$(this);
	if(el.hasClass("inProcess")) return false;
	
	if(el.parent().find(">input[type=file]").length===1){
		el.parent().find(">input[type=file]").one("change",function(){
			if($(this).val()!=""){
				el.removeClass("icUpload").addClass("icLoading").addClass("inProcess");
				handleFileUpload($(this)[0].files,el);
			}
		});
		$(this).parent().find(">input[type=file]").trigger("click");
	}
});

function handleFileUpload(files,el){
	if(files.length>1) return false;
	
	if(el.attr("data-allowed")!==undefined&&el.attr("data-allowed").split(",").indexOf(files[0].name.split(".").pop().toLowerCase())==-1){
		el.find(">div").empty().append('<span style="color:#f8675f">Only <strong>('+el.attr("data-allowed").split(",").join(", ")+')</strong> allowed.</span><br /><strong>Choose a file</strong> or drop it here.');
		el.removeClass("inProcess").removeClass("icLoading").addClass("icUpload");
		return false;
	}
	
	var fd=new FormData();
	fd.append('file',files[0]);
	
	var uploadURL="upload.php";
	var jqXHR=$.ajax({url:uploadURL,type:"POST",contentType:false,processData:false,cache:false,data:fd,
		xhr:function(){
			var xhrobj=$.ajaxSettings.xhr();
			if(xhrobj.upload){
				// xhrobj.upload.addEventListener('progress',function(event){},false);
				xhrobj.upload.onprogress=function(e){
					var percent=0;
					if(e.lengthComputable) percent=Math.ceil((e.loaded||e.position)/e.total*100);
					
					fileUploadStatus(el,percent,jqXHR,false);
				}
			}
			return xhrobj;
		},
		success:function(data){
			if(data.indexOf("ERROR:")===0){
				el.find(">div").empty().append('<span style="color:#f8675f">'+data.substring(6)+'</span><br /><strong>Choose a file</strong> or drop it here.');
				el.removeClass("inProcess").removeClass("icLoading").addClass("icUpload");
				return false;
			}
			else fileUploadStatus(el,100,jqXHR,data);
		}
	});
	
	fileUploadStatus(el,0,jqXHR,false);
}

function fileUploadStatus(el,p,xhr,data){
	if(data!==false){
		el.find(">div").html("Uploaded");
	}else el.find(">div").html("Uploading... "+p+"%");
	
	el.trigger("upload-progress-changed",{p:p,xhr:xhr,data:data});
}