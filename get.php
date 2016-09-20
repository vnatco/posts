<?php

/*
 * Copyright 2016 Vladimeri Natchkepia
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require_once("includes.inc.php");

if(!isset($_REQUEST['w'])) die("");

$CONTENT="";

if($_REQUEST['w']=="categories"){		// Get list of categories
	$bubbles="";
	if($categories=$MySQL->GetCategoriesByProjectId($project['ID'])){
		foreach($categories as $c){
			$bubbles.='<div data-id="'.$c['ID'].'" data-order="'.$c['ORDER'].'" class="bubble ns color '.$c['COLOR_CLASS'].'"><div>'.$c['NAME'].'</div></div>';
		}
	}
	$templateClass=new TemplateClass("templates/categories.html");
	$templateClass->addParam("@_BUBBLES",$bubbles);
	$CONTENT=$templateClass->getTemplate();
}
else if($_REQUEST['w']=="groups"){		// Get list of groups with post names in it
	$groupsContent="";
	if(!isset($_REQUEST['id'])) die();
	if($groups=$MySQL->GetGroupsByCategoryId($_REQUEST['id'])){
		foreach($groups as $g){
			$postsContent="";
			
			if($posts=$MySQL->GetPostsByGroupId($g['ID'])){
				foreach($posts as $p) $postsContent.='<div class="groupItem ns" data-id="'.$p['ID'].'" data-order="'.$p['ORDER'].'"><div>'.$p['NAME'].'</div></div>';
			}
			
			$templateClass=new TemplateClass("templates/group.html");
			$templateClass->addParam("@_ID",$g['ID']);
			$templateClass->addParam("@_TITLE",$g['NAME']);
			$templateClass->addParam("@_POSTS",$postsContent);
			$groupsContent.=$templateClass->getTemplate();
		}
	}
	
	$templateClass=new TemplateClass("templates/groups.html");
	$templateClass->addParam("@_CATEGORY_ID",$_REQUEST['id']);
	$templateClass->addParam("@_GROUPS",$groupsContent);
	$CONTENT=$templateClass->getTemplate();
}
else if($_REQUEST['w']=="post"){			// Get post content
	$fieldsContent="";
	if(!isset($_REQUEST['id'])) die();
	
	$post=(isset($_REQUEST['shared'])?$MySQL->GetSharedPostById($_REQUEST['id']):$MySQL->GetPostById($_REQUEST['id']));
	if($post===false) die("");
	
	$fields=(isset($_REQUEST['shared'])?$MySQL->GetFieldsBySharedPostId($_REQUEST['id']):$MySQL->GetFieldsByPostId($_REQUEST['id']));
	if($fields){
		foreach($fields as $f){
			$_meta=json_decode($f['META'],true);
			if($_meta===NULL||$_meta===false||json_last_error()!==JSON_ERROR_NONE) $_meta=array();
			
			if($f['TYPE_ID']==1){		// Text Field
				$fieldsContent.='<div class="vpItem" data-id="'.$f['ID'].'"><div class="text">'.$f['CONTENT'].'</div></div>';
			}
			else if($f['TYPE_ID']==2){	// Code Field
				$_mode="Plain Text";
				if(array_key_exists("mode",$_meta)) $_mode=$_meta['mode'];
				$fieldsContent.='<div class="vpItem" data-id="'.$f['ID'].'"><div class="code" data-modeName="'.$_mode.'"><pre class="prettyprint theme-snappy"><code>'.htmlentities($f['CONTENT']).'</code></pre></div></div>';
			}
			else if($f['TYPE_ID']==3){	// Image Field
				$_align="left";
				$_width="";
				$_height="";
				
				if(array_key_exists("align",$_meta))	$_align=$_meta['align'];
				if(array_key_exists("width",$_meta))	$_width=preg_replace("/[^0-9\%]/","",$_meta['width']);
				if(array_key_exists("height",$_meta))	$_height=preg_replace("/[^0-9\%]/","",$_meta['height']);
				
				if($_width!=""&&strpos($_width,"%")===false) $_width.="px";
				if($_height!=""&&strpos($_height,"%")===false) $_height.="px";
				
				$fieldsContent.='<div class="vpItem" data-id="'.$f['ID'].'"><div class="image opIm" data-align="'.$_align.'" align="'.$_align.'" data-width="'.$_width.'" data-height="'.$_height.'"><img src="'.$f['CONTENT'].'" class="ns" draggable="false" style="'.($_width==""?"":"width:".$_width.";").''.($_height==""?"":"height:".$_height.";").'" /></div></div>';
			}
		}
	}
	
	$templateClass=new TemplateClass((isset($_REQUEST['shared'])?"templates/post_shared.html":"templates/post.html"));
	$templateClass->addParam("@_PAGE_URL",SITE_URL."/".$post['SHARED_ID']);
	$templateClass->addParam("@_ID",$post['ID']);
	$templateClass->addParam("@_FIELDS",$fieldsContent);
	$CONTENT=$templateClass->getTemplate();
}
else if($_REQUEST['w']=="error"){			// Get post content
	$message="Unknown Error";
	
	if(isset($_REQUEST['p'])&&$_REQUEST['p']=="not_found") $message="Post not found.";
	
	$templateClass=new TemplateClass("templates/error.html");
	$templateClass->addParam("@_MESSAGE",$message);
	$CONTENT=$templateClass->getTemplate();
}

ob_clean();
die($CONTENT);

?>