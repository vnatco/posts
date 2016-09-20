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

require_once("php/config.inc.php");
require_once("php/functions.inc.php");
require_once("php/template.class.php");
require_once("php/mysql.class.php");
require_once("php/crypto.class.php");

// Define Globals
global $db;
global $user;
global $project;
global $MySQL;

$user=false;

// Open session
if(session_status()==PHP_SESSION_NONE){
	session_name("posts_project");
	@session_start();
}

// Connect to database
try{
	$db=new \PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME,DB_USER,DB_PASS);
	$db->setAttribute(\PDO::ATTR_ERRMODE,\PDO::ERRMODE_SILENT);
	$db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE,\PDO::FETCH_ASSOC);
	$db->query("SET names 'utf8'");
}catch(\PDOException $e){
	die("Can't connect to database.");
}

///////////////////////////////////
// Authorization
// NOTE: This part need to be changed with real user authorization code. The one that uses email and password to log in.
require_once("auth.php");
// END of authorization
///////////////////////////////////

$MySQL=new MySQL($db,$user);

// Change Project
if(isset($_GET['tp'])&&$_GET['tp']!=""){
	$_project=$MySQL->GetProjectById($_GET['tp']);
	if($_project!==false) $_SESSION['project_id']=$_project['ID'];
	header("Location:".SITE_URL."/");
	die();
}

// Get current project
$project=$MySQL->GetPersonalProject();
if(isset($_SESSION['project_id'])){
	$_project=$MySQL->GetProjectById($_SESSION['project_id']);
	if($_project!==false) $project=$_project;
}

// If we have user without personal project
if($user!==false&&$project===false){
	// That's strange
	die("Current user doesn't have root project.");
}

?>