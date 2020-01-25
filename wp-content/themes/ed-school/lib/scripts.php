<?php

/**
 * Enqueue scripts and stylesheets
 */

add_action( 'wp_enqueue_scripts', 'ed_school_scripts', 100 );
add_action( 'wp_enqueue_scripts', 'ed_school_add_compiled_style', 999 );
add_action( 'wp_head', 'ed_school_set_js_global_var' );

function ed_school_scripts() {
	// styles
	wp_enqueue_style( 'groundwork-grid', get_template_directory_uri() . '/assets/css/groundwork-responsive.css', false );
	wp_enqueue_style( 'font-awesome', get_template_directory_uri() . '/assets/css/font-awesome.min.css', false );
	wp_enqueue_style( 'js_composer_front' );
	wp_enqueue_style( 'ed-school-theme-icons', get_template_directory_uri() . '/assets/css/theme-icons.css', false );
	wp_enqueue_style( 'ed-school-style', get_stylesheet_uri(), false );

	// inline styles
	wp_add_inline_style( 'ed-school-style', ed_school_responsive_menu_scripts() );


	if ( ed_school_get_option( 'is-rtl', false ) ) {
		wp_enqueue_style( 'ed_school_rtl', get_template_directory_uri() . '/assets/css/rtl.css', false );
	}

	// scripts
	if ( is_single() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	wp_enqueue_script( 'modernizr', get_template_directory_uri() . '/assets/js/vendor/modernizr-2.7.0.min.js', array(), null, false );
	wp_enqueue_script( 'ed-school-plugins', get_template_directory_uri() . '/assets/js/wheels-plugins.min.js', array( 'jquery' ), null, true );
	wp_enqueue_script( 'ed-school-scripts', get_template_directory_uri() . '/assets/js/wheels-main.min.js', array( 'jquery' ), null, true );

}

if ( ! function_exists( 'ed_school_add_compiled_style' ) ) {

	function ed_school_add_compiled_style() {
		$upload_dir = wp_upload_dir();

		$opt_name = ED_SCHOOL_THEME_OPTION_NAME;

		if ( file_exists( $upload_dir['basedir'] . '/' . $opt_name . '_style.css' ) ) {
			$upload_url = $upload_dir['baseurl'];
			if ( strpos( $upload_url, 'https' ) !== false ) {
				$upload_url = str_replace( 'https:', '', $upload_url );
			} else {
				$upload_url = str_replace( 'http:', '', $upload_url );
			}
			wp_enqueue_style( $opt_name . '_style', $upload_url . '/' . $opt_name . '_style.css', false );
		} else {
			wp_enqueue_style( $opt_name . '_style', get_template_directory_uri() . '/assets/css/wheels_options_style.css', false );
		}


		wp_add_inline_style( $opt_name . '_style', ed_school_custom_css() );
		wp_add_inline_style( $opt_name . '_style', ed_school_add_layout_blocks_css() );

	}
}

function ed_school_set_js_global_var() {

	$settings = array(
		'siteName' => get_bloginfo( 'name', 'display' ),
		'data'     => array(
			'useScrollToTop'                    => filter_var( ed_school_get_option( 'use-scroll-to-top', false ), FILTER_VALIDATE_BOOLEAN ),
			'useStickyMenu'                     => filter_var( ed_school_get_option( 'main-menu-use-menu-is-sticky', true ), FILTER_VALIDATE_BOOLEAN ),
			'scrollToTopText'                   => ed_school_get_option( 'scroll-to-top-text', '' ),
			'isAdminBarShowing'                 => is_admin_bar_showing() ? true : false,
			'initialWaypointScrollCompensation' => ed_school_get_option( 'main-menu-initial-waypoint-compensation', 120 ),
			'preloaderSpinner'                  => (int) ed_school_get_option( 'preloader', 0 ),
			'preloaderBgColor'                  => ed_school_get_option( 'preloader-bg-color', '#304ffe' ),

		)
	);

	?>
	<script>
		var wheels = wheels || <?php echo json_encode($settings); ?>;
	</script>
<?php
}
