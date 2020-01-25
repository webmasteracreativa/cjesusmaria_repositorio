<?php
/*
Plugin Name: Gestión Alumnas
Plugin URI: http://www.daladierlopez.com/plugins
Description: This plugin allows you to display images on a responsive grid or carousel. It's perfect to display files, partners, sponsors or any other group of elements that requires this type of layout.
Author: Daladier López
Version: 1.7
Author URI: http://www.daladierlopez.com
*/

// Last modified: April 13th 2016

// Next Edits:
// translation files
// Layers Integration

// Last Edits:
// edit to image size override option to allow thumb sizes
// grayscale css code updated
// added new option for description&title display
// added custom parameters for url
// carousel bug fix
// fixed bug - default settings creation
// added isotope filter
// improved filter scripts
// added logos widget icon (for layersWP)
// bug fixes in widget
// visual composer integration
// added option to set custom wrapper css class
// added ability to set a custom url for the image
// added ability to add individual padding and margin values for each image
// added custom js field in the settings
// carousel css fix
// fontawesome version updated
// added quick edit fields



add_filter( 'pts_post_type_filter', "pts_disable");
function pts_disable( $args ) {
    $postType  = get_post_type();
    if( 'lshowcase' === $postType ){
        $args = array(
          'name' => 'lshowcase'
        );
    }
    return $args;
}

// ordering code
require_once dirname(__FILE__) . '/ordering-code.php';

// shortcode generator page
require_once dirname(__FILE__) . '/shortcode-generator.php';

// widget code
require_once dirname(__FILE__) . '/widget-code.php';


//count for multiple pager layouts in same page

$lshowcase_slider_count = 0;
$lshowcase_slider_array = array();

// Adding the necessary actions to initiate the plugin

add_action( 'init', 'register_cpt_lshowcase' );
add_action( 'admin_init', 'register_lshowcase_settings' );
//add_action( 'do_meta_boxes', 'lshowcase_image_box' ); 
add_action( 'admin_menu', 'lshowcase_shortcode_page_add' );
add_action( 'admin_menu', 'lshowcase_admin_page' );
add_filter( 'manage_posts_columns', 'lshowcase_columns_head' );
add_action( 'manage_posts_custom_column', 'lshowcase_columns_content', 10, 2 );

// Add support for post-thumbnails in case theme does not

add_action( 'init', 'lshowcase_add_thumbnails_for_cpt' );

function lshowcase_add_thumbnails_for_cpt()
{
	global $_wp_theme_features;
	if (isset($_wp_theme_features['post-thumbnails']) && $_wp_theme_features['post-thumbnails'] == 1) {
		return;
	}

	if (isset($_wp_theme_features['post-thumbnails'][0]) && is_array($_wp_theme_features['post-thumbnails'][0]) && count($_wp_theme_features['post-thumbnails'][0]) >= 1) {
		array_push($_wp_theme_features['post-thumbnails'][0], 'lshowcase' );
		return;
	}

	if (empty($_wp_theme_features['post-thumbnails'])) {
		$_wp_theme_features['post-thumbnails'] = array(
			array(
				'lshowcase'
			)
		);
		return;
	}
}

// Add New Thumbnail Size

$lshowcase_crop = false;
$lshowcase_options = get_option( 'lshowcase-settings' );

if ($lshowcase_options['lshowcase_thumb_crop'] == "true" ) {
	$lshowcase_crop = true;
}

add_image_size( 'lshowcase-thumb', $lshowcase_options['lshowcase_thumb_width'], $lshowcase_options['lshowcase_thumb_height'], $lshowcase_crop);


// register the custom post type for the logos showcase

function register_cpt_lshowcase()
{

	$options = get_option('lshowcase-settings');
	if(!is_array($options)) {
			lshowcase_defaults();
			$options = get_option('lshowcase-settings');
		}


	$name = $options['lshowcase_name_singular'];
	$nameplural = $options['lshowcase_name_plural'];
	$labels = array(
		'name' => _x($nameplural, 'lshowcase' ) ,
		'singular_name' => _x($name, 'lshowcase' ) ,
		'add_new' => _x( 'Añadir ' . $name, 'lshowcase' ) ,
		'add_new_item' => _x( 'Añadir ' . $name, 'lshowcase' ) ,
		'edit_item' => _x( 'Editar ' . $name, 'lshowcase' ) ,
		'new_item' => _x( 'Nueva ' . $name, 'lshowcase' ) ,
		'view_item' => _x( 'Ver ' . $name, 'lshowcase' ) ,
		'search_items' => _x( 'Buscar ' . $nameplural, 'lshowcase' ) ,
		'not_found' => _x( 'No encontrada ' . $nameplural . ' found', 'lshowcase' ) ,
		'not_found_in_trash' => _x( 'No encontrada ' . $nameplural . ' found in Trash', 'lshowcase' ) ,
		'parent_item_colon' => _x( 'Padre ' . $name . ':', 'lshowcase' ) ,
		'menu_name' => _x($nameplural, 'lshowcase' ) ,
	);
	$args = array(
		'labels' => $labels,
		'hierarchical' => false,
		'supports' => array(
    'title',
    'thumbnail',
    'custom-fields',
    'page-attributes'
		) ,
		'public' => false,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => true,
		'publicly_queryable' => false,
		'exclude_from_search' => true,
		'has_archive' => true,
		'query_var' => true,
		'can_export' => true,
		'rewrite' => true,
		'capability_type' => 'post',
		'menu_icon' => plugins_url( 'images/icon16.png', __FILE__) ,
		//'menu_position' => 53
	);
	register_post_type( 'lshowcase', $args);
}

// register custom category
// WP Menu Categories

add_action( 'init', 'lshowcase_build_taxonomies', 0);

function lshowcase_build_taxonomies()
{
	register_taxonomy( 'lshowcase-categories', 'lshowcase', array(
		'hierarchical' => true,
		'label' => 'Categorías',
		'query_var' => true,
		'rewrite' => true
	));
}

// move featured image box to top
//currently disabled - moved all metabox processing to same function lshowcase_add_custom_metabox
function lshowcase_image_box()
{

	$options = get_option( 'lshowcase-settings' );
	$name = $options['lshowcase_name_singular'];

	remove_meta_box( 'postimagediv', 'lshowcase', 'side' );
	add_meta_box( 'postimagediv', $name.' '.__( 'Image' ) , 'post_thumbnail_meta_box', 'lshowcase', 'normal', 'high' );
}

// change Title Info

function lshowcase_change_default_title($title)
{
	$screen = get_current_screen();
	$options = get_option( 'lshowcase-settings' );
	$name = $options['lshowcase_name_singular'];
	$nameplural = $options['lshowcase_name_plural'];
	if ( isset($screen->post_type) && 'lshowcase' == $screen->post_type) {
		$title = 'Ingrese el nombre de la ' . $name . ' aquí';
	}

	return $title;
}

add_filter( 'enter_title_here', 'lshowcase_change_default_title' );

function lshowcase_wps_translation_mangler($translation, $text, $domain)
{
	global $post;
	if (isset($post) && is_object($post)) {
		if ('lshowcase' == $post->post_type ) {
			$translations =  get_translations_for_domain($domain);
			if ($text == 'Publish' ) {
				return $translations->translate( 'Publicar' );
			}
		}
	}

	return $translation;
}

add_filter( 'gettext', 'lshowcase_wps_translation_mangler', 10, 4);

// Order by menu_order in the ADMIN screen

function lshowcase_admin_order($wp_query)
{
	if (is_post_type_archive( 'lshowcase' ) && is_admin()) {
		if (!isset($_GET['orderby'])) {
			$wp_query->set( 'orderby', 'menu_order' );
			$wp_query->set( 'order', 'ASC' );
		}
	}
}

// This will default the ordering admin to the 'menu_order' - will disable other ordering options

add_filter( 'pre_get_posts', 'lshowcase_admin_order' );

// to dispay all entries in admin

function lshowcase_posts_per_page_admin($wp_query) {
  if (is_post_type_archive( 'lshowcase' ) && is_admin() ) {    
		  $wp_query->set( 'posts_per_page', '30' );	
  	}
}

//This will the filter above to display all entries in the admin page
add_filter('pre_get_posts', 'lshowcase_posts_per_page_admin');



/*
* Display the padding & margin metabox
*/


function lshowcase_spacing_custom_metabox()
{
	global $post;

	$padding_top = get_post_meta($post->ID, '_lsptop', true);
	$padding_bottom = get_post_meta($post->ID, '_lspbottom', true);
	$padding_left = get_post_meta($post->ID, '_lspleft', true);
	$padding_right = get_post_meta($post->ID, '_lspright', true);
	$margin_top = get_post_meta($post->ID, '_lsmtop', true);
	$margin_bottom = get_post_meta($post->ID, '_lsmbottom', true);
	$margin_left = get_post_meta($post->ID, '_lsmleft', true);
	$margin_right = get_post_meta($post->ID, '_lsmright', true);
	$percentage = get_post_meta($post->ID, '_lspercentage', true);


 ?>
<table id="lshowcase_admin_table_spacing">	

	<tr>
		<td> <strong><?php echo __('Porcentaje de ancho máximo','lshowcase'); ?></strong>
		</td>
		<td> &nbsp;
		</td>
		<td> <strong><?php echo __('Relleno','lshowcase'); ?></strong>
		</td>
		<td> Top
		</td>
		<td> Right
		</td>
		<td> Bottom
		</td>
		<td> Left
		</td>
		<td> &nbsp;
		</td>
		<td> <strong><?php echo __('Margen','lshowcase'); ?></strong>
		</td>
		<td> Top
		</td>
		<td> Right
		</td>
		<td> Bottom
		</td>
		<td> Left
		</td>
		
		

	</tr>

	<tr>
		<td> <input id="_lspercentage" name="_lspercentage" type="text" value="<?php
					if ($percentage) {
						echo $percentage;
					} ?>" /> %
		</td>
		<td> 
		</td>
		<td> 
		</td>
		<td> <input id="_lsptop" name="_lsptop" type="text" value="<?php
					if ($padding_top) {
						echo $padding_top;
					} ?>" />
		</td>
		<td> <input id="_lspright" name="_lspright" type="text" value="<?php
					if ($padding_right) {
						echo $padding_right;
					} ?>" />
		</td>
		<td> <input id="_lspbottom" name="_lspbottom" type="text" value="<?php
					if ($padding_bottom) {
						echo $padding_bottom;
					} ?>" />
		</td>
		<td> <input id="_lspleft" name="_lspleft" type="text" value="<?php
					if ($padding_left) {
						echo $padding_left;
					} ?>" />
		</td>
		<td> &nbsp;
		</td>
		<td> 
		</td>
		<td> <input id="_lsmtop" name="_lsmtop" type="text" value="<?php
					if ($margin_top) {
						echo $margin_top;
					} ?>" />
		</td>
		<td> <input id="_lsmright" name="_lsmright" type="text" value="<?php
					if ($margin_right) {
						echo $margin_right;
					} ?>" />
		</td>
		<td> <input id="_lsmbottom" name="_lsmbottom" type="text" value="<?php
					if ($margin_bottom) {
						echo $margin_bottom;
					} ?>" />
		</td>
		<td> <input id="_lsmleft" name="_lsmleft" type="text" value="<?php
					if ($margin_left) {
						echo $margin_left;
					} ?>" />
		</td>
		
		
	</tr>
	<tr>
		<td colspan="13">
			<span class="howto"><?php echo __('Use estos campos para agregar valores de espaciado personalizados a esta imagen. No te olvides de usar la unidad, como 10px o 1.1em.','lshowcase'); ?>
		</td>
	</tr>

</table>
<?php
}

/**
 * Display the URL metabox
 */

function lshowcase_url_custom_metabox()
{
	global $post;
	$urllink = get_post_meta($post->ID, 'urllink', true);
	$urldesc = get_post_meta($post->ID, 'urldesc', true);

	if ($urllink != "" && !preg_match( "/http(s?):\/\//", $urllink)) {
		$errors = 'URL no válida';
		$urllink = 'http://';
	}

	// output invlid url message and add the http:// to the input field

	if (isset($errors)) {
		echo $errors;
	} ?>

	<table id="lshowcase_admin_table">
		
		<thead>
			<tr>
				<th><?php echo __('URL:','lshowcase'); ?></th>
				<th><?php echo __('Grado de alumna:','lshowcase'); ?></th>
			<tr>
		</thead>
		<tbody>
			<tr>
				<td class="left" style="width:50%;"> 
					<label class="screen-reader-text" for="siteurl"><?php echo __('URL','lshowcase'); ?></label>
					<input style="width:100%;" id="siteurl" name="siteurl" type="url" value="<?php
					if ($urllink) {
						echo $urllink;
					} ?>" />

				</td>
				<td style="width:50%;"> 
					<label class="screen-reader-text" for="urldesc"><?php echo __('Descripción','lshowcase'); ?></label>
					<textarea style="width:100%;" id="urldesc" rows="2" cols="25" name="urldesc" ><?php
					if ($urldesc) {
						echo $urldesc;
					} else {
            echo 'Grado: ';
          } ?>
					</textarea>
				</td>
			</tr>
			<tr>
				<td class="left"> 
					<span class="howto"><?php echo __('Enlace del documento añadido a la biblioteca de medios'); ?></span>
				</td>
				<td> 
					<span class="howto"><?php echo __('Descripción. Por defecto aparece la palabra Grado, seguido ingrese el grado.'); ?></span>
				</td>
			</tr>
		</tbody>
	</table>


<?php
}


function lshowcase_image_url_custom_metabox()
{
	global $post;
	$customlink = get_post_meta($post->ID, '_lscustomimageurl', true);
	?>

	<table id="lshowcase_admin_table">
		<thead>
			<tr>
				<th><?php echo __('URL de la imagen:','lshowcase'); ?></th>
			<tr>
		</thead>
		<tbody>
			<tr>
				<td> 
					<label class="screen-reader-text" for="siteurl"><?php echo __('URL','lshowcase'); ?></label>
					<input style="width:100%;" id="_lscustomimageurl" name="_lscustomimageurl" type="url" value="<?php
					if ($customlink) {
						echo $customlink;
					} ?>" />
				</td>
			</tr>
			<tr>
				<td> 
					<span class="howto"><?php echo _('Si no desea utilizar una imagen de su galería multimedia, puede establecer una URL para su imagen aquí.'); ?></span>
				</td>
			</tr>
		</tbody>
	</table>


<?php
}

function lshowcase_url_params_custom_metabox()
{
	global $post;
	$customparam = htmlentities(get_post_meta($post->ID, '_lsurlparams', true));

	?>

	<table id="lshowcase_admin_table">
		
		<thead>
			<tr>
				<th><?php echo __('Parámetros de URL:','lshowcase'); ?></th>
			<tr>
		</thead>
		<tbody>
			<tr>
				<td> 
					<label class="screen-reader-text" for="siteurl"><?php echo __('Parámetros de URL','lshowcase'); ?></label>
					<input style="width:100%;" id="_lsurlparams" name="_lsurlparams" type="text" value="<?php
					if ($customparam) {
						echo $customparam;
					} ?>" />

				</td>
			</tr>
			<tr>
				<td> 
					<span class="howto"><?php echo _('Puede escribir aquí cualquier parámetro personalizado adicional que desee que tenga su URL. Target y nofollow se pueden controlar en el código breve, pero aquí puede incluir clases o estilos personalizados. Ejemplo: style="cursor:move" class="lightbox-class" '); ?></span>
				</td>
			</tr>
		</tbody>
	</table>


<?php
}

/**
 * Process the custom metabox fields
 */

function lshowcase_save_custom_url($post_id)
{
	global $post;
	if (isset($post)) {
		if ($post->post_type == 'lshowcase' ) {
			if ($_POST) {
				update_post_meta($post->ID, 'urllink', $_POST['siteurl']);
				update_post_meta($post->ID, 'urldesc', $_POST['urldesc']);
				update_post_meta($post->ID, '_lsptop', $_POST['_lsptop']);
				update_post_meta($post->ID, '_lspbottom', $_POST['_lspbottom']);
				update_post_meta($post->ID, '_lspleft', $_POST['_lspleft']);
				update_post_meta($post->ID, '_lspright', $_POST['_lspright']);
				update_post_meta($post->ID, '_lsmtop', $_POST['_lsmtop']);
				update_post_meta($post->ID, '_lsmbottom', $_POST['_lsmbottom']);
				update_post_meta($post->ID, '_lsmleft', $_POST['_lsmleft']);
				update_post_meta($post->ID, '_lsmright', $_POST['_lsmright']);
				update_post_meta($post->ID, '_lspercentage', $_POST['_lspercentage']);
				update_post_meta($post->ID, '_lscustomimageurl', $_POST['_lscustomimageurl']);
				update_post_meta($post->ID, '_lsurlparams', $_POST['_lsurlparams']);

			}
		}
	}
}

// Add action hooks. Without these we are lost

add_action( 'do_meta_boxes', 'lshowcase_add_custom_metabox' );
add_action( 'save_post', 'lshowcase_save_custom_url' );
/**
 * Add meta box
 */

function lshowcase_add_custom_metabox()
{

	//lshowcase_image_box
	$options = get_option( 'lshowcase-settings' );
	$name = $options['lshowcase_name_singular'];

	remove_meta_box( 'postimagediv', 'lshowcase', 'side' );
	add_meta_box( 'postimagediv', $name.' '.__( 'Image' ) , 'post_thumbnail_meta_box', 'lshowcase', 'normal', 'high' );


	add_meta_box( 'lshowcase-custom-metabox', __( 'URL &amp; Description' ) , 'lshowcase_url_custom_metabox', 'lshowcase', 'normal', 'high' );
	add_meta_box( 'lshowcase-custom-metabox-spacing', __( 'Custom Spacing' ) , 'lshowcase_spacing_custom_metabox', 'lshowcase', 'normal', 'high' );
	add_meta_box( 'lshowcase-custom-metabox-url', __( 'Custom Image URL' ) , 'lshowcase_image_url_custom_metabox', 'lshowcase', 'normal', 'high' );
	add_meta_box( 'lshowcase-custom-metabox-url-params', __( 'Custom URL parameters' ) , 'lshowcase_url_params_custom_metabox', 'lshowcase', 'normal', 'high' );

}

/**
 * Get and return the values for the URL and description
 */

function lshowcase_get_url_desc_box()
{
	global $post;
	$urllink = get_post_meta($post->ID, 'urllink', true);
	$urldesc = get_post_meta($post->ID, 'urldesc', true);
	return array(
		$urllink,
		$urldesc
	);
}

// get the array of data
// $urlbox = get_url_desc_box();
// echo $urlbox[0]; // echo out the url of a post
// echo $urlbox[1]; // echo out the url description of a post


// add options page

function lshowcase_admin_page()
{

	$menu_slug = 'edit.php?post_type=lshowcase';
	$submenu_page_title = 'Configuración';
	$submenu_title = 'Configuración';
	$capability = 'manage_options';
	$submenu_slug = 'lshowcase_settings';
	$submenu_function = 'lshowcase_settings_page';
	$defaultp = add_submenu_page($menu_slug, $submenu_page_title, $submenu_title, $capability, $submenu_slug, $submenu_function);
}

// options page build

function lshowcase_settings_page()
{
?>
    <div class="wrap">
<h2>Configuración</h2>
    <?php
	if (isset($_GET['settings-updated']) && $_GET['settings-updated'] == "true" ) {
		$msg = "Configuración Actualizada";
		lshowcase_message($msg);
	} ?>
	<form method="post" action="options.php" id="dsform">
    <?php
	settings_fields( 'lshowcase-plugin-settings' );
	$options = get_option( 'lshowcase-settings' );
?>
    <table width="70%" border="0" cellspacing="5" cellpadding="5">
  <tr>
    <td colspan="3"><h2>Nombre de elementos</h2></td>
    </tr>
  <tr>
    <td align="right">Nombre singular:</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_name_singular]" value="<?php
	echo $options['lshowcase_name_singular']; ?>" /></td>
    <td rowspan="2" valign="top"><p class="howto">¿Cómo quieres llamar a esta función?</p>
      <p class="howto">Solo para fines administrativos.</p></td>
  </tr>
  <tr>
    <td align="right">Nombre plural:</td>
    <td>    <input type="text" name="lshowcase-settings[lshowcase_name_plural]" value="<?php
	echo $options['lshowcase_name_plural']; ?>" />
</td>
    </tr>
  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="3"><h2>Configuración de tamaño de imagen</h2></td>
    </tr>
  <tr>
    <td align="right">Width</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_thumb_width]" value="<?php
	echo $options['lshowcase_thumb_width']; ?>" /></td>
    <td rowspan="3" valign="top"><span class="howto">Este será el tamaño de las imágenes. Cuando se cargan, seguirán esta configuración. Si cambia esta configuración después de que se cargue la imagen, se mostrará escalada.</span></td>
  </tr>
  <tr>
    <td align="right">Height</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_thumb_height]" value="<?php
	echo $options['lshowcase_thumb_height']; ?>" /></td>
    </tr>
  <tr>
    <td align="right">Crop</td>
    <td><select name="lshowcase-settings[lshowcase_thumb_crop]">
      <option value="true" <?php
	selected($options['lshowcase_thumb_crop'], 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($options['lshowcase_thumb_crop'], 'false' ); ?>>No</option>
    </select></td>
    </tr>
  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="3"><h2>Configuración predeterminada del carrusel</h2></td>
    </tr>
  <tr>
    <td align="right" nowrap>Auto Scroll</td>
    <td><select name="lshowcase-settings[lshowcase_carousel_autoscroll]">
      <option value="true"  <?php
	selected($options['lshowcase_carousel_autoscroll'], 'true' ); ?>>Si - Auto Scroll con Pausa</option>
      <option value="ticker"  <?php
	selected($options['lshowcase_carousel_autoscroll'], 'ticker' ); ?>>Si - Auto Scroll no se detiene</option>
      <option value="false" <?php
	selected($options['lshowcase_carousel_autoscroll'], 'false' ); ?>>No</option>
    </select></td>
    <td><span class="howto">Los elementos pasarán automáticamente.</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Tiempo de pausa</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_carousel_pause]" value="<?php
	echo $options['lshowcase_carousel_pause']; ?>" /></td>
    <td><span class="howto">La cantidad de tiempo (en ms) entre cada transición automática (si Desplazamiento automático con pausa está activado).</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Pausar en Hover</td>
    <td><select name="lshowcase-settings[lshowcase_carousel_autohover]">
      <option value="true" <?php
	selected($options['lshowcase_carousel_autohover'], 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($options['lshowcase_carousel_autohover'], 'false' ); ?>>No</option>
    </select></td>
    <td><span class="howto">El desplazamiento automático se pausará cuando el mouse pase sobre el control deslizante.</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Controles</td>
    <td><select name="lshowcase-settings[lshowcase_carousel_autocontrols]">
      <option value="true" <?php
	selected($options['lshowcase_carousel_autocontrols'], 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($options['lshowcase_carousel_autocontrols'], 'false' ); ?>>No</option>
    </select></td>
    <td><span class="howto">Si está activo, se agregarán controles de "Iniciar" / "Parar" (No funciona para Auto Scroll Non Stop).</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Velocidad de la transición:</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_carousel_speed]" value="<?php
	echo $options['lshowcase_carousel_speed']; ?>" /></td>
    <td><span class="howto">Deslice la duración de la transición (en ms - entero).</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Margen de imagen:</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_carousel_slideMargin]" value="<?php
	echo $options['lshowcase_carousel_slideMargin']; ?>" /></td>
    <td><span class="howto">Margen entre cada imagen (entero)</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Loop infinito:</td>
    <td><select name="lshowcase-settings[lshowcase_carousel_infiniteLoop]">
      <option value="true" <?php
	selected($options['lshowcase_carousel_infiniteLoop'], 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($options['lshowcase_carousel_infiniteLoop'], 'false' ); ?>>No</option>
    </select></td>
    <td><span class="howto">Si está Activo, haciendo clic en "Siguiente" mientras está en el último elemento pasará al primer elemento y viceversa.</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Mostrar paginación:</td>
    <td><select name="lshowcase-settings[lshowcase_carousel_pager]">
      <option value="true" <?php
	selected($options['lshowcase_carousel_pager'], 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($options['lshowcase_carousel_pager'], 'false' ); ?>>No</option>
    </select></td>
    <td><span class="howto">Si está activo, se agregará una paginación. (No funciona para Auto Scroll Non Stop).</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Mostrar controles:</td>
    <td><select name="lshowcase-settings[lshowcase_carousel_controls]">
      <option value="true" <?php
	selected($options['lshowcase_carousel_controls'], 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($options['lshowcase_carousel_controls'], 'false' ); ?>>No</option>
    </select></td>
    <td><span class="howto">Si se activan los controles de imagen Activo, "Siguiente" / "Anterior", se agregarán. (No funciona para Auto Scroll Non Stop).</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Número minimo de elementos:</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_carousel_minSlides]" value="<?php
	echo $options['lshowcase_carousel_minSlides']; ?>" /></td>
    <td><span class="howto">El número mínimo de elementos que se mostrarán.</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Número máximo de elementos:</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_carousel_maxSlides]" value="<?php
	echo $options['lshowcase_carousel_maxSlides']; ?>" /></td>
    <td><span class="howto">El número máximo de elementos que se mostrarán. (Coloque 0 para permitir que el script calcule el número máximo de elementos que se ajustan a la ventana gráfica) </span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Número de elementos para mover:</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_carousel_moveSlides]" value="<?php
	echo $options['lshowcase_carousel_moveSlides']; ?>" /></td>
    <td><span class="howto">La cantidad de elementos para avanzar en la transición. Si es cero, se usará la cantidad de diapositivas totalmente visibles.</span></td>
  </tr>

  

  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="3"><h2>Ajustes avanzados</h2></td>
    </tr>
 
   <tr>
    <td align="right" valign="top" nowrap>CSS personalizado:</td>
    <td><textarea rows="6" columns="10" name="lshowcase-settings[lshowcase_css]"><?php
	if(isset($options['lshowcase_css'])) { echo $options['lshowcase_css']; }  ?></textarea></td>
    <td><span class="howto">Coloque aquí cualquier CSS personalizado que desee mostrar junto con el diseño del Grid. Por ejemplo, puede orientar el texto debajo de los logotipos si está activo, usando el siguiente CSS:
 <br>.lshowcase-description { color:#333; font-weight:bold; }
    </span></td>
  </tr>
   <tr>
    <td align="right" valign="top" nowrap>JS personalizado:</td>
    <td><textarea rows="6" columns="10" name="lshowcase-settings[lshowcase_js]"><?php
	if(isset($options['lshowcase_js'])) { echo $options['lshowcase_js']; }  ?></textarea></td>
    <td><span class="howto">Coloque aquí cualquier javascript personalizado que desee mostrar junto con el diseño del Grid. 
    </span></td>
  </tr>
  <tr>
    <td align="right" nowrap>URL de Imagen por Defecto:</td>
    <td><input type="text" name="lshowcase-settings[lshowcase_default_image]" value="<?php
	if(isset($options['lshowcase_default_image'])) { echo $options['lshowcase_default_image']; }  ?>" /></td>
    <td><span class="howto">Si desea que las entradas del logotipo sin imagen muestren una imagen predeterminada, coloque la URL aquí.</span></td>
  </tr>
  <tr>
    <td align="right" nowrap>Modo de transición del carrusel:</td>
    <td>

    <?php
    $mode = isset($options['lshowcase_carousel_mode']) ? $options['lshowcase_carousel_mode'] : 'horizontal';
    ?>

	<select name="lshowcase-settings[lshowcase_carousel_mode]">
      <option value="horizontal"  <?php
	selected($mode, 'horizontal' ); ?>>Horizontal</option>
      <option value="vertical"  <?php
	selected($mode, 'vertical' ); ?>>Vertical</option>
      <option value="fade"  <?php
	selected($mode, 'fade' ); ?>>Fade</option>
    </select>

</td>
    <td><span class="howto">Opciones disponibles: 'horizontal', 'vertical' y 'fundido'. El modo 'fundido' y 'vertical' solo mostrará una diapositiva a la vez, ignorando las configuraciones de diapositivas mínimas y máximas anteriores. El carrusel de desplazamiento automático sin paradas no funcionará en modo 'fade'. Esto afectará a todos los carruseles.</span></td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  
 </table>

    
    
	<input type="submit" class="button-primary" value="<?php
	_e( 'Guardar cambios' ) ?>" />
</form>
<?php
}

// register settings

function register_lshowcase_settings()
{
	register_setting( 'lshowcase-plugin-settings', 'lshowcase-settings' );
}

// register default values

register_activation_hook(__FILE__, 'lshowcase_defaults' );

function lshowcase_defaults()
{
	$tmp = get_option( 'lshowcase-settings' );

	// check for settings version

	if ((!is_array($tmp)) || !isset($tmp['lshowcase_carousel_autoscroll'])) {
		delete_option( 'lshowcase-settings' );
		$arr = array(
			"lshowcase_name_singular" => "Logo",
			"lshowcase_name_plural" => "Logos",
			"lshowcase_thumb_width" => "200",
			"lshowcase_thumb_height" => "200",
			"lshowcase_thumb_crop" => "false",
			"lshowcase_carousel_autoscroll" => "false",
			"lshowcase_carousel_pause" => "4000",
			"lshowcase_carousel_autohover" => "false",
			"lshowcase_carousel_autocontrols" => "false",
			"lshowcase_carousel_speed" => "500",
			"lshowcase_carousel_slideMargin" => "10",
			"lshowcase_carousel_infiniteLoop" => "true",
			"lshowcase_carousel_pager" => "false",
			"lshowcase_carousel_controls" => "true",
			"lshowcase_carousel_minSlides" => "1",
			"lshowcase_carousel_maxSlides" => "0",
			"lshowcase_carousel_moveSlides" => "1",
			"lshowcase_carousel_mode" => "horizontal",
			"lshowcase_css" => "",
			"lshowcase_js" => "",
			"lshowcase_default_image" => "",
			"lshowcase_capability_type_settings" => "manage_options",
			"lshowcase_capability_type_manage" => "manage_options",
			"lshowcase_empty" => "2",
		);
		update_option( 'lshowcase-settings', $arr);
	}
}

// To Show styled messages

function lshowcase_message($msg)
{ ?>
  <div id="message" class="l_updated"><p><?php
	echo $msg; ?></p></div>
<?php
}

// Add new column

function lshowcase_columns_head($defaults)
{
	global $post;
	if (isset($post->post_type) && 'lshowcase' == $post->post_type) {
  		$defaults['lshowcase-categories'] = __('Categoría','lshowcase');
		$defaults['featured_image'] = __('Imagen','lshowcase');
		$defaults['urldesc'] = __('Descripción','lshowcase');
		$defaults['urllink'] = __('URL','lshowcase');
	}
	return $defaults;
}

// SHOW THE FEATURED IMAGE in admin

function lshowcase_columns_content($column_name, $post_ID)
{
	global $post;
	if ($post->post_type == 'lshowcase' ) {
		if($column_name == 'lshowcase-categories') {
	      $term_list = wp_get_post_terms($post_ID, 'lshowcase-categories', array("fields" => "names"));
	      foreach ( $term_list as $term ) {
	        echo $term.'<br>';
	        }
	     }

		if($column_name == 'urldesc') {
	       echo get_post_meta( $post_ID , 'urldesc' , true );
	     }

	     if($column_name == 'urllink') {
	       echo get_post_meta( $post_ID , 'urllink' , true );
	     }

		if ($column_name == 'featured_image' ) {
			$image = wp_get_attachment_image_src(get_post_thumbnail_id($post_ID) , 'thumbnail');
			if($image != false) {

				$file_info = pathinfo($image[0]);
				if($file_info['extension'] == 'svg') {

					$lshowcase_options = get_option( 'lshowcase-settings' );
					$opt_w = $lshowcase_options['lshowcase_thumb_width'];
					$opt_h = $lshowcase_options['lshowcase_thumb_height'];
					$svg_w = 80;
					$svg_h = (80*$opt_h)/$opt_w;

					echo '<img src="'.$image[0].'" width="'.$svg_w.'" height="'.$svg_h.'">';

				} else {

					echo get_the_post_thumbnail(
						$post_ID, array(
						80,
						80
					));

				}


			} 

			$cimage = get_post_meta( $post_ID , '_lscustomimageurl' , true );
			if($image==false &&  $cimage != '') {

				echo '<img src="'.$cimage.'" width="80">';

			}
			
		}
	}
}

// Shortcode
// Add shortcode functionality

add_shortcode( 'show-logos', 'shortcode_lshowcase' );
add_filter( 'widget_text', 'do_shortcode' );
add_filter( 'the_excerpt', 'do_shortcode' );

function shortcode_lshowcase($atts)
{


	if (!is_array($atts)) { 


	    $s_settings = get_option( 'lshowcase_shortcode', '' );
	    if($s_settings!='') {
	      $html = do_shortcode(stripslashes($s_settings));
	    }

	    else {

	      $html = "<!-- Empty Logos Showcase Container: No arguments or no saved shortcode -->";

	    }


   } else {


	$orderby = (array_key_exists( 'orderby', $atts) ? $atts['orderby'] : "menu_order" );
	$category = (array_key_exists( 'category', $atts) ? $atts['category'] : "0" );
	$style = (array_key_exists( 'style', $atts) ? $atts['style'] : "normal" );
	$interface = (array_key_exists( 'interface', $atts) ? $atts['interface'] : "grid" );
	$activeurl = (array_key_exists( 'activeurl', $atts) ? $atts['activeurl'] : "inactive" );
	$tooltip = (array_key_exists( 'tooltip', $atts) ? $atts['tooltip'] : "false" );
	$description = (array_key_exists( 'description', $atts) ? $atts['description'] : "false" );
	$limit = (array_key_exists( 'limit', $atts) ? $atts['limit'] : 0);
	$slidersettings = (array_key_exists( 'carousel', $atts) ? $atts['carousel'] : "");
	$img = (array_key_exists( 'img', $atts) ? $atts['img'] : 0);
	$filter = (array_key_exists( 'filter', $atts) ? $atts['filter'] : 'false');
	$class = (array_key_exists('class',$atts) ? $atts['class'] : '');

	//not part of the shortcode generator, but can be used to filter ids:
	$ids = (array_key_exists( 'ids', $atts) ? $atts['ids'] : "0" );

	$html = build_lshowcase($orderby, $category, $activeurl, $style, $interface, $tooltip, $description, $limit, $slidersettings,$img,$ids,$filter,$class);
	


   }

return $html;

}



/*
*
* /////////////////////////////
* FUNCTION TO DISPLAY THE LOGOS
* /////////////////////////////
*
*/

function build_lshowcase($order = "menu_order", $category = "", $activeurl = "new", $style = "normal", $interface = "grid", $tooltip = "false", $description = "false", $limit = - 1, $slidersettings="", $imgwo=0, $ids="0", $filter="false", $custom_class='')
{



	global $lshowcase_slider_count;
	global $post;

	add_action('wp_footer', 'lshowcase_custom_css',99);

	//will be used to include carousel code before tooltip code.
	$carousel = false;

	$html = "";

	//image size override
	$imgwidth = "";

	if($imgwo!=""){

		if(strpos($imgwo, ',')!=false) { $imgwidth = explode(',',$imgwo); }
		if(strpos($imgwo, ',')==false) { $imgwidth = $imgwo; }
		
		}


	

	if($custom_class!='') {
		$html .= '<div class="'.$custom_class.'">';
	}

	//if there's a filter active:
	if($filter!='false' && $interface != 'hcarousel') {
		$html .= lshowcase_build_filter($filter, $category);
	}
	


	
	$thumbsize = "lshowcase-thumb";
	$class = "lshowcase-thumb";
	$divwrap = "lshowcase-wrap-normal";
	$divwrapextra = "";
	$divboxclass = "lshowcase-box-normal";
	$divboxinnerclass = "lshowcase-boxInner-normal";
	if ($order == 'none' ) {
		$order = 'menu_order';
	};
	if ($interface != "grid" && $interface != "hcarousel" && $interface != "vcarousel" ) {
		$columncount = substr($interface, 4);
		$divboxclass = "lshowcase-wrap-responsive";
		$divboxinnerclass = "lshowcase-boxInner";
		$divwrap = "lshowcase-box-" . $columncount;
	}

	if ($interface == "hcarousel" ) {

		$options = get_option( 'lshowcase-settings' );
		$mode = isset($options['lshowcase_carousel_mode']) ? $options['lshowcase_carousel_mode'] : 'horizontal';


		$divwrapextra = "style='display:none;' class='lshowcase-wrap-carousel-".$lshowcase_slider_count."'";
		$class = "lshowcase-thumb";
		$divwrap = "lshowcase-wrap-normal";
		$divboxclass = "lshowcase-box-normal";
		$divboxinnerclass = "lshowcase-slide";
		$carousel = true;
		lshowcase_add_carousel_js();

		//if mode is horizontal we add extra call to control better css

		if($mode == 'horizontal') {

			$divboxinnerclass = "lshowcase-slide lshowcase-horizontal-slide";

		}

	}

	$stylearray = lshowcase_styles_array();
	$class = $stylearray[$style]["class"];

	if($style == 'jgrayscale') {

		lshowcase_add_grayscale_js();

	}

	//tooltip code
	if ($tooltip == 'true' || $tooltip == 'true-description' ) {
		$class.= " lshowcase-tooltip";

		lshowcase_add_tooltip_js($carousel);
	}

	$postsperpage = - 1;
	$nopaging = true;
	if ($limit >= 1) {
		$postsperpage = $limit;
		$nopaging = false;
	}

	$ascdesc = 'DESC';
	if ($order == 'name' || $order == 'title' || $order == 'menu_order' ) {
		$ascdesc = 'ASC';
	};
	$args = array(
		'post_type' => 'lshowcase',
		'lshowcase-categories' => $category,
		'orderby' => $order,
		'order' => $ascdesc,
		'posts_per_page' => $postsperpage,
		'nopaging' => $nopaging,
		'suppress_filters' => true
	);

	if($ids != '0' && $ids != '') {
		$postarray = explode(',', $ids);

	 	if($postarray[0]!='') {
		$args['post__in'] = $postarray;
		}
	} 


	$loop = new WP_Query($args);

	// to force random again - uncomment in case random is not working
	// if($order=='rand' ) {
	// shuffle( $loop->posts );
	// }

	if(!$loop->have_posts()) {

			return "<!-- Empty Logos Showcase Container -->";

		}


	$html.= '<div class="lshowcase-clear-both">&nbsp;</div>';
	$html.= '<div class="lshowcase-logos"><div ' . $divwrapextra . ' >';

	$lshowcase_options = get_option( 'lshowcase-settings' );

	while ($loop->have_posts()):
		
		$loop->the_post();

		//asign custom image url to a variable, to use later
		$custom_img_url = get_post_meta(get_the_ID() , '_lscustomimageurl', true);

		if (has_post_thumbnail() || $lshowcase_options['lshowcase_default_image'] != '' || $custom_img_url != ''):
		// if (1==1):

			//check if there is img overide settings
			if(is_array($imgwidth)) {
				$thumbsize = $imgwidth;	
			} 
			if($imgwidth!='') {
				$thumbsize = $imgwidth;	
			} 

			$width = '';
			$height = '';


			$image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID) , $thumbsize);
			
			
			$dwidth = $lshowcase_options['lshowcase_thumb_width'];
			$desc = get_post_meta(get_the_ID() , 'urldesc', true);

			if($image != false) {
				$width = $image[1];
				$height = " height = '".$image[2]."' ";
			}

		

			if($image == false && $custom_img_url != '') {
				$image = array();
				$image[0] = $custom_img_url; //url to image
				$image[1] = $lshowcase_options['lshowcase_thumb_width']; //image width
				$image[2] = $lshowcase_options['lshowcase_thumb_height']; //image height

				$width = $image[1];
				$height = "";

			}


			if($image == false && $custom_img_url == '' && $lshowcase_options['lshowcase_default_image'] != '') {
				$image = array();
				$image[0] = $lshowcase_options['lshowcase_default_image']; //url to image
				$image[1] = $lshowcase_options['lshowcase_thumb_width']; //image width
				$image[2] = $lshowcase_options['lshowcase_thumb_height']; //image height

				$width = $image[1];
				$height = "";

			}


			//to filter the quotes and make them html compatible
			$desc = str_replace("'", '&apos;', $desc);

			if(is_array($imgwidth)) {
				$dwidth = $thumbsize[0];
			}

			//if it's an SVG
			$file_info = pathinfo($image[0]);
			if(isset($file_info['extension']) && $file_info['extension'] == 'svg') {
				$width = $lshowcase_options['lshowcase_thumb_width'];
				$height = " height = '".$lshowcase_options['lshowcase_thumb_height']."' ";

				if(is_array($imgwidth)) {
				$width = $thumbsize[0];
				$height = " height = '".$thumbsize[1]."' ";
				}
			}

			//get categories to add as classes

			$cat = ' ';
			if($filter=='hide') { $cat = ' lshowcase-filter-active '; }
			if($filter=='enhance') { $cat = ' lshowcase-filter-enhance '; }
			if($filter=='isotope') { $cat = ' lshowcase-isotope '; }

		    $terms = get_the_terms( get_the_ID() , 'lshowcase-categories' );
		      if(is_array($terms)) {
		        foreach ( $terms as $term ) {
		        $cat .= 'ls-'.$term->slug.' ';
		        }
		      } 

			if ($interface != "hcarousel" ) {
				$html.= "<div class='" . $divwrap . $cat . "'>";
				$html.= '<div class="' . $divboxclass . '">';
				//$height = "";
			}

			if ($interface == "grid" ) {
				$html.= '<div class="' . $divboxinnerclass . '" style="width:' . $dwidth . 'px; align:center; text-align:center;">';
			}
			else {
				$html.= '<div class="' . $divboxinnerclass . '">';
			}

			$url = get_post_meta(get_the_ID() , 'urllink', true);

			//set default attributes for tooltip 
			if ($tooltip=="true") {
				$alt = $desc;
				$title = the_title_attribute( 'echo=0' );
			}

			//switch attributes to reflect on toolip
			if($tooltip=="true-description") {
				$title = $desc;
				$alt = the_title_attribute( 'echo=0' );
			}

			//if tooltip is off
			if($tooltip=="false") {
				$title = '';
				$alt = the_title_attribute( 'echo=0' );
			}		


			//try out flex div
			//$html .= '<div class="lshowcase-flexdiv">';

			//to display info above (not in shortcode generator)
			if ($description=="true-above" || $description=="true-description-above" || $description=="true-title-above-description-below") {
				$lsdesc = the_title_attribute( 'echo=0' );
				if($description=="true-description-above") { $lsdesc = $desc; }
				$html .= "<div class='lshowcase-description'>".nl2br($lsdesc)."</div>";
			}
			

			//inline styles form custom spacing options
			$inlinestyle = '';
				//image spacing values
				$percentage = get_post_meta(get_the_ID() , '_lspercentage', true);
				if($percentage!='') {
					$inlinestyle .= 'height:auto; max-width:'.$percentage.'%;';
				}
				$ptop = (get_post_meta(get_the_ID() , '_lsptop', true)!='') ? 'padding-top:'.get_post_meta(get_the_ID() , '_lsptop', true).';' : '';
				$pright = (get_post_meta(get_the_ID() , '_lspright', true)!='') ? 'padding-right:'.get_post_meta(get_the_ID() , '_lspright', true).';' : '';
				$pbottom = (get_post_meta(get_the_ID() , '_lspbottom', true)!='') ? 'padding-bottom:'.get_post_meta(get_the_ID() , '_lspbottom', true).';' : '';
				$pleft = (get_post_meta(get_the_ID() , '_lspleft', true)!='') ? 'padding-left:'.get_post_meta(get_the_ID() , '_lspleft', true).';' : '';
				$mtop = (get_post_meta(get_the_ID() , '_lsmtop', true)!='') ? 'margin-top:'.get_post_meta(get_the_ID(), '_lsmtop', true).';' : '';
				$mright = (get_post_meta(get_the_ID() , '_lsmright', true)!='') ? 'margin-right:'.get_post_meta(get_the_ID() , '_lsmright', true).';' : '';
				$mbottom = (get_post_meta(get_the_ID() , '_lsmbottom', true)!='') ? 'margin-bottom:'.get_post_meta(get_the_ID() , '_lsmbottom', true) .';': '';
				$mleft = (get_post_meta(get_the_ID() , '_lsmleft', true)!='') ? 'margin-left:'.get_post_meta(get_the_ID() , '_lsmleft', true).';' : '';
 				$time = '<p class="fecha_pub">Fecha de publicación: ';
  			$time .= get_post_time(
            'F j, Y g:i:s A',      // format
            FALSE,          // GMT
            get_the_ID(),  // Post ID
            TRUE           // translate, use date_i18n()
        );
  			$time .= '</p>';
 
				$inlinestyle .= $ptop.$pright.$pbottom.$pleft.$mtop.$mright.$mbottom.$mleft;



			$instyle = ($inlinestyle!='') ? "style='".$inlinestyle."'" : '';


			if ($activeurl != "inactive" && $url != "" ) {



				$target = "";
				if ($activeurl == "new" ) {
					$target = "target='_blank'";
				}

				if ($activeurl == "new_nofollow" ) {
					$target = "target='_blank' rel='nofollow'";
				}

				//to make some nofollow
				//include #nofollow in the end of the link
				/*
				if (strpos($url,'#nofollow') !== false) {
				   $target = "target='_blank' rel='nofollow'";
				    $url = str_replace('#nofollow', '', $url);
				}
				*/

				$custom_param = (get_post_meta(get_the_ID() , '_lsurlparams', true)!='') ? get_post_meta(get_the_ID() , '_lsurlparams', true) : '';

				$html.= "<a href='" . $url . "' " . $target . " ".$custom_param.">";
				$html.= "<img src='" . $image[0] . "' width='" . $width . "' ".$height." alt='" . $alt . "' title='" . $title . "' class='" . $class . "' ".$instyle." />";

				// $html .= get_the_post_thumbnail($post->ID,$thumbsize,array( 'class' => $class, 'alt'	=> $alt, 'title' => $title));

				$html.= "</a>";
			}
			else {

				$html.= "<img src='" . $image[0] . "' width='" . $width . "' ".$height." alt='" . $alt . "' title='" . $title . "' class='" . $class . "' ".$instyle." />";

				// $html .= get_the_post_thumbnail($post->ID,$thumbsize,array( 'class' => $class, 'alt'	=> $alt, 'title' => $title));

			}


			//to display info below
			if ($description=="true" || $description=="true-description" || $description=="true-title-above-description-below" || $description=="true-title-description-below") {
				$lsdesc = the_title_attribute( 'echo=0' );

				//to make it clickable
				if ($activeurl != "inactive" && $url != "" ) {
					//$lsdesc = "<a href='" . $url . "' " . $target . ">".$lsdesc."</a>";
				}

				if($description=="true-description" || $description=="true-title-above-description-below") { $lsdesc = $desc; }
				if($description=="true-title-description-below") { $lsdesc = '<div class="lstit">'.$lsdesc.'</div><div class="lsdesc">'.$desc.'</div>'; }
				

				$html .= "<div class='lshowcase-description'>".nl2br($lsdesc).$time."</div>";
			}

			//close flex div (contains image and eventually the description)
			//$html .= '</div>';
			

			if ($interface != "hcarousel" ) {
				$html.= "</div></div>";

			}

			$html.= "</div>";

			


		endif;
	endwhile;

	// Restore original Post Data

	wp_reset_postdata();
	$html.= '</div></div><div class="lshowcase-clear-both">&nbsp;</div>';

	//Add Carousel Code 
	if ( $interface == 'hcarousel') {

				lshowcase_bxslider_options_js($lshowcase_slider_count,$slidersettings,$dwidth);
				$lshowcase_slider_count++;
			
			}


	lshowcase_add_main_css();

	/* Display category used before logos grid */

	/* if($category!='') {

		$cat = get_term_by('slug', $category, 'lshowcase-categories');

		if(is_object($cat)) {

			$catname = $cat->name;
			$html = '<h2>'.$catname.'</h2>'.$html;
		
		}

	}

	*/

	if($custom_class!='') {
		$html .= '</div>';
	}

	return $html;
}

/* CSS enqueue functions */

function lshowcase_add_main_css()
{
	wp_deregister_style( 'lshowcase-main-style' );
	wp_register_style( 'lshowcase-main-style', plugins_url( '/styles.css', __FILE__) , array() , false, 'all');
	wp_enqueue_style( 'lshowcase-main-style' );
}

/* JS for grayscale with jQuery - not implemented */
function lshowcase_add_grayscale_js() {

	wp_deregister_script( 'lshowcase-jgrayscale' );
	wp_register_script( 'lshowcase-jgrayscale', plugins_url( '/js/grayscale.js', __FILE__) , array(
		'jquery'
	) , false, false);
	wp_enqueue_script( 'lshowcase-jgrayscale' );
}

add_action( 'admin_print_scripts-post-new.php', 'lshowcase_admin_styles', 11 );
add_action( 'admin_print_scripts-post.php', 'lshowcase_admin_styles', 11 ); 

function lshowcase_admin_styles() {
    global $post_type;
    if( 'lshowcase' == $post_type ) {
    	wp_deregister_style( 'lshowcase-admin-style' );
		wp_register_style( 'lshowcase-admin-style', plugins_url( 'css/admin.css', __FILE__) , array() , false, 'all');
		wp_enqueue_style( 'lshowcase-admin-style' );
    }
}

//we add the logos admin styles for the customizer, in case it contains widgets, it will display the correct icon
add_action('customize_register','lshowcase_admin_styles_custom', 11 );
function lshowcase_admin_styles_custom() {
    	wp_deregister_style( 'lshowcase-admin-style' );
		wp_register_style( 'lshowcase-admin-style', plugins_url( 'css/admin.css', __FILE__) , array() , false, 'all');
		wp_enqueue_style( 'lshowcase-admin-style' );
}

/*   JS for Slider */

function lshowcase_add_carousel_js()
{

	// wp_enqueue_script( 'jquery' );

	wp_deregister_script( 'lshowcase-bxslider' );
	wp_register_script( 'lshowcase-bxslider', plugins_url( '/bxslider/jquery.bxslider.min.js', __FILE__) , array(
		'jquery'
	) , false, true);
	wp_enqueue_script( 'lshowcase-bxslider' );
	wp_deregister_style( 'lshowcase-bxslider-style' );
	wp_register_style( 'lshowcase-bxslider-style', plugins_url( '/bxslider/jquery.bxslider.css', __FILE__) , array() , false, 'all');
	wp_enqueue_style( 'lshowcase-bxslider-style' );
	
}

function lshowcase_add_individual_carousel_js($sliderarray)
{

	

	wp_deregister_script( 'lshowcase-bxslider-individual' );
	wp_register_script( 'lshowcase-bxslider-individual', plugins_url( '/js/carousel.js', __FILE__) , array(
		'jquery',
		'lshowcase-bxslider'
	) , false, true);
	wp_enqueue_script( 'lshowcase-bxslider-individual' );

	wp_localize_script('lshowcase-bxslider-individual', 'lssliderparam', $sliderarray);
	
	
}

/* Tooltip Scripts */

function lshowcase_add_tooltip_js($slidertrue)
{

	//$array = array('jquery','jquery-ui-core');
	$array = array('ls-jquery-ui');

	if($slidertrue) {
		//$array = array('jquery','jquery-ui-core','lshowcase-bxslider-individual');
		$array = array('ls-jquery-ui','lshowcase-bxslider-individual');
	}

	wp_deregister_script( 'ls-jquery-ui' );
	wp_register_script( 'ls-jquery-ui', plugins_url( '/js/jquery-ui.min.js', __FILE__) , array(
		'jquery'
	) , false, false);
	wp_enqueue_script( 'ls-jquery-ui' );
	

	wp_deregister_script( 'lshowcase-tooltip' );
	wp_register_script( 'lshowcase-tooltip', plugins_url( '/js/tooltip.js', __FILE__) , $array , false, false);
	wp_enqueue_script( 'lshowcase-tooltip' );
}

/* Styles Function */
/* YOU CAN ADD NEW STYLES.
ADD ITEMS TO ARRAY
*/

function lshowcase_styles_array()
{
	$styles = array(
		"normal" => array(
			"class" => "lshowcase-normal",
			"description" => "Normal - Sin Styles",
		) ,
		"boxhighlight" => array(
			"class" => "lshowcase-boxhighlight",
			"description" => "Box Highlight en hover",
		) ,
		"grayscale" => array(
			"class" => "lshowcase-grayscale",
			"description" => "Siempre en escala de grises",
		) ,
		"hgrayscale" => array(
			"class" => "lshowcase-hover-grayscale",
			"description" => "Escala de grises y color en hover",
		),
		"hgrayscale2" => array(
			"class" => "lshowcase-grayscale-2",
			"description" => "Escala de grises y color en hover II",
		),
		
		// beta efecto
		"jgrayscale" => array(
			"class" => "lshowcase-jquery-gray",
			"description" => "Escala de grises Hover (Javascript - Beta)",
		),
		
		"opacity-enhance" => array(
			"class" => "lshowcase-opacity-enhance",
			"description" => "Opacidad completa en Hover",
		),
		"lower-opacity" => array(
			"class" => "lshowcase-lower-opacity",
			"description" => "Baja Opacidad en Hover",
		)
	);
	return $styles;
}


function lshowcase_bxslider_options_js($id, $slidersettings,$slidewidth)
{
	global $lshowcase_jquery_noconflict;
	global $lshowcase_slider_array;

	$mode = "'horizontal'";
	$options = get_option( 'lshowcase-settings' );
	if ($slidewidth=="" || $slidewidth == 0 || $slidewidth == '0') {
		$slidewidth = $options['lshowcase_thumb_width'];
	}
	
	$name = '.lshowcase-wrap-carousel-'.$id;

	if( $slidersettings == "" ) {
		
		$autoscroll = $options['lshowcase_carousel_autoscroll'];
		$pausetime = $options['lshowcase_carousel_pause'];
		$autohover = $options['lshowcase_carousel_autohover'];
		$pager = $options['lshowcase_carousel_pager'];
		$tickerhover = $autohover;
		$ticker = 'false';
		$usecss = 'true';
		$auto = 'true';

		if ($autoscroll == 'false') {
			$auto = 'false';
		}

		if ($autoscroll=='ticker') {
			$ticker = 'true';
			$tickerhover = $autohover;
			$autoscroll = 'true';
			$pager = 'false';
			$auto = 'false';
			
			if ($tickerhover=='true') {
				$usecss = 'false';
			} 
		}

		$autocontrols = $options['lshowcase_carousel_autocontrols'];
		$speed = $options['lshowcase_carousel_speed'];
		$slidemargin = $options['lshowcase_carousel_slideMargin'];
		$loop = $options['lshowcase_carousel_infiniteLoop'];
		$controls = $options['lshowcase_carousel_controls'];
		$minslides = $options['lshowcase_carousel_minSlides'];
		$maxslides = $options['lshowcase_carousel_maxSlides'];
		$moveslides = $options['lshowcase_carousel_moveSlides'];		

		$mode = isset($options['lshowcase_carousel_mode']) ? $options['lshowcase_carousel_mode'] : 'horizontal';

		

	} else {

		$carouselset = explode(',', $slidersettings);		
		$autoscroll = $carouselset[0];
		$pausetime = $carouselset[1];
		$autohover = $carouselset[2];
		$pager = $carouselset[7];
		$tickerhover = $autohover;
		$ticker = 'false';
		$usecss = 'true';
		$auto = 'true';



		if ($autoscroll == 'false') {
			$auto = 'false';
		}

		if ($autoscroll=='ticker') {
			$ticker = 'true';
			$tickerhover = $autohover;
			$autoscroll = 'true';
			$pager = 'false';
			$auto = 'false';

			if ($autohover=='true') {
				$usecss = 'false';
			} 
		}

		$autocontrols = $carouselset[3];
		$speed = $carouselset[4];
		$slidemargin = $carouselset[5];
		$loop = $carouselset[6];
		
		$controls = $carouselset[8];
		$minslides = $carouselset[9];
		$maxslides = $carouselset[10];
		$moveslides = $carouselset[11];	

		$mode = isset($options['lshowcase_carousel_mode']) ? $options['lshowcase_carousel_mode'] : 'horizontal';
		
	}

$new_ls_array = array('divid' => '.lshowcase-wrap-carousel-'.$id,
						'auto' => $auto,
						'pause' => $pausetime,
						'autohover' => $autohover,
						'ticker' => $ticker,
						'tickerhover' => $tickerhover,
						'useCSS' => $usecss,
						'autocontrols' => $autocontrols,
						'speed' => $speed,
						'slidewidth' => $slidewidth,
						'slidemargin' => $slidemargin,
						'infiniteloop' => $loop,
						'pager' => $pager,
						'controls' => $controls,
						'minslides' => $minslides,
						'maxslides' => $maxslides,
						'moveslides' => $moveslides,
						'mode' => $mode //options: 'horizontal', 'vertical', 'fade'
						);

array_push($lshowcase_slider_array, $new_ls_array);
	
lshowcase_add_individual_carousel_js($lshowcase_slider_array);

}

//Custom CSS

function lshowcase_custom_css () {
	$options = get_option( 'lshowcase-settings' );
	$css = $options['lshowcase_css'];
	if($css!=''){
		echo '
		<!-- Custom Styles -->
		<style type="text/css">
		'.$css.'
		</style>';
	}

	$js = $options['lshowcase_js'];
	if($js!=''){
		echo "
		<!-- Custom Javascript -->
		<script type='text/javascript'>
		".$js."
		</script>";
	}

}




//New Icons
$lshowcase_wp_version =  floatval( get_bloginfo( 'version' ) );

if($lshowcase_wp_version >= 3.8) {
	add_action( 'admin_head', 'lshowcase_font_icon' );
}


function lshowcase_font_icon() {
?>

		<style> 
			#adminmenu #menu-posts-lshowcase div.wp-menu-image img { display: none;}
			#adminmenu #menu-posts-lshowcase div.wp-menu-image:before { content: "\f180"; }
		</style>


<?php
}


//shortcode to display filter
add_shortcode( 'show-logos-filter', 'shortcode_lshowcase_filter' );

function shortcode_lshowcase_filter($atts) {

	$categories = (array_key_exists( 'category', $atts) ? $atts['category'] : "0" );
	$filter = (array_key_exists( 'filter', $atts) ? $atts['filter'] : "false" );

	$html = lshowcase_build_filter($filter, $categories);
	return $html;

}

//Function to display Filter
function lshowcase_build_filter($display = 'hide', $category = "") {


	$html = '';
	
	
	if ('enhance' == $display) {
	lshowcase_enhance_filter_code();
	$html .= "<ul id='ls-enhance-filter-nav'>";
	}

	if ('hide' == $display) {
	lshowcase_filter_code();
	$html .= "<ul id='ls-filter-nav'>";
	}

	if ('isotope' == $display) {
	lshowcase_isotope_filter_code();
	$html .= "<ul id='ls-isotope-filter-nav'>";
	}
			
	
	$html .= "<li id='ls-all' data-filter='*'>".__('Todos','lshowcase')."</li>";

	$includecat = array();

	if($category != "" && $category!="0") { 

		 $cats = explode(',',$category);
		 
		 foreach ($cats as $cat) {
		 
		 	$term = get_term_by('slug', $cat, 'lshowcase-categories');
		 	array_push($includecat,$term->term_id);

		 }

		 $args = array(
		 	'include' => $includecat
		 	);

	}

	$args['orderby'] = 'slug';
	$args['order'] = 'ASC';
	$args['parent'] = 0;
	
	$terms = get_terms("lshowcase-categories",$args);

	 $count = count($terms);
	 if ( $count > 0 ){		 
			 foreach ( $terms as $term ) {


			 	//We check for children
			 	$childs = '';

			 	$children_args = array(
				    'orderby'	=> 'slug', 
				    'order'	=> 'ASC',
				    'child_of'	=> $term->term_id); 

			 	$children = get_terms("lshowcase-categories",$children_args);
			 	$children_count = count($children);

			 	if($children_count) {

			 		$childs .= '<ul>';
			 		foreach ( $children as $cterm ) {
			 			$childs .= "<li id='ls-".$cterm->slug."' data-filter='.ls-".$cterm->slug."'>".$cterm->name."</li>";
			 		}

			 		$childs .= '</ul>';

			 	}

			$html .= "<li id='ls-".$term->slug."' data-filter='.ls-".$term->slug."'>".$term->name.$childs."</li>";
			
			}		 
	 }
	$html .= "</ul>";
	

return $html;

}

/* JS for Isotope filter */
function lshowcase_isotope_filter_code() {

	wp_deregister_script( 'lshowcase-isotope' );
	wp_register_script( 'lshowcase-isotope', plugins_url( '/js/isotope.pkgd.min.js', __FILE__ ),array('jquery',),false,false);
	wp_enqueue_script( 'lshowcase-isotope' );

	wp_deregister_script( 'lshowcase-cells-isotope' );
	wp_register_script( 'lshowcase-cells-isotope', plugins_url( '/js/cells-by-row.js', __FILE__ ),array('jquery','lshowcase-isotope'),false,false);
	wp_enqueue_script( 'lshowcase-cells-isotope' );
	
	wp_deregister_script( 'lshowcase-isotope-filter' );
	wp_register_script( 'lshowcase-isotope-filter', plugins_url( '/js/filter-isotope.js', __FILE__ ),array('jquery','lshowcase-isotope','lshowcase-isotope'),false,false);
	wp_enqueue_script( 'lshowcase-isotope-filter' );

	
			
}


/* JS For Filter */ 
function lshowcase_filter_code() {
	
	wp_deregister_script( 'lshowcase-filter' );
	wp_register_script( 'lshowcase-filter', plugins_url( '/js/filter.js', __FILE__ ),array('jquery','jquery-ui-core','jquery-effects-core'),false,false);
	wp_enqueue_script( 'lshowcase-filter' );
			
}

function lshowcase_enhance_filter_code() {
	
	wp_deregister_script( 'lshowcase-enhance-filter' );
	wp_register_script( 'lshowcase-enhance-filter', plugins_url( '/js/filter-enhance.js', __FILE__ ),array('jquery','jquery-effects-core'),false,false);
	wp_enqueue_script( 'lshowcase-enhance-filter' );
			
}


/* Quick Edit */

add_action( 'quick_edit_custom_box', 'lshowcase_display_custom_quickedit', 10, 2 );

function lshowcase_display_custom_quickedit( $column_name, $post_type ) {
    static $printNonce = TRUE;
    if ( $printNonce ) {
        $printNonce = FALSE;
        wp_nonce_field( plugin_basename( __FILE__ ), 'lshowcase_edit_nonce' );
    }

    ?>
    <fieldset class="inline-edit-col-right inline-edit-book">
      <div class="inline-edit-col column-<?php echo $column_name; ?>">
        <label class="inline-edit-group">
        <?php 
         switch ( $column_name ) {
         case 'urldesc':
             ?><span class="title">Descripción</span><input name="urldesc" /><?php
             break;
         case 'urllink':
             ?><span class="title">URL</span><input name="urllink" /><?php
             break;
         }
        ?>
        </label>
      </div>
    </fieldset>
    <?php
}


add_action( 'save_post', 'lshowcase_save_meta' );

function lshowcase_save_meta( $post_id ) {
    
    $slug = 'lshowcase';
    if ( isset($_POST['post_type']) && $slug !== $_POST['post_type'] ) {
        return;
    }
    if ( !current_user_can( 'edit_post', $post_id ) ) {
        return;
    }
    $_POST += array("{$slug}_edit_nonce" => '');
    if ( !wp_verify_nonce( $_POST["{$slug}_edit_nonce"],
                           plugin_basename( __FILE__ ) ) )
    {
        return;
    }

    if ( isset( $_REQUEST['urldesc'] ) ) {
        update_post_meta( $post_id, 'urldesc', $_REQUEST['urldesc'] );
    }
   if ( isset( $_REQUEST['urllink'] ) ) {
        update_post_meta( $post_id, 'urllink', $_REQUEST['urllink'] );
    }
}

/* load script in the footer */
if ( ! function_exists('lshowcase_admin_enqueue_scripts') ):
function lshowcase_admin_enqueue_scripts( $hook ) {

	if ( 'edit.php' === $hook &&
		isset( $_GET['post_type'] ) &&
		'lshowcase' === $_GET['post_type'] ) {

		wp_enqueue_script( 'my_custom_script', plugins_url('js/admin_edit.js', __FILE__),
			false, null, true );

	}

}
endif;
add_action( 'admin_enqueue_scripts', 'lshowcase_admin_enqueue_scripts' );





// VISUAL COMPOSER CLASS

class lshowcase_VCExtendAddonClass {
    function __construct() {
        // We safely integrate with VC with this hook
        add_action( 'init', array( $this, 'integrateWithVC' ) );

    }
 	
    public function integrateWithVC() {
        // Check if Visual Composer is installed
        if ( !defined('WPB_VC_VERSION') || !function_exists('vc_map')) {
            // Display notice that Visual Compser is required
            // add_action('admin_notices', array( $this, 'showVcVersionNotice' ));
            return;
        }
 		


		if(function_exists('vc_map')) {

			$options = get_option( 'lshowcase-settings' );
			$name = $options['lshowcase_name_singular'];
			$nameplural = $options['lshowcase_name_plural'];


			$terms = get_terms( "lshowcase-categories" );
			$count = count($terms);
			$categories = array();
			$categories['All'] = '0';
			if ($count > 0) {
				foreach($terms as $term) {
					$categories[$term->name] =  $term->slug;
				}
			}

			$styles = array();
			$stylesarray = lshowcase_styles_array();
			foreach($stylesarray as $option => $key) {
				$styles[$key['description']] = $option; 
			}
     


			vc_map( array(
            "name" => $nameplural,
            "description" => __("Insertar ".$nameplural." grid o carusel", 'lshowcase'),
            "base" => "show-logos",
            "class" => "",
            //"front_enqueue_css" => plugins_url('includes/visual_composer.css', __FILE__),
            "front_enqueue_js" => plugins_url('includes/visual_composer.js', __FILE__),
            "icon" => plugins_url('images/icon64.png', __FILE__),
            "category" => __('Contenido', 'js_composer'),
            "params" => array(
                array(
                  "admin_label" => true,
                  "type" => "dropdown",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("Ordenar por", 'lshowcase'),
                  "param_name" => "orderby",
                  "value" => array(
                  	'Default' => 'none',
                  	'ID' => 'id',
                  	'Titulo' => 'title',
                  	'Fecha' => 'date',
                  	'Modificado' => 'modified',
                  	'Aleatorio' => 'rand'
                  	),
                  "description" => __("Mostrar las entradas ordenadas por", 'lshowcase')
              ),
                array(
                  "admin_label" => true,
                  "type" => "dropdown",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("Categoría", 'lshowcase'),
                  "param_name" => "category",
                  "value" => $categories,
                  "description" => __("Categoría a visualizar", 'lshowcase')
              ),

                 array(
                  "admin_label" => true,
                  "type" => "textfield",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("Límite", 'lshowcase'),
                  "param_name" => "limit",
                  "value" => '0',
                  "description" => __("Cuantas entradas mostrar Déjelo en blanco o '0' para mostrar todo", 'lshowcase')
              ),

                array(
                  "admin_label" => true,
                  "type" => "dropdown",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("URL", 'lshowcase'),
                  "param_name" => "activeurl",
                  "value" => array(
                  	'Abrir en la misma ventana' => 'same',
                  	'Inactivo' => 'inactive',
                  	'Abrir en nueva ventana' => 'new',
                  	'Abrir en nueva ventana (nofollow)' => 'new_nofollow'
                  	),
                  "description" => __("Configuración de URL de imagen", 'lshowcase')
              ),
                array(
                  "admin_label" => true,
                  "type" => "dropdown",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("Style", 'lshowcase'),
                  "param_name" => "style",
                  "value" => $styles,
                  "description" => __("Efecto de la imagen para aplicar", 'lshowcase')
              ),

                array(
                  "admin_label" => true,
                  "type" => "dropdown",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("Diseño", 'lshowcase'),
                  "param_name" => "interface",
                  "value" => array(
                  	'Normal Grid' => 'grid',
                  	'Horizontal Carousel' => 'hcarousel',
                  	'Responsive Grid - 12 Columnas' => 'grid12',
                  	'Responsive Grid - 11 Columnas' => 'grid11',
                  	'Responsive Grid - 10 Columnas' => 'grid10',
                  	'Responsive Grid - 9 Columnas' => 'grid9',
                  	'Responsive Grid - 8 Columnas' => 'grid8',
                  	'Responsive Grid - 7 Columnas' => 'grid7',
                  	'Responsive Grid - 6 Columnas' => 'grid6',
                  	'Responsive Grid - 5 Columnas' => 'grid5',
                  	'Responsive Grid - 4 Columnas' => 'grid4',
                  	'Responsive Grid - 3 Columnas' => 'grid3',
                  	'Responsive Grid - 2 Columnas' => 'grid2',
                  	'Responsive Grid - 1 Columnas' => 'grid1',
                  	),
                  "description" => __("¿De qué forma quieres que se muestren las imágenes?", 'lshowcase')
              ),

                array(
                  "admin_label" => true,
                  "type" => "dropdown",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("Mostrar tooltip sobre elementos", 'lshowcase'),
                  "param_name" => "tooltip",
                  "value" => array(
                  	'No' => 'false',
                  	'Mostrar Título' => 'true',
                  	'Mostrar Descripción' => 'true-description'
                  	),
                  "description" => __("Mostrar tooltip sobre elementos en hover", 'lshowcase')
              ),

                array(
                  "admin_label" => true,
                  "type" => "dropdown",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("Mostrar información", 'lshowcase'),
                  "param_name" => "description",
                  "value" => array(
                  	'No' => 'false',
                  	'Título abajo' => 'true',
                  	'Descripción abajo' => 'true-description',
                  	'Título arriba' => 'true-above',
                  	'Descripción arriba' => 'true-description-above',
                  	'Título arriba & Descripción abajo' => 'true-title-above-description-below',
                  	'Título & Descripción abajo' => 'true-title-description-below'
                  	),
                  "description" => __("Display information above or below image", 'lshowcase')
              ),

                array(
                  "admin_label" => true,
                  "type" => "dropdown",
                  "holder" => "hidden",
                  "class" => "",
                  "heading" => __("Show Filter", 'lshowcase'),
                  "param_name" => "filter",
                  "value" => array(
                  	'No' => 'false',
                  	'Ocultar Filtro' => 'hide',
                  	'Mejorar Filtro' => 'enhance',
                  	'Isotope Ocultar Filtro' => 'isotope'
                  	),
                  "description" => __("Mostrar el menú de filtro en vivo sobre la grilla", 'lshowcase')
              ),


            ),
           
        	));

		}

        
    }
}
// Finally initialize code
new lshowcase_VCExtendAddonClass();


//Fix to load files on all pages
/*
add_action( 'init', 'lshowcase_load_all_pages' );
function lshowcase_load_all_pages() {
	lshowcase_add_tooltip_js(false);
	lshowcase_add_main_css();
}
*/

?>