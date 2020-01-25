<?php global $post_id; ?>
<?php $post_class = ed_school_class( 'post-item' ); ?>
<div <?php echo post_class( $post_class ) ?>>

	<div class="one whole">
		<div class="thumbnail">
			<?php ed_school_get_thumbnail( array( 'thumbnail' => 'ed-school-featured-image', 'link' => true ) ); ?>
		</div>
		<?php get_template_part( 'templates/entry-meta' ); ?>
		<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
	</div>
	<div class="item one whole">
		<div class="entry-summary"><?php echo strip_shortcodes( get_the_excerpt() ); ?></div>
		<a class="wh-button read-more hoverable"
		   href="<?php the_permalink(); ?>"><span class="anim"></span><?php esc_html_e( 'Read more', 'ed-school' ); ?></a>
	</div>
</div>
