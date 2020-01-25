<?php
/**
 * @package WordPress
 * @subpackage Wheels
 *
 * Template Name: Sidebar - Right with Child Pages
 */
get_header();
?>
<?php get_template_part( 'templates/title' ); ?>
<div class="<?php echo ed_school_class( 'main-wrapper' ) ?>">
	<div class="<?php echo ed_school_class( 'container' ) ?>">
		<div class="<?php echo ed_school_class( 'fourths three' ) ?>">
			<h1 class="titulo"><?php echo get_the_title(); ?></h1>
			<hr/>
		</div>
		<div class="<?php echo ed_school_class( 'sidebar' ) ?>">
			<?php get_template_part( 'templates/child-pages-sidebar' ); ?>
			<?php get_sidebar( 'child-pages' ); ?>
		</div>
		<div class="fourths three intro"><?php 
			$intro = get_post_meta( $post->ID, 'tsop', true );
			echo nl2br($intro);
		?>
		</div>
		<div class="fourths four wh-padding wh-content-inner">
			<div class="child-pages-mobile-wrap">
				<?php get_template_part( 'templates/child-pages-sidebar' ); ?>
			</div>
			<?php get_template_part( 'templates/content-page' ); ?>
		</div>
	</div>
</div>
<?php get_footer(); ?>
