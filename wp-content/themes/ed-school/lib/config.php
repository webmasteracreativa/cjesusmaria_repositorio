<?php
/**
 * Configuration values
 */
define( 'ED_SCHOOL_THEME_OPTION_NAME', 'ed_school_options' );
define( 'ED_SCHOOL_THEME_NAME', 'ed-school' );
// Length in words for excerpt_length filter (http://codex.wordpress.org/Plugin_API/Filter_Reference/excerpt_length)
// This is just theme default value - it is overridden from theme options
define( 'POST_EXCERPT_LENGTH', 40 );

add_theme_support( 'title-tag' );

/**
 * Enable theme features
 */

/**
 * $content_width is a global variable used by WordPress for max image upload sizes
 * and media embeds (in pixels).
 *
 * Example: If the content area is 640px wide, set $content_width = 620; so images and videos will not overflow.
 * Default: 1140px is the default Bootstrap container width.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 1200;
}


/**
 * Woocommerce Support Declaration
 */
add_theme_support( 'woocommerce' );

/**
 * Force Visual Composer to initialize as "built into the theme". This will hide certain tabs under the Settings->Visual Composer page
 */
add_action( 'vc_before_init', 'ed_school_vc_set_as_theme' );
function ed_school_vc_set_as_theme() {
	vc_set_as_theme(true);
	if(defined('WPB_VC_VERSION')){
		$_COOKIE['vchideactivationmsg_vc11'] = WPB_VC_VERSION;
	}
}

/**
 * Layer Slider
 */
add_action('layerslider_ready', 'ed_school_layerslider_overrides');
function ed_school_layerslider_overrides() {
	// Disable auto-updates
	$GLOBALS['lsAutoUpdateBox'] = false;
	update_option('layerslider-authorized-site', true);
}


add_action('after_theme_setup', 'ed_school_rev_slider_overrides') ;
function ed_school_rev_slider_overrides() {

	if ( function_exists('set_revslider_as_theme') && ! defined('REV_SLIDER_AS_THEME')) {
		
		define('REV_SLIDER_AS_THEME', true);
		set_revslider_as_theme();
	}
}

/**
 * Mega Menus
 */
add_action('msm_filter_use_redux', 'ed_school_remove_msm_redux');
function ed_school_remove_msm_redux() {
	return false;
}

