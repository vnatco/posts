<?php

class TemplateClass{
	
	var $_content="";
	var $_params=array();
	
	public function __construct($path){
		if($path=="") die("Path not set.");
		if(!file_exists($path)) die("Can't find file: ($path)");
		
		$content=file_get_contents($path);
		if(strpos($content,"<tmp>")!==false&&strpos($content,"</tmp>")!==false){
			$start=strpos($content,"<tmp>")+5;
			$end=strpos($content,"</tmp>",$start)-6;
			$content=substr($content,$start,$end);
		}
		$this->_content=$content;
	}
	
	public function addParam($key,$val,$def=false){
		$this->_params[]=array("key"=>$key,"val"=>$val,"default"=>$def);
	}
	public function resetParams(){
		unset($this->_params);
		$this->_params=array();
	}
	
	public function getTemplate(){
		$content=$this->_content;
		$replaceFrom=array();
		$replaceTo=array();
		
		foreach($this->_params as $param){
			$replaceFrom[]=$param['key'];
			if($param['val']==""&&$param['default']!==false) $replaceTo[]=$param['default'];
			else $replaceTo[]=$param['val'];
		}
		
		if(!empty($replaceFrom)&&!empty($replaceTo)) $content=str_replace($replaceFrom,$replaceTo,$content);
		
		return $content;
	}
}

?>