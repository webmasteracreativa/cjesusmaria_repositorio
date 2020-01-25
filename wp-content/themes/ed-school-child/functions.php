<?php
// WP will add the style src only once
// this script runs before the theme style hook and registers theme style file
// because theme style hook is using get_stylesheet_uri which will load child theme style.css
add_action( 'wp_enqueue_scripts', 'ed_school_child_theme_enqueue_styles' );
function ed_school_child_theme_enqueue_styles() {
	$parent_style = 'ed-school-style';
	wp_register_style( $parent_style, get_template_directory_uri() . '/style.css' );
}

add_action( 'wp_enqueue_scripts', 'ed_school_child_enqueue_styles', 101 );
function ed_school_child_enqueue_styles() {

	$parent_style = 'ed-school-style';

	wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
	wp_enqueue_style( 'child-style',
		get_stylesheet_directory_uri() . '/style.css',
		array( $parent_style ),
		wp_get_theme()->get('Version')
	);
}

// put custom code here

/**************************************************************
 * Eliminar carácteres de archivos subidos
**************************************************************/

function bea_sanitize_file_name_chars( $special_chars = array() ) {
	$special_chars = array_merge( array( '’', '‘', '“', '”', '«', '»', '‹', '›', '—', '€' ), $special_chars );

	return $special_chars;
}
add_filter( 'sanitize_file_name_chars', 'bea_sanitize_file_name_chars', 10, 1 );

/**
 * Filters the filename by adding more rules :
 * - only lowercase
 * - replace _ by -
 *
 * @since 1.0.1
 *
 * @param string $file_name
 *
 * @return string
 */
function bea_sanitize_file_name( $file_name = '' ) {
	// Empty filename
	if ( empty($file_name) ) {
		return $file_name;
	}

	// get extension
	preg_match( '/\.[^\.]+$/i', $file_name, $ext );

	// No extension, go out ?
	if ( ! isset( $ext[0] ) ) {
		return $file_name;
	}

	// Get only first part
	$ext = $ext[0];

	// work only on the filename without extension
	$file_name = str_replace( $ext, '', $file_name );

	// only lowercase
	// remove accents
	$file_name = sanitize_title( $file_name );

	// replace _ by -
	$file_name = str_replace( '_', '-', $file_name );

	// Return sanitized file name
	return $file_name . $ext;
}
add_filter( 'sanitize_file_name', 'bea_sanitize_file_name', 10, 1 );

/**************************************************************
 * Sidebar para profesores
**************************************************************/

function teacher_sidebar() {
    register_sidebar(
        array (
            'name' => __( 'Profesores', 'ed-school' ),
            'id' => 'teacher-side-bar',
            'description' => __( 'Profesores Sidebar', 'ed-school' ),
            'before_widget' => '<div class="widget-content">',
            'after_widget' => "</div>",
            'before_title' => '<h3 class="widget-title">',
            'after_title' => '</h3>',
        )
    );
}
add_action( 'widgets_init', 'teacher_sidebar' );

/**************************************************************
 * Excerpt WordPress
**************************************************************/

function custom_excerpt_length( $length ) {
	return 20;
}
add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

/**************************************************************
 * Header & Footer WordPress
**************************************************************/

# Header WordPress

add_action('wp_head', 'header_function_code');
function header_function_code(){ ?>
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '382703985575375');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=382703985575375&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->

<meta name="google-site-verification" content="q83veAAdgE7Pq4cepzpAc1tgcGmNJUnbnwEnOydiXgI" />
<?php };

# Footer WordPress

add_action('wp_footer', 'footer_function_code');
function footer_function_code(){ ?>
<!-- Pixel Visita -->
<script>
  fbq('track', 'ViewContent', {
    value: 1,
    content_ids: 'Visita Web',
  });
</script>
<!-- Global site tag (gtag.js) - Google Analytics-->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-117105163-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-117105163-1');
</script>
<!-- End Global site tag (gtag.js) - Google Analytics -->
<?php
/* Código específico de seguimeinto en algunas paginas */
  if(is_single(array(286,159,147,311))) {  ?>
  <!-- Pixel Admisiones -->
  <script>
    fbq('track', 'Lead', {
      value: 1,
    });
  </script>
  <?php  }
  if(is_single(1354)) {  ?>
  <!-- Pixel Pagos -->
  <script>
    fbq('track', 'InitiateCheckout', {
      value: 0.5,
    });
  </script>
  <?php  } ?>

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v3.2&appId=2109398455982319&autoLogAppEvents=1';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<?php };

/**************************************************************
 * Elimina referencias a la versión de WordPress
**************************************************************/

add_filter('the_generator', create_function('', 'return "";'));

/**************************************************************
 * Duplicar Contenido
**************************************************************/

function content_clone(){
	global $wpdb;
	if (! ( isset( $_GET['post']) || isset( $_POST['post'])  || ( isset($_REQUEST['action']) && 'content_clone' == $_REQUEST['action'] ) ) ) {
		wp_die('No se ha enviado ningún contenido para duplicar');
	}

	$post_id = (isset($_GET['post']) ? $_GET['post'] : $_POST['post']);
	$post = get_post( $post_id );
	$current_user = wp_get_current_user();
	$new_post_author = $current_user->ID;

	if (isset( $post ) && $post != null) {

		$args = array(
			'comment_status' => $post->comment_status,
			'ping_status'    => $post->ping_status,
			'post_author'    => $new_post_author,
			'post_content'   => $post->post_content,
			'post_excerpt'   => $post->post_excerpt,
			'post_name'      => $post->post_name,
			'post_parent'    => $post->post_parent,
			'post_password'  => $post->post_password,
			'post_status'    => 'draft',
			'post_title'     => $post->post_title,
			'post_type'      => $post->post_type,
			'to_ping'        => $post->to_ping,
			'menu_order'     => $post->menu_order
		);

		/*
		 * Crear el nuevo Post/Página via wp_insert_post()
		 */
		$new_post_id = wp_insert_post( $args );

		/*
		 * Para taxonomias de Post/Página a duplicar
		 */
		$taxonomies = get_object_taxonomies($post->post_type); // retorna array de taxonomias
		foreach ($taxonomies as $taxonomy) {
			$post_terms = wp_get_object_terms($post_id, $taxonomy, array('fields' => 'slugs'));
			wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
		}
		/*
		 * SQL
		 */
		$post_meta_infos = $wpdb->get_results("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id=$post_id");
		if (count($post_meta_infos)!=0) {
			$sql_query = "INSERT INTO $wpdb->postmeta (post_id, meta_key, meta_value) ";
			foreach ($post_meta_infos as $meta_info) {
				$meta_key = $meta_info->meta_key;
				$meta_value = addslashes($meta_info->meta_value);
				$sql_query_sel[]= "SELECT $new_post_id, '$meta_key', '$meta_value'";
			}
			$sql_query.= implode(" UNION ALL ", $sql_query_sel);
			$wpdb->query($sql_query);
		}
		/*
		 * Redirect para el editor de Post/Páginas
		 */
		wp_redirect( admin_url( 'post.php?action=edit&post=' . $new_post_id ) );
		exit;
	} else {
		wp_die('No es posible encontrar el Post/Página: ' . $post_id);
	}
}
add_action( 'admin_action_content_clone', 'content_clone' );

/*
 * Adicion del boton "Duplicar" en listas
 */
function content_clone_link( $actions, $post ) {
	if (current_user_can('edit_posts')) {
		$actions['duplicate'] = '<a href="admin.php?action=content_clone&amp;post=' . $post->ID . '" title="Clone this!" rel="permalink">Duplicar</a>';
	}
	return $actions;
}

add_filter( 'post_row_actions', 'content_clone_link', 10, 2 ); // Para post
add_filter( 'page_row_actions', 'content_clone_link', 10, 2 ); //Para páginas

/**************************************************************
 * Buscador
**************************************************************/

function wpdocs_my_search_form( $form ) {
    $form = '<form role="search" method="get" id="searchform" class="searchform" action="' . home_url( '/' ) . '" >
    <div><label class="screen-reader-text" for="s">' . __( 'Buscar...' ) . '</label>
    <input type="text" value="' . get_search_query() . '" name="s" id="s" />
    <input type="submit" id="searchsubmit" value="'. esc_attr__( 'Buscar' ) .'" />
    </div>
    </form>';

    return $form;
}
add_filter( 'get_search_form', 'wpdocs_my_search_form' );

/**************************************************************
* Funciones para registrar taxonomía / Introduccion de paginas
**************************************************************/

add_action( 'load-post.php', 'toc_post_meta_boxes' );
add_action( 'load-post-new.php', 'toc_post_meta_boxes' );

function toc_post_meta_boxes() {
	add_action( 'add_meta_boxes', 'load_toc_post_meta_boxes' );
	add_action( 'save_post', 'save_toc_post_meta_boxes', 10, 2 );
}

add_action( 'init', 'register_meta_field_tsop' );
function register_meta_field_tsop() {
	register_meta( 'page',
				  'tsop',
               [
                 'description'      => _x( 'Intro', 'meta description', 'tsop' ),
                 'single'           => true,
                 'sanitize_callback' => 'sanitize_textarea_field',
                 'auth_callback'     => 'tsop_custom_fields_auth_callback'
               ]
	);
}

function tsop_custom_fields_auth_callback( $allowed, $meta_key, $post_id, $user_id, $cap, $caps ) {
  if( 'page' == get_post_type( $post_id ) && current_user_can( 'edit_post', $post_id ) ) {
    $allowed = true;
  } else {
	$allowed = false;
  }
  return $allowed;
}

function load_toc_post_meta_boxes() {
    add_meta_box(
		'tsop-meta-box', 			//identificador
		'Intro', 	    			//título de la caja
		'tsop_meta_box_callback', 	//función que pinta el contenido
		'page',						//donde queremos que sea visible
		'advanced',					//donde queremos que aparezca advanced por defecto o side
		'high',						//prioridad a la hora de mostrarse
		array( 'key' => 'value' ) 	//Este array es pasado al callback
    );
}

function tsop_meta_box_callback( $post, $box ) {
	wp_nonce_field( basename( __FILE__ ), 'metakey_html_toc' );

	$meta = nl2br(esc_html(get_post_meta($post->ID, 'tsop', true))); ?>

	<?php wp_editor( $meta, 'tsop');?></p>
<?php
}

function save_toc_post_meta_boxes( $post_id, $post ) {

	if ( !isset( $_POST['metakey_html_toc'] ) || !wp_verify_nonce( $_POST['metakey_html_toc'], basename( __FILE__ ) ) )
	return $post_id;

	$post_type = get_post_type_object( $post->post_type );

	if ( !current_user_can( $post_type->cap->edit_post, $post_id ) )
	return $post_id;

	$new_meta_value = ( isset( $_POST['tsop'] ) ? wp_kses($_POST['tsop']) : '' );
	$meta_key = 'tsop';

	$meta_value = get_post_meta( $post_id, $meta_key, true );

	if ( $new_meta_value && '' == $meta_value )
	add_post_meta( $post_id, $meta_key, $new_meta_value, true );

	elseif ( $new_meta_value && $new_meta_value != $meta_value )
	update_post_meta( $post_id, $meta_key, $new_meta_value );

	elseif ( '' == $new_meta_value && $meta_value )
	delete_post_meta( $post_id, $meta_key, $meta_value );
}

/**************************************************************
 * Login Personalizado
**************************************************************/

function login_custom_stylesheet() { ?>
 <link rel="stylesheet" id="custom_wp_admin_css" href="<?php echo get_bloginfo( 'stylesheet_directory' ) . '/login.css'; ?>" type="text/css" media="all" />
<?php }
add_action( 'login_enqueue_scripts', 'login_custom_stylesheet' );
