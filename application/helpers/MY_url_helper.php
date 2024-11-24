<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('npm_url'))
{
	function npm_url($uri)
	{
		return base_url("node_modules/$uri");
	}
}

if ( ! function_exists('lib_url'))
{
	function lib_url($uri)
	{
		return base_url("public/lib/$uri");
	}
}

if ( ! function_exists('bower_url'))
{
	function bower_url($uri)
	{
		return base_url("bower_components/$uri");
	}
}

if ( ! function_exists('glob_recursive'))
{
   function glob_recursive($pattern, $flags = 0)
   {
		$files = glob($pattern, $flags);

		foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
		{
			$files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
		}

		return $files;
  }
}

if ( ! function_exists('include_spa_styles'))
{
	function include_spa_styles()
	{
		$files = array();

		foreach (glob_recursive('spa/*.css') as $filename) {
			if (strpos($filename, '~') === FALSE) {
				$files[] = base_url($filename);
			}
		}

		echo '<link rel="stylesheet" href="' . implode('"><link rel="stylesheet" href="', $files) . '">';
	}
}

if ( ! function_exists('include_spa_scripts'))
{
	function include_spa_scripts()
	{
		$files = array(
			base_url('spa/main.js')
		);

		foreach (glob_recursive('spa/*.js') as $filename) {
			if (strpos($filename, '~') === FALSE AND $filename !== 'spa/main.js') {
				$files[] = base_url($filename);
			}
		}

		echo '<script src="' . implode('"></script><script src="', $files) . '"></script>';
	}
}
