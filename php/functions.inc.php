<?php

class Functions{
	public static $names=array('Carroll Basnett','Celestina Reichert','Doyle Hays','Bette Horace','Yetta Fox','Horacio Balboa','Barrie Wilmore','Almeta Brasil','Grace Pizer','Don Bogart','Georgette Lesser','Casimira Dorner','Winona Jarnigan','Marvella Drury','Bella Dorman','Gerald Vanderveer','Rivka Nagler','Milly Brower','Irmgard Buch','Sierra Boxx','Mikel Schuh','Damien Purdue','Pearline Bonifacio','Evelia Mccotter','Reginald Scheuerman','Sona Rocheleau','Alma Fernando','Wilton Holbrook','Lena Doyle','Loretta Womack','Kia Dowe','Isaiah Sherk','Mina Bryant','Millicent Grignon','Bell Mathison','Napoleon Caban','Nanci Balmer','Kareen Mcfaul','Stacie Vanwagner','Bryan Hannaman','Kemberly Seeman','Earline Beecham','Brady Milbourne','Ignacia Kramer','Domenica Chauvin','Amberly Carballo','Marta Imler','Dawne Berube','Johnsie Reilley','Tonja Purinton');
	
	public static function GenerateRandomString($size=32,$chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"){
		$chars=str_split($chars);
		$length=count($chars);
		$result="";
		for($i=0;$i<$size;$i++){
			$index=0;
			if(version_compare(PHP_VERSION,'7.0.0','>=')&&function_exists("random_int")) $index=random_int($length);
			else if(extension_loaded('libsodium')) $index=\Sodium\randombytes_uniform($length);
			else if(function_exists('mb_rand')) $index=mb_rand(0,$length-1);
			else $index=rand(0,$length-1);
			$result.=$chars[$index];
		}
		return $result;
	}
	public static function GetRandomName(){
		return self::$names[rand(0,count(self::$names)-1)];
	}
}

?>