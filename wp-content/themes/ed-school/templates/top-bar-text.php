<?php $top_bar_text = ed_school_get_option( 'top-bar-text', '' ); ?>
<?php if ( $top_bar_text ): ?>
	<div class="<?php echo ed_school_class( 'top-bar-text' ); ?>">
		<?php echo do_shortcode( $top_bar_text ); ?>
	</div>
<?php endif; ?>
