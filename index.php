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

$_metaTitle="Posts";
$_metaDescription="";
$_metaImage="";
$_metaKeywords="";
$_menuContent="";
$_postUrl="";
$_pageUrl="get.php";
$_pageTitle="Categories";
$_pageParams=array("w"=>"categories");

if(isset($_GET['p'])&&@$_GET['p']!=""){
	$_menuContent="";
	
	$post=$MySQL->GetSharedPostById($_GET['p']);
	if($post!==false){
		$_pageTitle=$post['NAME'];
		$_pageParams=array("w"=>"post","id"=>$_GET['p'],"shared"=>"yes");
		$_postUrl=SITE_URL."/".$post['SHARED_ID'];
		
		$_metaTitle=$post['CATEGORY_NAME'].": ".$post['NAME'];
		$_metaDescription="";
		$_metaImage="";
		$_metaKeywords="";
	}else{
		$_pageTitle="Error";
		$_pageParams=array("w"=>"error","p"=>"not_found");
	}
}else if($user===false) RedirectToLogin(); else{
	$clients=array();
	$projects=array();
	
	foreach($MySQL->GetProjects() as $p){
		if(array_search($p['CLIENT_ID'],array_column($clients,"ID"))===false) $clients[]=array("ID"=>$p['CLIENT_ID'],"NAME"=>$p['CLIENT_NAME']);
		if(array_search($p['ID'],array_column($projects,"ID"))===false) $projects[]=array("ID"=>$p['ID'],"CLIENT_ID"=>$p['CLIENT_ID'],"NAME"=>$p['NAME']);
	}
	
	$tmpClass=new TemplateClass("templates/menu.html");
	$tmpClass->addParam("@_CLIENTS",base64_encode(json_encode($clients)));
	$tmpClass->addParam("@_PROJECTS",base64_encode(json_encode($projects)));
	$tmpClass->addParam("@_CURRENT_CLIENT_ID",$project['CLIENT_ID']);
	$tmpClass->addParam("@_CURRENT_CLIENT",$project['CLIENT_NAME']);
	$tmpClass->addParam("@_CURRENT_PROJECT_ID",$project['ID']);
	$tmpClass->addParam("@_CURRENT_PROJECT",$project['NAME']);
	$_menuContent=$tmpClass->getTemplate();
}

$tmpClass=new TemplateClass("templates/index.html");
$tmpClass->addParam("@_META_TITLE",$_metaTitle);
$tmpClass->addParam("@_META_DESCRIPTION",$_metaDescription);
$tmpClass->addParam("@_META_IMAGE",$_metaImage);
$tmpClass->addParam("@_META_KEYWORDS",$_metaKeywords);
$tmpClass->addParam("@_POST_URL",$_postUrl);
$tmpClass->addParam("@_SITE_URL",SITE_URL);
$tmpClass->addParam("@_PROJECT_ID",$project['ID']);
$tmpClass->addParam("@_COLORS",base64_encode(json_encode($MySQL->GetColors())));
$tmpClass->addParam("@_MAIN_PAGE_URL",$_pageUrl);
$tmpClass->addParam("@_MAIN_PAGE_TITLE",$_pageTitle);
$tmpClass->addParam("@_MAIN_PAGE_PARAMS",base64_encode(json_encode($_pageParams)));
$tmpClass->addParam("@_MENU_CONTENT",$_menuContent);
echo $tmpClass->getTemplate();

?>