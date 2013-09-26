<?php

class Utils {
	public function includeMainPageJS() {
		drupal_add_library('system', 'ui.dialog');

		drupal_add_css(drupal_get_path('module', 'vijo') .'/css/vijo.main.css');
		drupal_add_js(drupal_get_path('module', 'vijo') .'/javascript/lib/vijo.nddb.js');

		drupal_add_js(drupal_get_path('module', 'vijo') .'/javascript/vijo.text.js');
		drupal_add_js(drupal_get_path('module', 'vijo') .'/javascript/vijo.main.js');
		drupal_add_js(drupal_get_path('module', 'vijo') .'/javascript/vijo.api.js');
	}
}