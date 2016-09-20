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

try{
	if(!isset($_FILES['file']['error'])||is_array($_FILES['file']['error'])) throw new Exception('Invalid parameters.');
	
	switch($_FILES['file']['error']) {
		case UPLOAD_ERR_OK: break;
		case UPLOAD_ERR_NO_FILE: throw new RuntimeException('No file sent.');
		case UPLOAD_ERR_INI_SIZE:
		case UPLOAD_ERR_FORM_SIZE: throw new RuntimeException('Exceeded filesize limit.');
		default: throw new RuntimeException('Unknown errors.');
	}
	
	if($_FILES['file']['size']>1024*1024*50) throw new RuntimeException('Exceeded filesize limit.');
	
	$path=sprintf('files/%s.%s',sha1_file($_FILES['file']['tmp_name']),"png");
	
	if(!move_uploaded_file($_FILES['file']['tmp_name'],$path)) throw new RuntimeException('Failed to move uploaded file.');
	
	echo $path;
}catch(Exception $e){
	echo "ERROR:".$e->getMessage();
}

?>