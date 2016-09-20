<?php

///////////////////////////////////
// Authorization
//
// NOTE: This part need to be changed with real user authorization code. The one that uses email and password to log in.
if(isset($_SESSION['user_id'])){
	// Get user from database
	$sth=$db->prepare("SELECT * from `user` WHERE `ID`=?");
	$sth->execute(array($_SESSION['user_id']));
	$user=$sth->fetch();
	
	// We have user_id in sessions but don't have user with same id in database
	if(!$user){
		$_SESSION['user_id']="";
		$_SESSION['project_id']="";
		unset($_SESSION['user_id']);
		unset($_SESSION['project_id']);
		header("Location:".SITE_URL."/");
		die();
	}
}else{
	$_SESSION['project_id']="";
	unset($_SESSION['project_id']);
	
	// We don't have user_id in sessions. Create new user and save user_id in sessions
	$name=Functions::GetRandomName();
	$db->prepare("INSERT INTO `user` (`NAME`,`CREATED_AT`) VALUES (?,NOW())")->execute(array($name));
	$_SESSION['user_id']=$db->lastInsertId();
	
	// Create personal project for new user
	$db->prepare("INSERT INTO `project` (`OWNER_ID`,`CLIENT_ID`,`NAME`,`IS_VISIBLE`,`CREATED_AT`,`UPDATED_AT`) VALUES (?,1,?,1,NOW(),NOW())")->execute(array($_SESSION['user_id'],$name));
	$projectId=$db->lastInsertId();
	
	// Assign new user to new personal project
	$db->prepare("INSERT INTO `user_project_access` (`USER_ID`,`PROJECT_ID`,`PERMISSIONS`,`CREATED_AT`) VALUES (?,?,'[\'all\']',NOW())")->execute(array($_SESSION['user_id'],$projectId));
	
	// Add Category
	$db->prepare("INSERT INTO `category` (`ORDER`,`PROJECT_ID`,`COLOR_ID`,`NAME`,`IS_VISIBLE`,`CREATED_AT`,`UPDATED_AT`) VALUES (1,?,1,'Lesson',1,NOW(),NOW())")->execute(array($projectId));
	$categoryId=$db->lastInsertId();
	
	// Add Group
	$db->prepare("INSERT INTO `group` (`ORDER`,`CATEGORY_ID`,`NAME`,`IS_VISIBLE`,`CREATED_AT`,`UPDATED_AT`) VALUES (1,?,'Getting Started',1,NOW(),NOW())")->execute(array($categoryId));
	$groupId=$db->lastInsertId();
	
	// Add Post
	$postSharedId=Functions::GenerateRandomString(8);
	$db->prepare("INSERT INTO `post` (`SHARED_ID`,`ORDER`,`GROUP_ID`,`NAME`,`IS_VISIBLE`,`CREATED_AT`,`UPDATED_AT`) VALUES (?,1,?,'First Post',1,NOW(),NOW())")->execute(array($postSharedId,$groupId));
	$postId=$db->lastInsertId();
	
	// Add Post Fields
	$db->prepare("INSERT INTO `post_field` (`ORDER`,`POST_ID`,`TYPE_ID`,`CONTENT`,`META`,`IS_VISIBLE`,`CREATED_AT`,`UPDATED_AT`) VALUES (1,?,1,'<p><span style=\"font-size: 26px;\"><strong>What is Lorem Ipsum?</strong></span></p>\n<p>&nbsp;</p>\n<p><span style=\"font-size: 16px;\"><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>','',1,NOW(),NOW())")->execute(array($postId));
	$db->prepare("INSERT INTO `post_field` (`ORDER`,`POST_ID`,`TYPE_ID`,`CONTENT`,`META`,`IS_VISIBLE`,`CREATED_AT`,`UPDATED_AT`) VALUES (2,?,2,'<?\n  // Hello world in PHP\n  print(\"Hello World\");\n?>','{\"mode\":\"PHP\"}',1,NOW(),NOW())")->execute(array($postId));
	$db->prepare("INSERT INTO `post_field` (`ORDER`,`POST_ID`,`TYPE_ID`,`CONTENT`,`META`,`IS_VISIBLE`,`CREATED_AT`,`UPDATED_AT`) VALUES (3,?,1,'<p><span style=\"font-size: 16px;\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nisl lorem, tincidunt id efficitur ac, congue in tellus. Suspendisse aliquam dui consectetur, posuere turpis sit amet, vehicula nisi. Suspendisse tempus commodo nulla vel cursus. Phasellus aliquam nisi a lorem luctus, eu luctus lacus semper. Ut nec consectetur neque. Sed tempor tincidunt nisl ac ornare. Nam eget auctor justo, interdum volutpat lectus. In euismod id nulla nec rhoncus. Phasellus non sagittis libero, id malesuada tellus. </span><span style=\"font-size: 16px;\">Etiam ipsum nunc, mollis ac malesuada quis, imperdiet vel sem. Sed sed urna diam. Quisque sagittis iaculis enim sed vehicula. Pellentesque consectetur varius magna. Duis condimentum fermentum urna, vel hendrerit urna finibus in. Etiam porttitor sodales dignissim.</span></p>','',1,NOW(),NOW())")->execute(array($postId));
	$db->prepare("INSERT INTO `post_field` (`ORDER`,`POST_ID`,`TYPE_ID`,`CONTENT`,`META`,`IS_VISIBLE`,`CREATED_AT`,`UPDATED_AT`) VALUES (4,?,3,'files/4d8759f971b6123c500d72766d3ecc5317f02b72.png','{\"align\":\"left\",\"width\":\"\",\"height\":\"\"}',1,NOW(),NOW())")->execute(array($postId));
	
	header("Location:".SITE_URL."/");
	die();
}
// END of authorization
///////////////////////////////////

?>