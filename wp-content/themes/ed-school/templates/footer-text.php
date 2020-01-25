<?php $footer_text = ed_school_get_option( 'footer-text', '' ); ?>
<?php if ( $footer_text ): ?>
	<div class="<?php echo ed_school_class( 'footer-text' ); ?>">
		<?php echo do_shortcode( $footer_text ); ?>
	</div>
<?php endif; ?>
