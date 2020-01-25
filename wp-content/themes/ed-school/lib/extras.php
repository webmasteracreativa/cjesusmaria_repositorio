<?php
/**
 * Custom functions
 */
add_filter( 'post_class', 'ed_school_oddeven_post_class' );
add_filter( 'body_class', 'ed_school_filter_body_class' );
add_filter( 'msm_filter_menu_location', 'ed_school_msm_filter_menu_location' );
add_filter( 'msm_filter_load_compiled_style', 'ed_school_msm_filter_load_compiled_style' );
add_filter( 'breadcrumb_trail_labels', 'ed_school_breadcrumb_trail_labels' );

function ed_school_add_layout_blocks_css() {

	$css = '';

	$header_layout_block_id = ed_school_get_layout_block_id( 'header-layout-block' );
	$css .= ed_school_get_vc_page_custom_css( $header_layout_block_id );
	$css .= ed_school_get_vc_shortcodes_custom_css( $header_layout_block_id );

	$mobile_header_layout_block_id = ed_school_get_layout_block_id( 'header-layout-block-mobile' );
	$css .= ed_school_get_vc_page_custom_css( $mobile_header_layout_block_id );
	$css .= ed_school_get_vc_shortcodes_custom_css( $mobile_header_layout_block_id );

	$footer_layout_block_id = ed_school_get_layout_block_id( 'footer-layout-block' );
	$css .= ed_school_get_vc_page_custom_css( $footer_layout_block_id );
	$css .= ed_school_get_vc_shortcodes_custom_css( $footer_layout_block_id );

	$quick_sidebar_layout_block_id = ed_school_get_layout_block_id( 'quick-sidebar-layout-block' );
	$css .= ed_school_get_vc_page_custom_css( $quick_sidebar_layout_block_id );
	$css .= ed_school_get_vc_shortcodes_custom_css( $quick_sidebar_layout_block_id );

	return $css;
}


function ed_school_filter_body_class( $body_classes ) {

	$body_classes[] = 'header-' . ed_school_get_option( 'header-location', 'top' );

	if (ed_school_page_title_enabled()) {
		$body_classes[] = 'page-title-enabled';
	}

	return $body_classes;
}

function ed_school_msm_filter_menu_location( $menu_location ) {
	global $post_id;
	$use_custom_menu_location = ed_school_get_rwmb_meta( 'use_custom_menu', $post_id );
	if ( $use_custom_menu_location ) {
		$custom_menu_location = ed_school_get_rwmb_meta( 'custom_menu_location', $post_id );
		if ( ! empty( $custom_menu_location ) ) {
			return $custom_menu_location;
		}
	}

	return $menu_location;
}

function ed_school_msm_filter_load_compiled_style() {
	return false;
}

function ed_school_get_vc_page_custom_css( $id ) {

	$out = '';
	if ( $id ) {
		$post_custom_css = get_post_meta( $id, '_wpb_post_custom_css', true );
		if ( ! empty( $post_custom_css ) ) {
			$post_custom_css = strip_tags( $post_custom_css );
			// $out .= '<style type="text/css" data-type="vc_custom-css">';
			$out .= $post_custom_css;
			// $out .= '</style>';
		}
	}

	return $out;
}

function ed_school_get_vc_shortcodes_custom_css( $id ) {

	$out = '';
	if ( $id ) {
		$shortcodes_custom_css = get_post_meta( $id, '_wpb_shortcodes_custom_css', true );
		if ( ! empty( $shortcodes_custom_css ) ) {
			$shortcodes_custom_css = strip_tags( $shortcodes_custom_css );
			// $out .= '<style type="text/css" data-type="vc_shortcodes-custom-css">';
			$out .= $shortcodes_custom_css;
			// $out .= '</style>';
		}
	}

	return $out;
}

function ed_school_register_custom_thumbnail_sizes() {
	$string = ed_school_get_option( 'custom-thumbnail-sizes' );

	if ( $string ) {

		$pattern     = '/[^a-zA-Z0-9\-\|\:]/';
		$replacement = '';
		$string      = preg_replace( $pattern, $replacement, $string );

		$resArr = explode( '|', $string );
		$thumbs = array();

		foreach ( $resArr as $thumbString ) {
			if ( ! empty( $thumbString ) ) {
				$parts               = explode( ':', trim( $thumbString ) );
				$thumbs[ $parts[0] ] = explode( 'x', $parts[1] );
			}
		}

		foreach ( $thumbs as $name => $sizes ) {
			add_image_size( $name, (int) $sizes[0], (int) $sizes[1], true );
		}
	}
}

if ( ! function_exists( 'ed_school_entry_meta' ) ) {

	/**
	 * Prints HTML with meta information for current post: categories, tags, permalink, author, and date.
	 *
	 * @return void
	 */
	function ed_school_entry_meta() {
		if ( is_sticky() && is_home() && ! is_paged() ) {
			echo '<span class="featured-post">' . esc_html__( 'Sticky', 'ed-school' ) . '</span>';
		}

		if ( ! has_post_format( 'link' ) && 'post' == get_post_type() ) {
			ed_school_entry_date();
		}

		// Translators: used between list items, there is a space after the comma.
		$categories_list = get_the_category_list( esc_html__( ', ', 'ed-school' ) );
		if ( $categories_list ) {
			echo '<span class="categories-links"><i class="fa fa-folder"></i>' . $categories_list . '</span>';
		}

		// Translators: used between list items, there is a space after the comma.
		$tag_list = get_the_tag_list( '', esc_html__( ', ', 'ed-school' ) );
		if ( $tag_list ) {
			echo '<span class="tags-links"><i class="fa fa-tag"></i> ' . $tag_list . '</span>';
		}

		// Post author
		if ( 'post' == get_post_type() ) {
			global $post;
			printf( '<span class="author vcard"><i class="fa fa-user"></i> %1$s <a class="url fn n" href="%2$s" title="%3$s" rel="author">%4$s</a></span>', esc_html__( 'by', 'ed-school' ), esc_url( get_author_posts_url( get_the_author_meta( 'ID', $post->post_author ) ) ),
				esc_attr( sprintf( esc_html__( 'View all posts by %s', 'ed-school' ), get_the_author() ) ), get_the_author() );

			$num_comments = get_comments_number(); // get_comments_number returns only a numeric value

			if ( $num_comments == 0 ) {

			} else {

				if ( $num_comments > 1 ) {
					$comments = $num_comments . esc_html__( ' Comments', 'ed-school' );
				} else {
					$comments = esc_html__( '1 Comment', 'ed-school' );
				}
				echo '<span class="comments-count"><i class="fa fa-comment"></i><a href="' . get_comments_link() . '">' . $comments . '</a></span>';
			}

		}


	}
}

if ( ! function_exists( 'ed_school_entry_date' ) ) {

	/**
	 * Prints HTML with date information for current post.
	 *
	 * @param boolean $echo Whether to echo the date. Default true.
	 *
	 * @return string The HTML-formatted post date.
	 */
	function ed_school_entry_date( $echo = true ) {
		if ( has_post_format( array( 'chat', 'status' ) ) ) {
			$format_prefix = _x( '%1$s on %2$s', '1: post format name. 2: date', 'ed-school' );
		} else {
			$format_prefix = '%2$s';
		}

		$date = sprintf( '<span class="date"><i class="fa fa-calendar"></i><a href="%1$s" title="%2$s" rel="bookmark"><time class="entry-date" datetime="%3$s">%4$s</time></a></span>', esc_url( get_permalink() ),
			esc_attr( sprintf( esc_html__( 'Permalink to %s', 'ed-school' ), the_title_attribute( 'echo=0' ) ) ), esc_attr( get_the_date( 'c' ) ), esc_html( sprintf( $format_prefix, get_post_format_string( get_post_format() ), get_the_date() ) ) );

		if ( $echo ) {
			echo $date;
		}

		return $date;
	}

}


function ed_school_add_editor_style() {
	add_editor_style( 'editor-style.css' );
}

function ed_school_get_post_bg_img() {

	$image     = ed_school_get_option( 'page-title-background-image', array() );
	$image_url = isset( $image['url'] ) && $image['url'] ? $image['url'] : '';

	if ( $image_url ) {

		echo 'style="min-height: 200px;background:transparent;" data-parallax="scroll" data-image-src="' . $image_url . '"';
	}
}

function ed_school_oddeven_post_class( $classes ) {
	global $ed_school_current_class;
	$classes[]     = $ed_school_current_class;
	$ed_school_current_class = ( $ed_school_current_class == 'odd' ) ? 'even' : 'odd';

	return $classes;
}

global $ed_school_current_class;
$ed_school_current_class = 'odd';

function ed_school_social_share() {
	?>
	<div class="share-this">
		<!-- http://simplesharingbuttons.com/ -->
		<ul class="share-buttons">
			<li><a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode( site_url() ); ?>&t="
			       target="_blank" title="Compartir en Facebook"
			       onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.URL) + '&t=' + encodeURIComponent(document.URL)); return false;"><i
						class="fa fa-facebook"></i></a></li>
			<li>
				<a href="https://twitter.com/intent/tweet?source=<?php echo urlencode( site_url() ); ?>&text=:%20<?php echo urlencode( site_url() ); ?>"
				   target="_blank" title="Tweet"
				   onclick="window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + ':%20' + encodeURIComponent(document.URL)); return false;"><i
						class="fa fa-twitter"></i></a></li>
			<li><a href="https://plus.google.com/share?url=<?php echo urlencode( site_url() ); ?>"
			       target="_blank" title="Compartir en Google+"
			       onclick="window.open('https://plus.google.com/share?url=' + encodeURIComponent(document.URL)); return false;"><i
						class="fa fa-google-plus"></i></a></li>
			<li>
				<a href="http://pinterest.com/pin/create/button/?url=<?php echo urlencode( site_url() ); ?>&description="
				   target="_blank" title="Pin it"
				   onclick="window.open('http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(document.URL) + '&description=' +  encodeURIComponent(document.title)); return false;"><i
						class="fa fa-pinterest"></i></a></li>
			<li>
				<a href="http://www.linkedin.com/shareArticle?mini=true&url=<?php echo urlencode( site_url() ); ?>&title=&summary=&source=<?php echo urlencode( site_url() ); ?>"
				   target="_blank" title="Compartir en LinkedIn"
				   onclick="window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(document.URL) + '&title=' +  encodeURIComponent(document.title)); return false;"><i
						class="fa fa-linkedin"></i></a></li>
		</ul>
	</div>

<?php
}


function ed_school_breadcrumb_trail_labels($labels) {

	return wp_parse_args( array(
		'browse'              => esc_html__( 'Browse:',                               'ed-school' ),
		'aria_label'          => esc_attr_x( 'Breadcrumbs', 'breadcrumbs aria label', 'ed-school' ),
		'home'                => esc_html__( 'Inicio',                                  'ed-school' ),
		'error_404'           => esc_html__( '404 Not Found',                         'ed-school' ),
		'archives'            => esc_html__( 'Archivo',                              'ed-school' ),
		// Translators: %s is the search query. The HTML entities are opening and closing curly quotes.
		'search'              => esc_html__( 'Resultados de búsqueda para &#8220;%s&#8221;',   'ed-school' ),
		// Translators: %s is the page number.
		'paged'               => esc_html__( 'Página %s',                               'ed-school' ),
		// Translators: Minute archive title. %s is the minute time format.
		'archive_minute'      => esc_html__( 'Minuto %s',                             'ed-school' ),
		// Translators: Weekly archive title. %s is the week date format.
		'archive_week'        => esc_html__( 'Semana %s',                               'ed-school' ),
	), $labels);

}
