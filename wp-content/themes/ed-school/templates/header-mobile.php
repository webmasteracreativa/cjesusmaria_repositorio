<?php
$mobile_header_layout_block = ed_school_get_layout_block( 'header-layout-block-mobile' );
?>
<?php if ( $mobile_header_layout_block ): ?>
	<div class="<?php echo ed_school_class( 'header-mobile' ); ?>">
		<?php echo do_shortcode( $mobile_header_layout_block->post_content ); ?>
	</div>
<?php else: ?>
	<div class="<?php echo ed_school_class( 'header-mobile-default' ); ?>">
		<?php get_template_part('templates/menu-mobile'); ?>
	</div>
<?php endif; ?>