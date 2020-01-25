<?php
/**
 */
$is_boxed = ed_school_get_option('single-post-is-boxed', false);
if ($is_boxed) {
    get_header('boxed');
} else {
    get_header();
}
?>
<?php get_template_part('templates/title'); ?>
<div class="<?php echo ed_school_class('main-wrapper') ?>">
	<div class="<?php echo ed_school_class('container'); ?>">
		<?php if ( ed_school_get_option( 'single-post-sidebar-left', false ) ): ?>
			<div class="<?php echo ed_school_class( 'sidebar' ) ?>">
				<?php get_sidebar(); ?>
			</div>
			<div class="<?php echo ed_school_class( 'content' ) ?>">
				<?php get_template_part( 'templates/content-single-teacher', 'course' ); ?>
			</div>
		<?php else: ?>
			<div class="<?php echo ed_school_class( 'content' ) ?>">
				<?php get_template_part( 'templates/content-single-teacher', 'course' ); ?>
			</div>
			<div class="<?php echo ed_school_class( 'sidebar' ) ?>">
				<?php dynamic_sidebar( 'teacher-side-bar' ); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
<?php
if ($is_boxed) {
    get_footer('boxed');
} else {
    get_footer();
}
?>
