<?php
/**
 * Theme activation
 */
if ( is_admin() && isset( $_GET['activated'] ) && 'themes.php' == $GLOBALS['pagenow'] ) {
	wp_redirect( admin_url( 'themes.php?page=theme_activation_options' ) );
	exit;
}
add_action( 'admin_menu', 'ed_school_theme_activation_options_add_page', 50 );
add_action( 'admin_init', 'ed_school_import_data', 11 );

function ed_school_theme_activation_options_add_page() {
	add_theme_page( esc_html__( 'Theme Activation', 'ed-school' ), esc_html__( 'Theme Activation', 'ed-school' ), 'edit_theme_options', 'theme_activation_options', 'ed_school_theme_activation_options_render_page' );
}

function ed_school_import_data() {


	if ( isset( $_POST['wheels-demo-data'] ) ) {
		if ( check_admin_referer( 'wheels-demo-data-nonce' ) ) {

			require_once get_template_directory() . '/lib/demo-importer/Wheels_Import_Manager.php';
			$import_manager = new Wheels_Import_Manager();

			/**
			 * Import Theme Options
			 */
			if ( isset( $_REQUEST['theme_options'] ) && $_REQUEST['theme_options'] != '' ) {
				$theme_options_filename = 'theme-options/' . $_REQUEST['theme_options'] . '.json';
				$import_manager->import_theme_options( $theme_options_filename );
			}

			/**
			 * Import Widgets
			 */
			if ( isset( $_REQUEST['import_widgets'] ) && $_REQUEST['import_widgets'] === 'true' ) {
				$delete_current_widgets = false;
				if ( $_REQUEST['delete_current_widgets'] === 'true' ) {
					$delete_current_widgets = false;
				}
				$import_manager->import_widgets( 'widgets.json', $delete_current_widgets );
			}
			/**
			 * Set Static Front Page
			 */
			if ( isset( $_REQUEST['static_front_page'] ) && $_REQUEST['static_front_page'] != '' ) {

				$static_front_page_id = $_REQUEST['static_front_page'];

				update_option( 'show_on_front', 'page' );
				update_option( 'page_on_front', $static_front_page_id );

				$home_menu_order = array(
					'ID'         => $static_front_page_id,
					'menu_order' => - 1
				);
				wp_update_post( $home_menu_order );
			}
			/**
			 * Set Static Posts Page
			 */
			if ( isset( $_REQUEST['static_posts_page'] ) && $_REQUEST['static_posts_page'] != '' ) {
				update_option( 'page_for_posts', $_REQUEST['static_posts_page'] );
			}
			/**
			 * Change Permalink Structure
			 */
			if ( isset( $_REQUEST['change_permalink_structure'] ) && $_REQUEST['change_permalink_structure'] === 'true' ) {

				if ( get_option( 'permalink_structure' ) !== '/%postname%/' ) {
					global $wp_rewrite;
					$wp_rewrite->set_permalink_structure( '/%postname%/' );
					flush_rewrite_rules();
				}
			}

		}
	}

}

function ed_school_theme_activation_options_render_page() {

	$theme = wp_get_theme();
	if ( $theme->parent_theme ) {
		$template_dir = basename( get_template_directory() );
		$theme        = wp_get_theme( $template_dir );
	}
	$theme_version = $theme->get( 'Version' );
	$theme_name    = $theme->get( 'Name' );


	if (class_exists('PT_License_Activator')) {
		$licenseActivator = new PT_License_Activator('aislin_theme_petal', $theme_version);
		$licenseActivator->get_form();
	}


	?>
	<div class="wrap">
		<h2><?php printf( esc_html__( '%s Theme Activation', 'ed-school' ), wp_get_theme() ); ?></h2>
		<p><?php esc_html_e( 'These videos cover installation and update process.', 'ed-school' ); ?></p>

		<p>
			<a style="margin-right: 20px;" target="_blank" href="https://www.youtube.com/watch?v=uQAZf1GRFro"><img
					src="<?php echo get_template_directory_uri() . '/assets/img/theme-installation-video-thumb.png' ?>"
					alt=""/></a>
			<a target="_blank" href="https://www.youtube.com/watch?v=B7U2PFvz_eo"><img
					src="<?php echo get_template_directory_uri() . '/assets/img/theme-update-video-thumb.png' ?>"
					alt=""/></a>
		</p>
		<br/>
		<hr/>
		<h3><?php esc_html_e( 'Update Instructions', 'ed-school' ); ?></h3>

		<p>
			<?php esc_html_e( 'If you are updating the theme, please watch the video on the right.', 'ed-school' ); ?>
		</p>
		<hr/>
		<h3><?php esc_html_e( 'Installation Steps', 'ed-school' ); ?></h3>
		<h4>
			<em><?php esc_html_e( 'These settings are optional and should usually be used only on a fresh installation.', 'ed-school' ); ?></em>
		</h4>
		<ol>
			<li>
				<p><strong><?php esc_html_e( 'Install required plugins', 'ed-school' ); ?></strong></p>

				<p><?php esc_html_e( 'First, enable required plugins. After you finish plugin installation return to this page to complete the installation process. Please note that WooCommerce is not required and if not installed demo products will not be imported', 'ed-school' ); ?></p>
				<a href="<?php echo admin_url( 'themes.php?page=tgmpa-install-plugins&plugin_status=install' ); ?>"><?php esc_html_e( 'Install required plugins', 'ed-school' ); ?></a>
			</li>
			<li>
				<p><strong><?php esc_html_e( 'Import demo content', 'ed-school' ); ?></strong></p>

				<p><?php esc_html_e( 'Proceed only after all plugins are installed', 'ed-school' ); ?></p>
				<a href="<?php echo admin_url( 'import.php?import=wordpress' ); ?>"><?php esc_html_e( 'Go to WordPress Importer', 'ed-school' ); ?></a>
			</li>
			<li>
				<p><strong><?php esc_html_e( 'Save Menus', 'ed-school' ); ?></strong></p>
				<a href="<?php echo admin_url( 'nav-menus.php' ); ?>"><?php esc_html_e( 'Go to WordPress Menus', 'ed-school' ); ?></a>
			</li>
			<li>
				<p><strong><?php esc_html_e( 'Select Front and Posts page', 'ed-school' ); ?></strong></p>
				<a href="<?php echo admin_url( 'options-reading.php' ); ?>"><?php esc_html_e( 'Go to WordPress Reading Settings', 'ed-school' ); ?></a>
			</li>
			<li>
				<p><strong><?php esc_html_e( 'Import demo sliders', 'ed-school' ); ?></strong></p>
				<?php if ( is_plugin_active( 'revslider/revslider.php' ) ): ?>
					<a href="<?php echo admin_url( 'admin.php?page=revslider' ); ?>"><?php esc_html_e( 'Go to Revolution Slider Importer', 'ed-school' ); ?></a>
				<?php else: ?>
					<?php esc_html_e( 'In order to import demo sliders you need to install and activate Revolution Slider plugin', 'ed-school' ); ?>
				<?php endif; ?>
			</li>
		</ol>
		<br>
		<hr>
		<br>

		 <form method="post" action="<?php echo esc_url( $_SERVER['REQUEST_URI'] ); ?>"> 

			<input type="hidden" name="wheels-demo-data" value="1">
			<?php wp_nonce_field( 'wheels-demo-data-nonce' ); ?>
			<table class="form-table">


				<tr valign="top">
					<th scope="row"><?php esc_html_e( 'Import Theme Options', 'ed-school' ); ?></th>
					<td>
						<fieldset>
							<select name="theme_options" id="">
								<option value="">Select Variation</option>
								<option value="default">Default</option>
							</select>
						</fieldset>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><?php esc_html_e( 'Sidebar widgets', 'ed-school' ); ?></th>
					<td>
						<fieldset>
							<label for="import_widgets">Import?</label>
							<input type="hidden" name="import_widgets" value="false"/>
							<input id="import_widgets" type="checkbox" name="import_widgets" value="true"/>

							<label for="delete_current_widgets">Delete current widgets?</label>
							<input type="hidden" name="delete_current_widgets" value="false"/>
							<input id="delete_current_widgets" type="checkbox" name="delete_current_widgets"
							       value="true"/>
						</fieldset>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
		<br/>
		<hr/>
		<br/>

		<h2><?php esc_html_e( 'Important!', 'ed-school' ); ?></h2>
		<h4><?php printf( esc_attr( 'To use %s Theme, you must be running:', 'ed-school' ), $theme_name ); ?></h4>
		<ul style="list-style:circle;margin:10px 40px 13px;">
			<li><?php esc_html_e( 'WordPress 3.1 or higher', 'ed-school' ); ?></li>
			<li><?php esc_html_e( 'PHP5.4 or higher', 'ed-school' ); ?></li>
			<li><?php esc_html_e( 'and mysql 5 or higher', 'ed-school' ); ?></li>
		</ul>
		<h4>
			<?php esc_html_e( 'Many issues that you may run into such as: white screen, demo content fails when importing and other similar issues are all related to low PHP configuration limits. The solution is to increase the PHP limits. You can do this on your own, or contact your web host and ask them to increase those limits to a minimum as follows:', 'ed-school' ); ?>
		</h4>
		<ul style="list-style:circle;margin:10px 40px 13px;">
			<li><?php esc_html_e( 'max_execution_time 180', 'ed-school' ); ?></li>
			<li><?php esc_html_e( 'memory_limit 128M', 'ed-school' ); ?></li>
			<li><?php esc_html_e( 'post_max_size 32M', 'ed-school' ); ?></li>
			<li><?php esc_html_e( 'upload_max_filesize 32M', 'ed-school' ); ?></li>
		</ul>
		<h4><?php esc_html_e( 'We have tested it with Mac, Windows and Linux. Below is a list of items you should ensure your host can comply with:', 'ed-school' ); ?></h4>
		<ul style="list-style:circle;margin:10px 40px 13px;">
			<li><?php esc_html_e( 'Check to ensure that your web host has the minimum requirements to run WordPress.', 'ed-school' ); ?></li>
			<li><?php esc_html_e( 'Always make sure they are running the latest version of WordPress.', 'ed-school' ); ?></li>
			<li><?php printf( esc_attr( 'You can download the latest release of WordPress from official %s website.', 'ed-school' ), '<a href="https://wordpress.org/" target="_blank">WordPress</a>' ); ?></li>
			<li><?php esc_html_e( 'Always create secure passwords for FTP and Database.', 'ed-school' ); ?></li>
		</ul>
		<?php esc_html_e( 'Visual Composer and Layer Slider plugins are included with the theme but you do not get purchase codes for these plugins.', 'ed-school' ); ?>
		</h4>
		<p>
			<?php esc_html_e( 'That means that automatic updates for the plugins will not be available to you unless you buy a regular license for the plugin. We do not recommend that you buy regular licenses for the plugins because they will be updated with theme updates.', 'ed-school' ); ?>
		</p>
		<br/>
		<?php if ( is_plugin_active( 'woocommerce/woocommerce.php' ) ) : ?>
			<br/>
			<p>
				<a href="<?php echo admin_url( 'admin.php?page=wc-status' ); ?>"><?php esc_html_e( 'Check System Status page', 'ed-school' ); ?></a>
			</p>
		<?php endif; ?>
		<hr/>
		<h4>
			<?php printf( esc_attr( 'In case you need support contact us %s.', 'ed-school' ), '<a href="http://themeforest.net/user/aislin#contact" target="_blank">here</a>' ); ?></p>
		</h4>
		<h4>
			<?php printf( esc_attr( 'Please make sure to include your puchase code in the email. Here is how to obtain the %s.', 'ed-school' ), '<a href="https://help.market.envato.com/hc/en-us/articles/202822600-Where-can-I-find-my-Purchase-Code-" target="_blank">purchase code</a>' ); ?></p>
		</h4>
		<br/>
		<hr/>
		<br/>
	</div>
<?php
}
