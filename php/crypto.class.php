<?php

class Crypto{
	const DEFAULT_KEY_EXTRA="CryptoPHP.DKE|DefaultKeyExtra";
	const ENCRYPT_KEY_EXTRA="CryptoPHP.EKE|EncryptKeyExtra";
	const HMAC_KEY_EXTRA="CryptoPHP.HKE|HMACKeyExtra";
	
	/*	@ This function will generate openssl private and public key pair
	 *	Input
	 *		- (string) Selects which digest method to use
	 *		- (integer) Specifies how many bits should be used to generate a private key
	 *		- (integer) Specifies the type of private key to create.
	 *		  This can be one of OPENSSL_KEYTYPE_DSA, OPENSSL_KEYTYPE_DH or 
	 *		  OPENSSL_KEYTYPE_RSA. The default value is OPENSSL_KEYTYPE_RSA which is currently the only supported key type. 
	 *	Output
	 *		- (array) Array of public and private key.
	 */
	public static function sslGenerateKeyPair($alg="sha512",$bits=4096,$type=OPENSSL_KEYTYPE_RSA){
		// Init configuration
		$config=array("digest_alg"=>$alg,"private_key_bits"=>$bits,"private_key_type"=>$type);
		// Create the private and public key
		$res=openssl_pkey_new($config);
		// Extract the private key from $res to $privateKey
		openssl_pkey_export($res,$privateKey);
		// Extract the public key from $res to $publicKey
		$publicKey=openssl_pkey_get_details($res);
		$publicKey=$publicKey["key"];
		// Return array of public and private key
		return array("public"=>$publicKey,"private"=>$privateKey);
	}
	
	/*	@ Will encrypt data using provided public key
	 *	Input
	 *		- (string) Data to encrypt
	 *		- (string) Public key
	 *	Output
	 *		- (string) In case of success will return encrypted data in base64 format
	 *		- (boolean) In case of failure will return false
	 */
	public static function sslPublicEncrypt($data,$key){
		if(openssl_public_encrypt($data,$crypted,$key)!==false){
			return base64_encode($crypted);
		}else return false;
	}
	
	/*	@ Will decrypt (base64) data using provided public key
	 *	Input
	 *		- (string) Data to decrypt in base64 format
	 *		- (string) Public key
	 *	Output
	 *		- (string) In case of success will return decrypted data format
	 *		- (boolean) In case of failure will return false
	 */
	public static function sslPublicDecrypt($data,$key){
		if(openssl_public_decrypt(base64_decode($data),$crypted,$key)!==false){
			return $crypted;
		}else return false;
	}
	
	/*	@ Will encrypt data using provided private key
	 *	Input
	 *		- (string) Data to encrypt
	 *		- (string) Private key
	 *	Output
	 *		- (string) In case of success will return encrypted data in base64 format
	 *		- (boolean) In case of failure will return false
	 */
	public static function sslPrivateEncrypt($data,$key){
		if(openssl_private_encrypt($data,$crypted,$key)!==false){
			return base64_encode($crypted);
		}else return false;
	}
	
	/*	@ Will decrypt (base64) data using provided private key
	 *	Input
	 *		- (string) Data to decrypt in base64 format
	 *		- (string) Private key
	 *	Output
	 *		- (string) In case of success will return decrypted data format
	 *		- (boolean) In case of failure will return false
	 */
	public static function sslPrivateDecrypt($data,$key){
		if(openssl_private_decrypt(base64_decode($data),$crypted,$key)!==false){
			return $crypted;
		}else return false;
	}
	
	/*	@ Will return random pseudo bytes
	 *	Input
	 *		- (integer) Length of bytes
	 *	Output
	 *		- (string) Will return random pseudo bytes
	 */
	public static function sslRandomPseudoBytes($length=32){
		return openssl_random_pseudo_bytes($length);
	}
	
	/*	@ This will generate random pseudo bytes and encrypt it with provided key using openssl public encrypt function
	 *	Input
	 *		- (string) Public key
	 *		- (integer) Length of bytes
	 *	Output
	 *		- (string) In case of success will return encrypted random pseudo bytes in base64 format
	 *		- (boolean) In case of failure will return false
	 */
	public static function sslGenerateEncryptedRPG($key,$length=32){
		$bytes=self::sslRandomPseudoBytes($length);
		return self::sslPublicEncrypt($bytes,$key);
	}
	
	/*	@ Function will encrypt data and return string
	 *	Input
	 *		- (string) Data to encrypt
	 *		- (string) Valid key. Key size MUST to be same as key size for the used algo and mode. Use mcrypt_get_key_size(cipher,mode) function to get key size.
	 *		- (boolean) If true, will return data in base64 format.
	 *		- (string) One of the MCRYPT_ciphername constants, or the name of the algorithm as string.
	 *		- (string) One of the MCRYPT_MODE_modename constants, or one of the following strings: "ecb", "cbc", "cfb", "ofb", "nofb" or "stream".
	 *	Output
	 *		- (string) In case of success will return encrypted IV+ENCRYPTED data
	 *		- (boolean) In case of failure will return false
	 */
	public static function mcryptEncrypt($data,$key,$toBase64=true,$cipher=MCRYPT_RIJNDAEL_256,$mode=MCRYPT_MODE_CBC){
		/* Get IV Size */
		$ivSize=mcrypt_get_iv_size($cipher,$mode);
		/* Get Block Size */
		$blockSize=mcrypt_get_block_size($cipher,$mode);
		/* Generate IV */
		// $iv=mcrypt_create_iv($ivSize,MCRYPT_DEV_URANDOM); // It's not secure
		$iv=self::sslRandomPseudoBytes($ivSize); // This is not secure too. Because it uses openssl_random_pseudo_bytes, second parameter for this function is ref boolean that will be true if it is secure. We don't check that boolean!
		/* Get PKCS#7 padding */
		$pad=$blockSize-(strlen($data)%$blockSize);
		/* Encrypt data and return it */
		$encrypted=false;
		try{
			$encrypted=$iv.mcrypt_encrypt($cipher,self::getKey($key,mcrypt_get_key_size($cipher,$mode),self::ENCRYPT_KEY_EXTRA),$data.str_repeat(chr($pad),$pad),$mode,$iv);
			if($toBase64===true) $encrypted=base64_encode($encrypted);
		}catch(Exception $e){$encrypted=false;}
		return $encrypted;
	}
	
	/*	@ Function will decrypt base64 data and return string
	 *	Input
	 *		- (string) Data to decrypt
	 *		- (string) Valid key
	 *		- (boolean) If true, input data will be decoded using base64 decode function before decryption
	 *		- (string) One of the MCRYPT_ciphername constants, or the name of the algorithm as string.
	 *		- (string) One of the MCRYPT_MODE_modename constants, or one of the following strings: "ecb", "cbc", "cfb", "ofb", "nofb" or "stream".
	 *	Output
	 *		- (string) In case of success will return decrypted data
	 *		- (boolean) In case of failure will return false
	 */
	public static function mcryptDecrypt($data,$key,$fromBase64=true,$cipher=MCRYPT_RIJNDAEL_256,$mode=MCRYPT_MODE_CBC){
		if($fromBase64===true) $data=base64_decode($data);
		/* Get IV Size */
		$ivSize=mcrypt_get_iv_size($cipher,$mode);
		/* Generate IV */
		$iv=substr($data,0,$ivSize);
		/* Decrypt data and return it */
		$decrypted=false;
		try{
			$decrypted=mcrypt_decrypt($cipher,self::getKey($key,mcrypt_get_key_size($cipher,$mode),self::ENCRYPT_KEY_EXTRA),substr($data,$ivSize),$mode,$iv);
			/* Cut PKCS#7 padding */
			$pad=ord($decrypted[strlen($decrypted)-1]);
			$decrypted=substr($decrypted,0,-$pad);
		}catch(Exception $e){$decrypted=false;}
		return $decrypted;
	}
	
	/*	@ HMAC Sign encrypted content with HMAC-SHA-256
	 *	Input
	 *		- (string) Data to sign
	 *		- (string) HMAC Key
	 *	Output
	 *		- (string) Signed encrypted data in base64 format
	 */
	public static function hmacSign($data,$key){
		return hash_hmac("sha256",$data,$key,true).$data;
	}
	
	/*	@ Verify HMAC-SHA-256 data
	 *	Input
	 *		- (string) Data with 256 bit HMAC
	 *		- (string) HMAC Key
	 *	Output
	 *		- (boolean) True if hashes matched. False if not.
	 */
	public static function hmacVerify($data,$key){
		return self::hashEquals(mb_substr($data,0,32,'8bit'),hash_hmac("sha256",mb_substr($data,32,null,'8bit'),$key,true));
	}
	
	/*	@ Will call self::mcryptEncrypt function and will sign it with HMAC-SHA-256
	 *	Input
	 *		- (string) Data to encrypt
	 *		- (string) Valid key
	 *		- (boolean) If true, will return base64 string. If not, will return raw data
	 *		- (string) One of the MCRYPT_ciphername constants, or the name of the algorithm as string.
	 *		- (string) One of the MCRYPT_MODE_modename constants, or one of the following strings: "ecb", "cbc", "cfb", "ofb", "nofb" or "stream".
	 *	Output
	 *		- (string) In case of success will return HMAC+IV+ENCRYPTED data
	 *		- (boolean) In case of failure will return false
	 */
	public static function mcryptEncryptHMAC($data,$key,$toBase64=true,$cipher=MCRYPT_RIJNDAEL_256,$mode=MCRYPT_MODE_CBC){
		$encrypted=self::mcryptEncrypt($data,$key,false,$cipher,$mode);
		if($encrypted===false) return false;
		$signed=self::hmacSign($encrypted,self::getKey($key,32,self::HMAC_KEY_EXTRA));
		return $toBase64===true?base64_encode($signed):$signed;
	}
	
	/*	@ Will check HMAC-SHA-256 and in case of success will call self::mcryptDecrypt function
	 *	Input
	 *		- (string) Data to decrypt
	 *		- (string) Valid key.
	 *		- (boolean) If true, input data will be decoded using base64 decode function before decryption
	 *		- (string) One of the MCRYPT_ciphername constants, or the name of the algorithm as string.
	 *		- (string) One of the MCRYPT_MODE_modename constants, or one of the following strings: "ecb", "cbc", "cfb", "ofb", "nofb" or "stream".
	 *	Output
	 *		- (string) In case of success will return decrypted data
	 *		- (boolean) In case of failure will return false
	 */
	public static function mcryptDecryptHMAC($data,$key,$fromBase64=true,$cipher=MCRYPT_RIJNDAEL_256,$mode=MCRYPT_MODE_CBC){
		if($fromBase64===true) $data=base64_decode($data);
		if(!self::hmacVerify($data,self::getKey($key,32,self::HMAC_KEY_EXTRA))) return false;
		return self::mcryptDecrypt(mb_substr($data,32,null,'8bit'),$key,false,$cipher=MCRYPT_RIJNDAEL_256,$mode=MCRYPT_MODE_CBC);
	}
	
	/*	@ Return key with needed size based on passphrase
	 *	Input
	 *		- (string) Secret Phrase
	 *		- (integer) Length of returned string
	 *		- (string) Extra. With same passphrase we can get a lot of different keys.
	 *		- (string) Salt
	 *	Output
	 *		- (string) Will return key of needed size
	 */
	public static function getKey($passphrase,$length,$extra=self::DEFAULT_KEY_EXTRA,$salt=null){
		if(is_null($salt)) $salt=str_repeat("\x00",32);
		$hmacKey=hash_hmac("sha256",$passphrase,$salt,true);
		$content='';
        $lastBlock='';
        for($index=1;mb_strlen($content)<$length;++$index){
            $lastBlock=hash_hmac("sha256",$lastBlock.$extra.chr($index),$hmacKey,true);
            $content.=$lastBlock;
        }
		return mb_substr($content,0,$length);
	}
	
	/*	@ Timing attack safe string comparison
	 *	Input
	 *		- (string) String 1
	 *		- (string) String 2
	 *	Output
	 *		- (boolean) Returns TRUE when the two strings are equal, FALSE otherwise.
	 */
	public static function hashEquals($str1,$str2){
		if(strlen($str1)!=strlen($str2)) return false;
		else{
			$res=$str1^$str2;
			$ret=0;
			for($i=strlen($res)-1;$i>=0;$i--) $ret|=ord($res[$i]);
			return !$ret;
		}
	}
}

?>