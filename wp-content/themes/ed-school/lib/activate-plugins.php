<?php

/**
 * Include the TGM_Plugin_Activation class.
 */
require_once get_template_directory() . '/lib/class-tgm-plugin-activation.php';

add_action('tgmpa_register', 'ed_school_register_required_plugins');

/**
 * Register the required plugins for this theme.
 *
 * In this example, we register two plugins - one included with the TGMPA library
 * and one from the .org repo.
 *
 * The variable passed to tgmpa_register_plugins() should be an array of plugin
 * arrays.
 *
 * This function is hooked into tgmpa_init, which is fired within the
 * TGM_Plugin_Activation class constructor.
 */
function ed_school_register_required_plugins() {

    /**
     * Array of plugin arrays. Required keys are name and slug.
     * If the source is NOT from the .org repo, then source is also required.
     */
    $plugins = array(
        // Include a plugin pre-packaged with a theme
        array(
            'name'               => esc_html__( 'Ed School Plugin', 'ed-school' ), // The plugin name
            'slug'               => 'ed-school-plugin', // The plugin slug (typically the folder name)
            'source'             => get_template_directory() . '/extensions/ed-school-plugin.zip', // The plugin source
            'required'           => true, // If false, the plugin is only 'recommended' instead of required
            'version'            => '1.2.3', // .g. 1.0.0. If set, the active plugin must be this version or higher, otherwise a notice is presented
            'force_activation'   => false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch
            'force_deactivation' => false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins
            'external_url'       => '', // If set, overrides default API URL and points to an external URL
        ),
	    array(
		    'name'               => esc_html__( 'WPBakery Visual Composer', 'ed-school' ), // The plugin name
		    'slug'               => 'js_composer', // The plugin slug (typically the folder name)
		    'source'             => get_template_directory() . '/extensions/js_composer.zip', // The plugin source
		    'required'           => true, // If false, the plugin is only 'recommended' instead of required
		    'version'            => '5.4.4', // E.g. 1.0.0. If set, the active plugin must be this version or higher, otherwise a notice is presented
		    'force_activation'   => false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch
		    'force_deactivation' => false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins
		    'external_url'       => '', // If set, overrides default API URL and points to an external URL
	    ),
	    array(
            'name'               => esc_html__( 'Revolution Slider', 'ed-school' ), // The plugin name
            'slug'               => 'revslider', // The plugin slug (typically the folder name)
            'source'             => get_template_directory() . '/extensions/revslider.zip', // The plugin source
            'required'           => false, // If false, the plugin is only 'recommended' instead of required
            'version'            => '5.4.6.3.1', // E.g. 1.0.0. If set, the active plugin must be this version or higher, otherwise a notice is presented
            'force_activation'   => false, // If true, plugin is activated upon theme activation and cannot be deactivated until theme switch
            'force_deactivation' => false, // If true, plugin is deactivated upon theme switch, useful for theme-specific plugins
            'external_url'       => '', // If set, overrides default API URL and points to an external URL
        ),
        // include a plugins from the WordPress Plugin Repository
        array(
            'name'     => esc_html__( 'Meta Box', 'ed-school' ),
            'slug'     => 'meta-box',
            'required' => true,
        ),
	    array(
            'name'     => esc_html__( 'Redux Framework', 'ed-school' ),
            'slug'     => 'redux-framework',
            'required' => true,
        ),
	    array(
	        'name'     => esc_html__( 'Contact Form 7', 'ed-school' ),
            'slug'     => 'contact-form-7',
            'required' => false,
        ),
	    array(
		    'name'     => 'The Events Calendar',
		    'slug'     => 'the-events-calendar',
		    'required' => false,
	    ),
	    array(
		    'name'     => 'Testimonial Rotator',
		    'slug'     => 'testimonial-rotator',
		    'required' => false,
	    ),
	    array(
		    'name'     => esc_html__( 'Optimize Image', 'ed-school' ),
		    'slug'     => 'optimize-images-resizing',
		    'required' => false,
	    ),
	    array(
		    'name' => 'Envato Market',
		    'slug' => 'envato-market',
		    'source' => 'https://envato.github.io/wp-envato-market/dist/envato-market.zip',
		    'required' => true,
		    'recommended' => true,
	    ),
    );

	// messages
	$messages = array(
		esc_html__( 'If you are not able to complete plugin installation process due to server issues please install the plugins manually. All required plugins are located in "extensions" folder in your main download from Themeforest.', 'ed-school' ),
		sprintf( esc_html__( 'After you finish installing plugins go back to %s page to complete the installation.', 'ed-school' ), '<a href="' . admin_url( 'themes.php?page=theme_activation_options' ) . '" title="' . esc_html__( 'Theme Activation', 'ed-school' ) . '">' . esc_html__( 'Theme Activation', 'ed-school' ) . '</a>' ),
	);
	$final_message = '';
	foreach ( $messages as $message ) {
		$final_message .= sprintf( '<div class="updated fade"><p>%s</p></div>', $message );
	}


	/**
     * Array of configuration settings. Amend each line as needed.
     * If you want the default strings to be available under your own theme domain,
     * leave the strings uncommented.
     * Some of the strings are added into a sprintf, so see the comments at the
     * end of each line for what each argument will be.
     */
    $config = array(
        'domain'           => 'ed-school', // Text domain - likely want to be the same as your theme.
        'default_path'     => '', // Default absolute path to pre-packaged plugins
        'menu'             => 'tgmpa-install-plugins', // Menu slug.
		'parent_slug'      => 'themes.php',
        'has_notices'      => true, // Show admin notices or not
        'is_automatic'     => false, // Automatically activate plugins after installation or not
        'message'          => $final_message, // Message to output right before the plugins table

    );

    tgmpa($plugins, $config);
}
