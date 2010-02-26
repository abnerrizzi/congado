<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Model_Db
 * @version $Id: Backup.php 96 2010-02-26 14:08:59Z bacteria_ $
 * 
 */
class Model_Db_System extends Model_Db
{

	protected $_name = 'system';
	protected $_select = false;
	public static $filePath = '';

	public function getProperty($property = false)
	{
		if (!$property) {
			throw new Zend_Db_Exception('property not passed');
		} else {
			$this->_select = $this->select()
				->where('property = ?', $property);
			$result = $this->fetchRow($this->_select);
			if (count($result) > 0) {
				$return = array();
				var_dump($result);
				die();
				foreach ($result as $key => $value) {
					$return[$key] = utf8_encode($value);
				}
				return $return;
			} else {
				return false;
			}
		}
	}

	public function setBackupground($content, $type, $filePath = false)
	{
		$this->_select = $this->select()->where('property = ?', 'background');
		$row = $this->fetchAll($this->_select);
		$data = array(
			'parameters1' => $content,
			'parameters2' => $type,
			'parameters3' => time(),
		);

		$where = "property = 'background'";

		if ($row->count() > 0) {
			$this->update($data, $where);
		} else {
			$data['property'] = 'background';
			$this->insert($data);
		}

		$this->cacheBackground($data['parameters3'], $data['parameters1']);
		return true;
	}

	public function getBackupground()
	{
		$_cols = array(
			'parameters1' => 'content',
			'parameters2' => 'type',
			'parameters3' => 'time',
		);

		$this->_select = $this->select($_cols)
			->where('property = ?', 'background');
		$result = $this->fetchRow($this->_select);
		if (count($result) > 0) {
			return $result->toArray();
		} else {
			return false;
		}
	}

	public function getBackupgroundTime()
	{
		$_cols = array(
			'time' => 'parameters3',
		);

		$this->_select = $this->select()
			->from($this->_name, $_cols, $this->_schema)
			->where('property = ?', 'background');
		$result = $this->fetchRow($this->_select);
		if (count($result) > 0) {
			$x = $result->toArray();
			return $x['time'];
		} else {
			return false;
		}
	}

	public function getBackupgroundContent()
	{
		$_cols = array(
			'content' => 'parameters1',
		);

		$this->_select = $this->select()
			->from($this->_name, $_cols, $this->_schema)
			->where('property = ?', 'background');
		$result = $this->fetchRow($this->_select);
		if (count($result) > 0) {
			$x = $result->toArray();
			return $x['content'];
		} else {
			return false;
		}
	}

	public function cacheBackground($time = false, $content = false)
	{
		if ($time === false) {
			$time = $this->getBackupgroundTime();
		}
		$dir = realpath(APPLICATION_PATH . '/../scripts');
		$file = "wallpaper";
		$filePath = $dir . '/' . $file;
		self::$filePath = $filePath;
		if (!file_exists($filePath) || $time > filemtime($filePath)) {
			$handle = fopen($filePath, 'w+');
			fwrite($handle, $this->getBackupgroundContent());
			fclose($handle);
		}
		return true;
	}

	public function getBackupgroundMimeType()
	{
		$_cols = array(
			'mime' => 'parameters2',
		);

		$this->_select = $this->select()
			->from($this->_name, $_cols, $this->_schema)
			->where('property = ?', 'background');
		$result = $this->fetchRow($this->_select);
		if (count($result) > 0) {
			$x = $result->toArray();
			return $x['mime'];
		}
	}

	public function convertBmpToGD($src, $dest = false) {

		if(!($src_f = fopen($src, "rb"))) {
			return false;
		}
		if(!($dest_f = fopen($dest, "wb"))) {
			return false;
		}
		$header = unpack("vtype/Vsize/v2reserved/Voffset", fread($src_f,14));
		$info = unpack("Vsize/Vwidth/Vheight/vplanes/vbits/Vcompression/Vimagesize/Vxres/Vyres/Vncolor/Vimportant",fread($src_f, 40));

		if($header['type'] != 0x4D42) {	 // signature "BM"
			return false;
		}

		$palette_size = $header['offset'] - 54;
		$ncolor = $palette_size / 4;
		$gd_header = "";
		// true-color vs. palette
		$gd_header .= ($palette_size == 0) ? "\xFF\xFE" : "\xFF\xFF";
		$gd_header .= pack("n2", $info['width'], $info['height']);
		$gd_header .= ($palette_size == 0) ? "\x01" : "\x00";
		if($palette_size) {
			$gd_header .= pack("n", $ncolor);
		}

		// no transparency
		$gd_header .= "\xFF\xFF\xFF\xFF";

		fwrite($dest_f, $gd_header);
		$tmpImageString = $gd_header;

		if($palette_size) {
			$palette = fread($src_f, $palette_size);
			$gd_palette = "";
			$j = 0;
			while($j < $palette_size) {
				$b = $palette{$j++};
				$g = $palette{$j++};
				$r = $palette{$j++};
				$a = $palette{$j++};
				$gd_palette .= "$r$g$b$a";
			}
			$gd_palette .= str_repeat("\x00\x00\x00\x00", 256 - $ncolor);
			fwrite($dest_f, $gd_palette);
			$tmpImageString .= $gd_palette;
		}

		$scan_line_size = (($info['bits'] * $info['width']) + 7) >> 3;
		$scan_line_align = ($scan_line_size & 0x03) ? 4 - ($scan_line_size & 0x03) : 0;

		for($i = 0, $l = $info['height'] - 1; $i < $info['height']; $i++, $l--) {
			// BMP stores scan lines starting from bottom
			fseek($src_f, $header['offset'] + (($scan_line_size + $scan_line_align) * $l));
			$scan_line = fread($src_f, $scan_line_size);
			if($info['bits'] == 24) {
				$gd_scan_line = "";
				$j = 0;
				while($j < $scan_line_size) {
					$b = $scan_line{$j++};
					$g = $scan_line{$j++};
					$r = $scan_line{$j++};
					$gd_scan_line .= "\x00$r$g$b";
				}
			} else if($info['bits'] == 8) {
				$gd_scan_line = $scan_line;
			} else if($info['bits'] == 4) {
				$gd_scan_line = "";
				$j = 0;
				while($j < $scan_line_size) {
					$byte = ord($scan_line{$j++});
					$p1 = chr($byte >> 4);
					$p2 = chr($byte & 0x0F);
					$gd_scan_line .= "$p1$p2";
				}
				$gd_scan_line = substr($gd_scan_line, 0, $info['width']);
			} else if($info['bits'] == 1) {
				$gd_scan_line = "";
				$j = 0;
				while($j < $scan_line_size) {
					$byte = ord($scan_line{$j++});
					$p1 = chr((int) (($byte & 0x80) != 0));
					$p2 = chr((int) (($byte & 0x40) != 0));
					$p3 = chr((int) (($byte & 0x20) != 0));
					$p4 = chr((int) (($byte & 0x10) != 0));
					$p5 = chr((int) (($byte & 0x08) != 0));
					$p6 = chr((int) (($byte & 0x04) != 0));
					$p7 = chr((int) (($byte & 0x02) != 0));
					$p8 = chr((int) (($byte & 0x01) != 0));
					$gd_scan_line .= "$p1$p2$p3$p4$p5$p6$p7$p8";
				}
				$gd_scan_line = substr($gd_scan_line, 0, $info['width']);
			}

			fwrite($dest_f, $gd_scan_line);
			$tmpImageString .= $gd_scan_line;
		}

		fclose($src_f);
		unlink($src);
		fclose($dest_f);
		return true;
	}

	public function imageCreateFromBmp($filename) {
		$tmp_name = tempnam("/tmp", "GD");
		if($this->convertBmpToGD($filename, $tmp_name)) {
			$img = imagecreatefromgd($tmp_name);
			$dir = realpath(APPLICATION_PATH . '/../scripts');
			$file = "wallpaper";
			$filePath = $dir . '/' . $file;
			imagejpeg($img, $filePath);
			unlink($tmp_name);
			return true;
		}
		return false;
	}

	public function getFilePath()
	{
		return self::$filePath;
	}
}
