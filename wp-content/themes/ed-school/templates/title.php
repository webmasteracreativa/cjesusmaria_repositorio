<?php
$header_message        = ed_school_get_option( 'archive-single-header-message', '' );
$enable_header_message = is_single() && ( get_post_type() == 'post' || get_post_type() == 'teacher' ) && ! empty( $header_message ) ? true : false;
$enable_breadcrumbs    = ed_school_get_option( 'page-title-breadcrumbs-enable', false );
$breadcrumbs_position  = ed_school_get_option( 'page-title-breadcrumbs-position', 'bellow_title' );
$page_title_layout     = ed_school_get_option( 'page-title-layout', 'default' );


$blog_archive_subtitle = ed_school_get_option( 'blog-archive-subtitle', '' );

?>
<?php if ( $enable_breadcrumbs && $breadcrumbs_position == 'above_title' ): ?>
	<?php get_template_part( 'templates/breadcrumbs' ); ?>
<?php endif ?>
<?php if ( $enable_header_message ) : ?>
	<div class="<?php echo ed_school_class( 'header-mesage-row' ); ?>">
		<div class="<?php echo ed_school_class( 'container' ); ?>">
			<div class="one whole wh-padding">
				<p><?php echo esc_html( $header_message ); ?></p>
			</div>
		</div>
	</div>
<?php endif; ?>
<?php if ( ed_school_page_title_enabled() ) : ?>
	<div class="<?php echo ed_school_class( 'page-title-row' ); ?>">
		<?php if ($page_title_layout == 'default'): ?>
			<div class="<?php echo ed_school_class( 'container' ); ?>">
				<div class="<?php echo ed_school_class( 'page-title-grid-wrapper' ); ?>">
					<h1 class="<?php echo ed_school_class( 'page-title' ); ?>"><?php echo ed_school_title(); ?></h1>
					<?php if ( is_home() && $blog_archive_subtitle ) : ?>
						<h2 class="<?php echo ed_school_class( 'page-subtitle' ); ?>"><?php echo esc_html( $blog_archive_subtitle ); ?></h2>
					<?php elseif ( is_page() 
						|| ed_school_is_shop() 
						|| ( is_single() && get_post_type() == 'project' )
						|| ( is_single() && get_post_type() == 'teacher' ) 
						|| ( is_single() && get_post_type() == 'agc_course' ) 
						) : ?>
						<?php global $post;
						if (ed_school_is_shop()) {
							$post_id = ed_school_get_shop_page_id();
						} else {
							$post_id = $post->ID;
						}
						$subtitle = apply_filters('post_subtitle', ed_school_get_rwmb_meta( 'subtitle_single_page', $post_id )); ?>
						<?php if ( $subtitle ) : ?>
							<h2 class="<?php echo ed_school_class( 'page-subtitle' ); ?>"><?php echo esc_html( $subtitle ); ?></h2>
						<?php endif; ?>
					<?php elseif ( is_single() ) : ?>
						<?php get_template_part( 'templates/entry-meta' ); ?>
					<?php endif; ?>
				</div>
			<?php endif ?>
		</div>
	</div>
<?php endif; ?>
<?php if ( $enable_breadcrumbs && $breadcrumbs_position == 'bellow_title' ): ?>
	<?php get_template_part( 'templates/breadcrumbs' ); ?>
<?php endif ?>
