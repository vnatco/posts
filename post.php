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

if($_REQUEST['w']=="category"&&isset($_REQUEST['a'])){
	if(strtolower($_REQUEST['a'])=="insert"&&isset($_POST['project_id'])&&isset($_POST['title'])&&isset($_POST['color'])){
		// Insert Category
		if(($id=$MySQL->InsertCategory($_POST['project_id'],$_POST['title'],$_POST['color']))!==false) die((string)$id);
	}else if(strtolower($_REQUEST['a'])=="update"&&isset($_POST['id'])&&isset($_POST['title'])&&isset($_POST['color'])){
		// Update Category
		if($MySQL->UpdateCategory($_POST['id'],$_POST['title'],$_POST['color'])!==false) die("SUCCESS");
	}else if(strtolower($_REQUEST['a'])=="delete"&&isset($_POST['id'])){
		// Delete Category
		if($MySQL->DeleteCategory($_POST['id'])!==false) die("SUCCESS");
	}else if(strtolower($_REQUEST['a'])=="order"&&isset($_POST['project_id'])&&isset($_POST['ids'])){
		// Re Order Category Items
		if($MySQL->ReOrderCategory($_POST['project_id'],@explode(",",$_POST['ids']))!==false) die("SUCCESS");
	}
}
else if($_REQUEST['w']=="group"&&isset($_REQUEST['a'])){
	if(strtolower($_REQUEST['a'])=="insert"&&isset($_POST['category_id'])&&isset($_POST['title'])){
		// Insert Group
		if(($id=$MySQL->InsertGroup($_POST['category_id'],$_POST['title']))!==false) die((string)$id);
	}else if(strtolower($_REQUEST['a'])=="update"&&isset($_POST['id'])&&isset($_POST['title'])){
		// Update Category
		if($MySQL->UpdateGroup($_POST['id'],$_POST['title'])!==false) die("SUCCESS");
	}else if(strtolower($_REQUEST['a'])=="delete"&&isset($_POST['id'])){
		// Delete Category
		if($MySQL->DeleteGroup($_POST['id'])!==false) die("SUCCESS");
	}else if(strtolower($_REQUEST['a'])=="order"&&isset($_POST['category_id'])&&isset($_POST['ids'])){
		// Re Order Category Items
		if($MySQL->ReOrderGroup($_POST['category_id'],@explode(",",$_POST['ids']))!==false) die("SUCCESS");
	}
}
else if($_REQUEST['w']=="post"&&isset($_REQUEST['a'])){
	if(strtolower($_REQUEST['a'])=="insert"&&isset($_POST['group_id'])&&isset($_POST['title'])){
		// Insert Post
		if(($id=$MySQL->InsertPost($_POST['group_id'],$_POST['title']))!==false) die((string)$id);
	}else if(strtolower($_REQUEST['a'])=="update"&&isset($_POST['id'])&&isset($_POST['title'])){
		// Update Post
		if($MySQL->UpdatePost($_POST['id'],$_POST['title'])!==false) die("SUCCESS");
	}else if(strtolower($_REQUEST['a'])=="delete"&&isset($_POST['id'])){
		// Delete Post
		if($MySQL->DeletePost($_POST['id'])!==false) die("SUCCESS");
	}else if(strtolower($_REQUEST['a'])=="order"&&isset($_POST['group_id'])&&isset($_POST['ids'])){
		// Re Order Post Items
		if($MySQL->ReOrderPost($_POST['group_id'],@explode(",",$_POST['ids']))!==false) die("SUCCESS");
	}
}
else if($_REQUEST['w']=="field"&&isset($_REQUEST['a'])){
	if(strtolower($_REQUEST['a'])=="insert"&&isset($_POST['post_id'])&&isset($_POST['type_id'])&&isset($_POST['content'])&&isset($_POST['meta'])){
		// Insert Post Field
		if(($id=$MySQL->InsertField($_POST['post_id'],$_POST['type_id'],$_POST['content'],$_POST['meta']))!==false) die((string)$id);
	}else if(strtolower($_REQUEST['a'])=="update"&&isset($_POST['id'])&&isset($_POST['content'])&&isset($_POST['meta'])){
		// Update Post Field
		if($MySQL->UpdateField($_POST['id'],$_POST['content'],$_POST['meta'])!==false) die("SUCCESS");
	}else if(strtolower($_REQUEST['a'])=="delete"&&isset($_POST['id'])){
		// Delete Post Field
		if($MySQL->DeleteField($_POST['id'])!==false) die("SUCCESS");
	}else if(strtolower($_REQUEST['a'])=="order"&&isset($_POST['post_id'])&&isset($_POST['ids'])){
		// Re Order Post Item Fields
		if($MySQL->ReOrderField($_POST['post_id'],@explode(",",$_POST['ids']))!==false) die("SUCCESS");
	}
}

ob_clean();

?>