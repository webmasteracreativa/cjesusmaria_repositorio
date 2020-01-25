<?php
/**
 * The template for displaying 404 pages (Not Found).
 *
 * @package WordPress
 * @subpackage Wheels
 */
get_header();
?>
<?php get_template_part( 'templates/title' ); ?>
<div class="<?php echo ed_school_class( 'main-wrapper' ); ?>">
	<div class="<?php echo ed_school_class( 'container' ); ?>">
		<div class="double-padded">
			<h1 class="entry-title"><?php esc_html_e( 'This is somewhat embarrassing, isn&rsquo;t it?', 'ed-school' ); ?></h1>

			<p><?php esc_html_e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'ed-school' ); ?></p>
			<?php get_search_form(); ?>
		</div>
	</div>

</div>
<?php get_footer(); ?>
