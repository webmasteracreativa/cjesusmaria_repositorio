<?php
/**
 * @package WordPress
 * @subpackage Wheels
 */

$blog_archive_layout = ed_school_get_option( 'blog-archive-layout', 'default' );

$blog_archive_is_boxed     = $blog_archive_layout == 'boxed' || $blog_archive_layout == 'boxed-fullwidth';
$blog_archive_is_fullwidth = $blog_archive_layout == 'fullwidth' || $blog_archive_layout == 'boxed-fullwidth';

if ( $blog_archive_is_boxed ) {
	get_header( 'boxed' );
} else {
	get_header();
}
$content_class = $blog_archive_is_fullwidth ? 'content_fullwidht' : 'content';
?>
<?php get_template_part( 'templates/title' ); ?>
<div class="<?php echo ed_school_class( 'main-wrapper' ) ?>">
	<div class="<?php echo ed_school_class( 'container' ) ?>">
		<div class="<?php echo ed_school_class( $content_class ) ?>">
			<?php if ( have_posts() ): ?>
				<?php while ( have_posts() ) : the_post(); ?>
					<?php get_template_part( 'templates/content', get_post_format() ); ?>
				<?php endwhile; ?>
			<?php else: ?>
				<?php get_template_part( 'templates/content', 'none' ); ?>
			<?php endif; ?>
			<div class="<?php echo ed_school_class( 'pagination' ) ?>">
				<?php ed_school_pagination(); ?>
			</div>
		</div>
		<?php if ( ! $blog_archive_is_fullwidth ) : ?>
			<div class="<?php echo ed_school_class( 'sidebar' ) ?>">
				<?php get_sidebar(); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
<?php
if ( $blog_archive_is_boxed ) {
	get_footer( 'boxed' );
} else {
	get_footer();
}
?>
