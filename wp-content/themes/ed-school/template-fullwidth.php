<?php
/**
 * @package WordPress
 * @subpackage Wheels
 *
 * Template Name: Full Width
 */
get_header();
?>
<?php get_template_part( 'templates/title' ); ?>
<div class="<?php echo ed_school_class( 'main-wrapper' ) ?>">
	<div class="<?php echo ed_school_class( 'container' ) ?>">
		<div class="<?php echo ed_school_class( 'content-fullwidth' ) ?>">
			<?php get_template_part( 'templates/content-page' ); ?>
		</div>
	</div>
</div>
<?php get_footer(); ?>
