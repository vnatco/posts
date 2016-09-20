<?php

class MySQL{
	private $db;
	private $user;
	
	public function __construct(&$db,&$user){
		$this->db=$db;
		$this->user=$user;
	}
	
	/////////////////////////////////////////////////////////////////////
	// Get
	public function GetSharedId(){
		$id=Functions::GenerateRandomString(8);
		while($this->db->query("SELECT `SHARED_ID` from `post` WHERE `SHARED_ID`='".preg_replace("/[^a-zA-Z0-9\_\-]/","",$id)."'")->fetch()!==false) $id=Functions::GenerateRandomString(8);
		return $id;
	}
	public function GetColors(){
		$sth=$this->db->prepare("SELECT * FROM `color`");
		$sth->execute(array());
		$rows=$sth->fetchAll();
		if(!is_array($rows)||count($rows)>0) return $rows; else return false;
	}
	public function GetProjects(){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT 
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `ID`,
				`pro`.`NAME` AS `NAME`
				
			FROM `project` `pro`
			
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
				
			WHERE
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
			
			ORDER BY `cli`.`NAME` ASC,`pro`.`NAME` ASC
		");
		$sth->execute(array($this->user['ID']));
		$rows=$sth->fetchAll();
		if(!is_array($rows)||count($rows)>0) return $rows; else return false;
	}
	public function GetPersonalProject(){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT 
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `ID`,
				`pro`.`NAME` AS `NAME`
				
			FROM `project` `pro`
			
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
				
			WHERE
				`pro`.`OWNER_ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
			
			LIMIT 0,1
		");
		$sth->execute(array($this->user['ID'],$this->user['ID']));
		if($row=$sth->fetch()) return $row; else return false;
	}
	public function GetProjectById($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT 
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `ID`,
				`pro`.`NAME` AS `NAME`
				
			FROM `project` `pro`
			
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
				
			WHERE
				`pro`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
			
			LIMIT 0,1
		");
		$sth->execute(array($id,$this->user['ID']));
		if($row=$sth->fetch()) return $row; else return false;
	}
	public function GetCategoryById($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT 
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`cat`.`ID` AS `ID`,
				`cat`.`ORDER` AS `ORDER`,
				`cat`.`NAME` AS `NAME`,
				`cat`.`CREATED_AT` AS `CREATED_AT`,
				`cat`.`UPDATED_AT` AS `UPDATED_AT`
				
			FROM `category` `cat`
			
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`cat`.`IS_VISIBLE`=1 AND
				`cat`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
			
			ORDER BY `cat`.`ORDER`,`cat`.`NAME`
		");
		$sth->execute(array($id,$this->user['ID']));
		if($row=$sth->fetch()) return $row; else return false;
	}
	public function GetCategoriesByProjectId($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT 
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`cat`.`ID` AS `ID`,
				`cat`.`ORDER` AS `ORDER`,
				`cat`.`NAME` AS `NAME`,
				`cat`.`CREATED_AT` AS `CREATED_AT`,
				`cat`.`UPDATED_AT` AS `UPDATED_AT`
				
			FROM `category` `cat`
			
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`cat`.`IS_VISIBLE`=1 AND
				`pro`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
			
			ORDER BY `cat`.`ORDER`,`cat`.`NAME`
		");
		$sth->execute(array($id,$this->user['ID']));
		$rows=$sth->fetchAll();
		if(!is_array($rows)||count($rows)>0) return $rows; else return false;
	}
	public function GetGroupsByCategoryId($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`cat`.`ID` AS `CATEGORY_ID`,
				`cat`.`NAME` AS `CATEGORY_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`grp`.`ID` AS `ID`,
				`grp`.`ORDER` AS `ORDER`,
				`grp`.`NAME` AS `NAME`,
				`grp`.`CREATED_AT` AS `CREATED_AT`,
				`grp`.`UPDATED_AT` AS `UPDATED_AT`
			
			FROM `group` `grp`
			LEFT JOIN `category` `cat` ON `cat`.`ID`=`grp`.`CATEGORY_ID`
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`grp`.`IS_VISIBLE`=1 AND
				`cat`.`IS_VISIBLE`=1 AND
				`cat`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
				
			ORDER BY `grp`.`ORDER`,`grp`.`NAME`
		");
		$sth->execute(array($id,$this->user['ID']));
		$rows=$sth->fetchAll();
		if(!is_array($rows)||count($rows)>0) return $rows; else return false;
	}
	public function GetGroupById($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`cat`.`ID` AS `CATEGORY_ID`,
				`cat`.`NAME` AS `CATEGORY_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`grp`.`ID` AS `ID`,
				`grp`.`NAME` AS `NAME`,
				`grp`.`CREATED_AT` AS `CREATED_AT`,
				`grp`.`UPDATED_AT` AS `UPDATED_AT`
			
			FROM `group` `grp`
			LEFT JOIN `category` `cat` ON `cat`.`ID`=`grp`.`CATEGORY_ID`
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`grp`.`IS_VISIBLE`=1 AND
				`cat`.`IS_VISIBLE`=1 AND
				`grp`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
				
			ORDER BY `grp`.`ORDER`,`grp`.`NAME`
		");
		$sth->execute(array($id,$this->user['ID']));
		if($row=$sth->fetch()) return $row; else return false;
	}
	public function GetPostsByGroupId($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`cat`.`ID` AS `CATEGORY_ID`,
				`cat`.`NAME` AS `CATEGORY_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`grp`.`ID` AS `GROUP_ID`,
				`grp`.`NAME` AS `GROUP_NAME`,
				
				`post`.`ID` AS `ID`,
				`post`.`ORDER` AS `ORDER`,
				`post`.`NAME` AS `NAME`,
				`post`.`CREATED_AT` AS `CREATED_AT`,
				`post`.`UPDATED_AT` AS `UPDATED_AT`
			
			FROM `post`
			LEFT JOIN `group` `grp` ON `grp`.`ID`=`post`.`GROUP_ID`
			LEFT JOIN `category` `cat` ON `cat`.`ID`=`grp`.`CATEGORY_ID`
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`post`.`IS_VISIBLE`=1 AND
				`grp`.`IS_VISIBLE`=1 AND
				`cat`.`IS_VISIBLE`=1 AND
				`grp`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
				
			ORDER BY `post`.`ORDER`,`post`.`NAME`
		");
		$sth->execute(array($id,$this->user['ID']));
		$rows=$sth->fetchAll();
		if(!is_array($rows)||count($rows)>0) return $rows; else return false;
	}
	public function GetPostById($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`cat`.`ID` AS `CATEGORY_ID`,
				`cat`.`NAME` AS `CATEGORY_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`grp`.`ID` AS `GROUP_ID`,
				`grp`.`NAME` AS `GROUP_NAME`,
				
				`post`.`ID` AS `ID`,
				`post`.`SHARED_ID` AS `SHARED_ID`,
				`post`.`ORDER` AS `ORDER`,
				`post`.`NAME` AS `NAME`,
				`post`.`CREATED_AT` AS `CREATED_AT`,
				`post`.`UPDATED_AT` AS `UPDATED_AT`
			
			FROM `post`
			LEFT JOIN `group` `grp` ON `grp`.`ID`=`post`.`GROUP_ID`
			LEFT JOIN `category` `cat` ON `cat`.`ID`=`grp`.`CATEGORY_ID`
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`post`.`IS_VISIBLE`=1 AND
				`grp`.`IS_VISIBLE`=1 AND
				`cat`.`IS_VISIBLE`=1 AND
				`post`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
				
			LIMIT 0,1
		");
		$sth->execute(array($id,$this->user['ID']));
		if($row=$sth->fetch()) return $row; else return false;
	}
	public function GetSharedPostById($id){
		$sth=$this->db->prepare("
			SELECT
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`cat`.`ID` AS `CATEGORY_ID`,
				`cat`.`NAME` AS `CATEGORY_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`grp`.`ID` AS `GROUP_ID`,
				`grp`.`NAME` AS `GROUP_NAME`,
				
				`post`.`ID` AS `ID`,
				`post`.`SHARED_ID` AS `SHARED_ID`,
				`post`.`ORDER` AS `ORDER`,
				`post`.`NAME` AS `NAME`,
				`post`.`CREATED_AT` AS `CREATED_AT`,
				`post`.`UPDATED_AT` AS `UPDATED_AT`
			
			FROM `post`
			LEFT JOIN `group` `grp` ON `grp`.`ID`=`post`.`GROUP_ID`
			LEFT JOIN `category` `cat` ON `cat`.`ID`=`grp`.`CATEGORY_ID`
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`post`.`IS_VISIBLE`=1 AND
				`grp`.`IS_VISIBLE`=1 AND
				`cat`.`IS_VISIBLE`=1 AND
				`post`.`SHARED_ID`=?
				
			LIMIT 0,1
		");
		$sth->execute(array($id));
		if($row=$sth->fetch()) return $row; else return false;
	}
	public function GetFieldsByPostId($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`cat`.`ID` AS `CATEGORY_ID`,
				`cat`.`NAME` AS `CATEGORY_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`grp`.`ID` AS `GROUP_ID`,
				`grp`.`NAME` AS `GROUP_NAME`,
				
				`post`.`ID` AS `POST_ID`,
				`post`.`NAME` AS `POST_NAME`,
				
				`type`.`ID` AS `TYPE_ID`,
				`type`.`NAME` AS `TYPE_NAME`,
				
				`field`.`ID` AS `ID`,
				`field`.`ORDER` AS `ORDER`,
				`field`.`CONTENT` AS `CONTENT`,
				`field`.`META` AS `META`,
				`field`.`CREATED_AT` AS `CREATED_AT`,
				`field`.`UPDATED_AT` AS `UPDATED_AT`
			
			FROM `post_field` `field`
			LEFT JOIN `post_field_type` `type` ON `type`.`ID`=`field`.`TYPE_ID`
			LEFT JOIN `post` ON `post`.`ID`=`field`.`POST_ID`
			LEFT JOIN `group` `grp` ON `grp`.`ID`=`post`.`GROUP_ID`
			LEFT JOIN `category` `cat` ON `cat`.`ID`=`grp`.`CATEGORY_ID`
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`field`.`IS_VISIBLE`=1 AND
				`post`.`IS_VISIBLE`=1 AND
				`grp`.`IS_VISIBLE`=1 AND
				`cat`.`IS_VISIBLE`=1 AND
				`post`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
				
			ORDER BY `field`.`ORDER`
		");
		$sth->execute(array($id,$this->user['ID']));
		$rows=$sth->fetchAll();
		if(!is_array($rows)||count($rows)>0) return $rows; else return false;
	}
	public function GetFieldsBySharedPostId($id){
		$sth=$this->db->prepare("
			SELECT
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`cat`.`ID` AS `CATEGORY_ID`,
				`cat`.`NAME` AS `CATEGORY_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`grp`.`ID` AS `GROUP_ID`,
				`grp`.`NAME` AS `GROUP_NAME`,
				
				`post`.`ID` AS `POST_ID`,
				`post`.`NAME` AS `POST_NAME`,
				
				`type`.`ID` AS `TYPE_ID`,
				`type`.`NAME` AS `TYPE_NAME`,
				
				`field`.`ID` AS `ID`,
				`field`.`ORDER` AS `ORDER`,
				`field`.`CONTENT` AS `CONTENT`,
				`field`.`META` AS `META`,
				`field`.`CREATED_AT` AS `CREATED_AT`,
				`field`.`UPDATED_AT` AS `UPDATED_AT`
			
			FROM `post_field` `field`
			LEFT JOIN `post_field_type` `type` ON `type`.`ID`=`field`.`TYPE_ID`
			LEFT JOIN `post` ON `post`.`ID`=`field`.`POST_ID`
			LEFT JOIN `group` `grp` ON `grp`.`ID`=`post`.`GROUP_ID`
			LEFT JOIN `category` `cat` ON `cat`.`ID`=`grp`.`CATEGORY_ID`
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`field`.`IS_VISIBLE`=1 AND
				`post`.`IS_VISIBLE`=1 AND
				`grp`.`IS_VISIBLE`=1 AND
				`cat`.`IS_VISIBLE`=1 AND
				`post`.`SHARED_ID`=?
				
			ORDER BY `field`.`ORDER`
		");
		$sth->execute(array($id));
		$rows=$sth->fetchAll();
		if(!is_array($rows)||count($rows)>0) return $rows; else return false;
	}
	public function GetFieldById($id){
		if($this->user===false) return false;
		$sth=$this->db->prepare("
			SELECT
				`cli`.`ID` AS `CLIENT_ID`,
				`cli`.`NAME` AS `CLIENT_NAME`,
				
				`pro`.`ID` AS `PROJECT_ID`,
				`pro`.`NAME` AS `PROJECT_NAME`,
				
				`cat`.`ID` AS `CATEGORY_ID`,
				`cat`.`NAME` AS `CATEGORY_NAME`,
				
				`col`.`ID` AS `COLOR_ID`,
				`col`.`NAME` AS `COLOR_NAME`,
				`col`.`CLASS` AS `COLOR_CLASS`,
				
				`grp`.`ID` AS `GROUP_ID`,
				`grp`.`NAME` AS `GROUP_NAME`,
				
				`post`.`ID` AS `POST_ID`,
				`post`.`NAME` AS `POST_NAME`,
				
				`type`.`ID` AS `TYPE_ID`,
				`type`.`NAME` AS `TYPE_NAME`,
				
				`field`.`ID` AS `ID`,
				`field`.`ORDER` AS `ORDER`,
				`field`.`CONTENT` AS `CONTENT`,
				`field`.`META` AS `META`,
				`field`.`CREATED_AT` AS `CREATED_AT`,
				`field`.`UPDATED_AT` AS `UPDATED_AT`
			
			FROM `post_field` `field`
			LEFT JOIN `post_field_type` `type` ON `type`.`ID`=`field`.`TYPE_ID`
			LEFT JOIN `post` ON `post`.`ID`=`field`.`POST_ID`
			LEFT JOIN `group` `grp` ON `grp`.`ID`=`post`.`GROUP_ID`
			LEFT JOIN `category` `cat` ON `cat`.`ID`=`grp`.`CATEGORY_ID`
			LEFT JOIN `project` `pro` ON `pro`.`ID`=`cat`.`PROJECT_ID`
			LEFT JOIN `client` `cli` ON `cli`.`ID`=`pro`.`CLIENT_ID`
			LEFT JOIN `color` `col` ON `col`.`ID`=`cat`.`COLOR_ID`
			
			WHERE
				`field`.`IS_VISIBLE`=1 AND
				`post`.`IS_VISIBLE`=1 AND
				`grp`.`IS_VISIBLE`=1 AND
				`cat`.`IS_VISIBLE`=1 AND
				`field`.`ID`=? AND
				(SELECT COUNT(*) from `user_project_access` `upa` WHERE `upa`.`PROJECT_ID`=`pro`.`ID` AND `upa`.`USER_ID`=?)!=0
				
			LIMIT 0,1
		");
		$sth->execute(array($id,$this->user['ID']));
		if($row=$sth->fetch()) return $row; else return false;
	}
	
	
	/////////////////////////////////////////////////////////////////////
	// Insert
	public function InsertCategory($project_id,$title,$color_id){
		if($this->user===false) return false;
		$project=$this->GetProjectById($project_id);
		if(!$project) return false;
		
		$sth=$this->db->prepare("INSERT into `category` (`ORDER`,`PROJECT_ID`,`COLOR_ID`,`NAME`,`IS_VISIBLE`,`CREATED_AT`) VALUES ((SELECT IFNULL(MAX(`ORDER`),1) FROM `category` `c2` WHERE `c2`.`PROJECT_ID`=?)+1,?,?,?,1,NOW())");
		$sth->execute(array($project['ID'],$project['ID'],$color_id,$title));
		return $this->db->lastInsertId();
	}
	public function InsertGroup($category_id,$title){
		if($this->user===false) return false;
		$category=$this->GetCategoryById($category_id);
		if(!$category) return false;
		
		$sth=$this->db->prepare("INSERT into `group` (`ORDER`,`CATEGORY_ID`,`NAME`,`IS_VISIBLE`,`CREATED_AT`) VALUES ((SELECT IFNULL(MAX(`ORDER`),1) FROM `group` `g2` WHERE `g2`.`CATEGORY_ID`=?)+1,?,?,1,NOW())");
		$sth->execute(array($category['ID'],$category['ID'],$title));
		return $this->db->lastInsertId();
	}
	public function InsertPost($group_id,$title){
		if($this->user===false) return false;
		$group=$this->GetGroupById($group_id);
		if(!$group) return false;
		
		$sharedId=$this->GetSharedId();
		$sth=$this->db->prepare("INSERT into `post` (`SHARED_ID`,`ORDER`,`GROUP_ID`,`NAME`,`IS_VISIBLE`,`CREATED_AT`) VALUES (?,(SELECT IFNULL(MAX(`ORDER`),1) FROM `post` `p2` WHERE `p2`.`GROUP_ID`=?)+1,?,?,1,NOW())");
		$sth->execute(array($sharedId,$group['ID'],$group['ID'],$title));
		return $this->db->lastInsertId();
	}
	public function InsertField($post_id,$type_id,$content,$meta){
		if($this->user===false) return false;
		$post=$this->GetPostById($post_id);
		if(!$post) return false;
		
		$sth=$this->db->prepare("INSERT into `post_field` (`ORDER`,`POST_ID`,`TYPE_ID`,`CONTENT`,`META`,`IS_VISIBLE`,`CREATED_AT`) VALUES ((SELECT IFNULL(MAX(`ORDER`),1) FROM `post_field` `pf2` WHERE `pf2`.`POST_ID`=?)+1,?,?,?,?,1,NOW())");
		$sth->execute(array($post['ID'],$post['ID'],$type_id,$content,$meta));
		return $this->db->lastInsertId();
	}
	
	
	/////////////////////////////////////////////////////////////////////
	// Update
	public function UpdateCategory($id,$title,$color_id){
		if($this->user===false) return false;
		$category=$this->GetCategoryById($id);
		if(!$category) return false;
		
		$sth=$this->db->prepare("UPDATE `category` SET `COLOR_ID`=?,`NAME`=? WHERE `ID`=?");
		$sth->execute(array($color_id,$title,$category['ID']));
		return true;
	}
	public function UpdateGroup($id,$title){
		if($this->user===false) return false;
		$group=$this->GetGroupById($id);
		if(!$group) return false;
		
		$sth=$this->db->prepare("UPDATE `group` SET `NAME`=? WHERE `ID`=?");
		$sth->execute(array($title,$group['ID']));
		return true;
	}
	public function UpdatePost($id,$title){
		if($this->user===false) return false;
		$post=$this->GetPostById($id);
		if(!$post) return false;
		
		$sth=$this->db->prepare("UPDATE `post` SET `NAME`=? WHERE `ID`=?");
		$sth->execute(array($title,$post['ID']));
		return true;
	}
	public function UpdateField($id,$content,$meta){
		if($this->user===false) return false;
		$field=$this->GetFieldById($id);
		if(!$field) return false;
		
		$sth=$this->db->prepare("UPDATE `post_field` SET `CONTENT`=?,`META`=? WHERE `ID`=?");
		$sth->execute(array($content,$meta,$field['ID']));
		return true;
	}
	
	
	/////////////////////////////////////////////////////////////////////
	// Delete
	public function DeleteCategory($id){
		if($this->user===false) return false;
		$category=$this->GetCategoryById($id);
		if(!$category) return false;
		
		$sth=$this->db->prepare("DELETE FROM `category` WHERE `ID`=?");
		$sth->execute(array($category['ID']));
		return true;
	}
	public function DeleteGroup($id){
		if($this->user===false) return false;
		$group=$this->GetGroupById($id);
		if(!$group) return false;
		
		$sth=$this->db->prepare("DELETE FROM `group` WHERE `ID`=?");
		$sth->execute(array($group['ID']));
		return true;
	}
	public function DeletePost($id){
		if($this->user===false) return false;
		$post=$this->GetPostById($id);
		if(!$post) return false;
		
		$sth=$this->db->prepare("DELETE FROM `post` WHERE `ID`=?");
		$sth->execute(array($post['ID']));
		return true;
	}
	public function DeleteField($id){
		if($this->user===false) return false;
		$field=$this->GetFieldById($id);
		if(!$field) return false;
		
		$sth=$this->db->prepare("DELETE FROM `post_field` WHERE `ID`=?");
		$sth->execute(array($field['ID']));
		return true;
	}
	
	
	/////////////////////////////////////////////////////////////////////
	// Delete
	public function ReOrderCategory($project_id,$ids){
		if($this->user===false) return false;
		if(!is_array($ids)) return false;
		$categories=$this->GetCategoriesByProjectId($project_id);
		if(!$categories) return false;
		
		foreach($categories as $category){
			if(($order=array_search($category['ID'],$ids))!==false&&($order+1)!=$category['ORDER']){
				$this->db->prepare("UPDATE `category` SET `ORDER`=? WHERE `ID`=?")->execute(array(($order+1),$category['ID']));
			}
		}
	}
	public function ReOrderGroup($category_id,$ids){
		if($this->user===false) return false;
		if(!is_array($ids)) return false;
		$groups=$this->GetGroupsByCategoryId($category_id);
		if(!$groups) return false;
		
		foreach($groups as $group){
			if(($order=array_search($group['ID'],$ids))!==false&&($order+1)!=$group['ORDER']){
				$this->db->prepare("UPDATE `group` SET `ORDER`=? WHERE `ID`=?")->execute(array(($order+1),$group['ID']));
			}
		}
	}
	public function ReOrderPost($group_id,$ids){
		if($this->user===false) return false;
		if(!is_array($ids)) return false;
		$posts=$this->GetPostsByGroupId($group_id);
		if(!$posts) return false;
		
		foreach($posts as $post){
			if(($order=array_search($post['ID'],$ids))!==false&&($order+1)!=$post['ORDER']){
				$this->db->prepare("UPDATE `post` SET `ORDER`=? WHERE `ID`=?")->execute(array(($order+1),$post['ID']));
			}
		}
	}
	public function ReOrderField($post_id,$ids){
		if($this->user===false) return false;
		if(!is_array($ids)) return false;
		$fields=$this->GetFieldsByPostId($post_id);
		if(!$fields) return false;
		
		foreach($fields as $field){
			if(($order=array_search($field['ID'],$ids))!==false&&($order+1)!=$field['ORDER']){
				$this->db->prepare("UPDATE `post_field` SET `ORDER`=? WHERE `ID`=?")->execute(array(($order+1),$field['ID']));
			}
		}
	}
}

?>