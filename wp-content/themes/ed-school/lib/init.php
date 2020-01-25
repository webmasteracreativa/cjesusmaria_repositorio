<?php

add_action( 'after_setup_theme', 'ed_school_setup' );
add_action( 'widgets_init', 'ed_school_widgets_init' );

add_action('admin_head', 'ed_school_custom_fonts');

function ed_school_custom_fonts() {
	echo '<style>
    .redux-notice {
        display: none;
    }
  </style>';
}


if ( ! function_exists( 'ed_school_setup' ) ) {

	function ed_school_setup() {

		add_filter('ed_school_alt_buttons', 'ed_school_add_to_alt_button_list');

		// Make theme available for translation
		load_theme_textdomain( 'ed-school', get_template_directory() . '/languages' );

		// Register wp_nav_menu() menus (http://codex.wordpress.org/Function_Reference/register_nav_menus)
		register_nav_menus( array(
			'primary_navigation' => esc_html__( 'Primary Navigation', 'ed-school' ),
		) );
		register_nav_menus( array(
			'secondary_navigation' => esc_html__( 'Secondary Navigation', 'ed-school' ),
		) );
		register_nav_menus( array(
			'mobile_navigation' => esc_html__( 'Mobile Navigation', 'ed-school' ),
		) );
		register_nav_menus( array(
			'quick_sidebar_navigation' => esc_html__( 'Quick Sidebar Navigation', 'ed-school' ),
		) );
		register_nav_menus( array(
			'custom_navigation_1' => esc_html__( 'Custom Navigation 1', 'ed-school' ),
		) );
		register_nav_menus( array(
			'custom_navigation_2' => esc_html__( 'Custom Navigation 2', 'ed-school' ),
		) );
		register_nav_menus( array(
			'custom_navigation_3' => esc_html__( 'Custom Navigation 3', 'ed-school' ),
		) );

		// Add post thumbnails (http://codex.wordpress.org/Post_Thumbnails)
		add_theme_support( 'post-thumbnails' );
		set_post_thumbnail_size( 150, 150, false );

		add_image_size( 'ed-school-featured-image', 895, 430, true );
		add_image_size( 'ed-school-medium', 768, 510, true );
		add_image_size( 'ed-school-medium-alt', 768, 410, true );
		add_image_size( 'ed-school-square', 768, 768, true );

		// Add post formats (http://codex.wordpress.org/Post_Formats)
		add_theme_support( 'post-formats', array(
			'aside',
			'gallery',
			'link',
			'image',
			'quote',
			'status',
			'video',
			'audio',
			'chat'
		) );
		add_theme_support( 'automatic-feed-links' );

		ed_school_register_custom_thumbnail_sizes();
	}
}

function ed_school_widgets_init() {

	register_sidebar( array(
		'name'          => esc_html__( 'Primary', 'ed-school' ),
		'id'            => 'wheels-sidebar-primary',
		'before_widget' => '<div class="widget %1$s %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5 class="widget-title">',
		'after_title'   => '</h5>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Child Pages', 'ed-school' ),
		'id'            => 'wheels-sidebar-child-pages',
		'before_widget' => '<div class="widget %1$s %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5 class="widget-title">',
		'after_title'   => '</h5>',
	) );

}

function ed_school_add_to_alt_button_list($alt_button_arr) {

	$alt_button_arr[] = '.yith-wcwl-add-button a';

	return $alt_button_arr;

}


// Please don't forgot to change filters tag.
// It must start from your theme's name.
add_filter('edschool_theme_setup_wizard_username', 'edschool_set_theme_setup_wizard_username', 10);
if( ! function_exists('edschool_set_theme_setup_wizard_username') ){
	function edschool_set_theme_setup_wizard_username($username){
		return 'aislin';
	}
}

add_filter('edschool_theme_setup_wizard_oauth_script', 'edschool_set_theme_setup_wizard_oauth_script', 10);
if( ! function_exists('edschool_set_theme_setup_wizard_oauth_script') ){
	function edschool_set_theme_setup_wizard_oauth_script($oauth_url){
		return 'http://aislinthemes.com/api/server-script.php';
	}
}
