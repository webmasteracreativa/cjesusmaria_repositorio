<?php

add_filter( 'language_attributes', 'ed_school_language_attributes' );
// add_filter( 'wp_title', 'ed_school_wp_title', 10 );
add_filter( 'excerpt_length', 'ed_school_excerpt_length' );
add_filter( 'excerpt_more', 'ed_school_excerpt_more' );
add_filter( 'request', 'ed_school_request_filter' );
add_filter( 'get_search_form', 'ed_school_get_search_form' );

/**
 * Clean up language_attributes() used in <html> tag
 *
 * Remove dir="ltr"
 */
function ed_school_language_attributes() {
	$attributes = array();
	$output     = '';

	if ( is_rtl() ) {
		$attributes[] = 'dir="rtl"';
	}

	$lang = get_bloginfo( 'language' );

	if ( $lang ) {
		$attributes[] = "lang=\"$lang\"";
	}

	$output = implode( ' ', $attributes );
	$output = apply_filters( 'ed_school_language_attributes', $output );

	return $output;
}

/**
 * Manage output of wp_title()
 */
function ed_school_wp_title( $title ) {
	if ( is_feed() ) {
		return $title;
	}

	$title .= get_bloginfo( 'name' );

	return $title;
}

/**
 * Clean up the_excerpt()
 */
function ed_school_excerpt_length( $length ) {
	$post_excerpt_length = ed_school_get_option('post-excerpt-length', POST_EXCERPT_LENGTH);
	return $post_excerpt_length;
}

function ed_school_excerpt_more( $more ) {
	return '&nbsp;<a href="' . get_permalink() . '">&hellip;</a>';
}


/**
 * Fix for empty search queries redirecting to home page
 *
 * @link http://wordpress.org/support/topic/blank-search-sends-you-to-the-homepage#post-1772565
 * @link http://core.trac.wordpress.org/ticket/11330
 */
function ed_school_request_filter( $query_vars ) {
	if ( isset( $_GET['s'] ) && empty( $_GET['s'] ) && ! is_admin() ) {
		$query_vars['s'] = ' ';
	}

	return $query_vars;
}


/**
 * Tell WordPress to use searchform.php from the templates/ directory
 */
function ed_school_get_search_form( $form ) {
	$form = '';
	include_once get_template_directory() . '/templates/searchform.php';

	return $form;
}

