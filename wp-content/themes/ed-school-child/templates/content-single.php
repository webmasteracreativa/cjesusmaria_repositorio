<?php 

$obj_id = get_queried_object_id();
$current_url = get_permalink( $obj_id );

while ( have_posts() ) : the_post(); ?>
	<div <?php post_class(); ?>>
		<?php if ( ! ed_school_page_title_enabled() ) : ?>
			<?php the_title( '<h1>', '</h1>' ); ?>
		<?php endif; ?>

		<div class="thumbnail">
			<?php	the_post_thumbnail('full');
      //ed_school_get_thumbnail( array( 'thumbnail' => 'ed-school-featured-image' ) ); ?>
		</div>
		<?php if ( ! ed_school_page_title_enabled() ) : ?>
			<?php if ( is_single() ) : ?>
				<?php get_template_part( 'templates/entry-meta' ); ?>
			<?php endif; ?>
		<?php endif; ?>
    <?php the_title( '<h2>', '</h2>' ); ?>
    <?php get_template_part( 'templates/entry-meta' ); ?>
		<div class="entry-content">
			<?php the_content(); ?>
		</div>

		<?php wp_link_pages( array(
			'before' => '<nav class="page-nav"><p>' . esc_html__( 'Pages:', 'ed-school' ),
			'after'  => '</p></nav>'
		) ); ?>
		<div class="prev-next-item">
			<div class="left-cell">
				<p class="label"><?php esc_html_e( 'Previous', 'ed-school' ) ?></p>
				<?php previous_post_link( '<i class="icon-long-arrow-left"></i> %link ', '%title', false ); ?>
			</div>
			<div class="right-cell">
				<p class="label"><?php esc_html_e( 'Next', 'ed-school' ) ?></p>
				<?php next_post_link( '%link <i class="icon-long-arrow-right"></i> ', '%title', false ); ?>
			</div>
			<div class="clearfix"></div>
		</div>

		<?php if ( ed_school_get_option( 'archive-single-use-share-this', false ) ): ?>
			<div class="sharebuttons"><div class="info">Comparte esto en redes:</div><div class="btn-s">
        <a href="https://twitter.com/intent/tweet?text=<?php the_title(); ?>&url=<?php the_permalink(); ?>&via=<?php echo get_the_author_meta( 'twitter', 1 ); ?>" class="btn btn-twitter" target="_blank"><i class="fa fa-twitter"></i> <span>Tweet</span></a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=<?php the_permalink(); ?>" class="btn btn-facebook" target="_blank"><i class="fa fa-facebook"></i> <span>Share</span></a>
        <a href="https://plus.google.com/share?url=<?php the_permalink(); ?>" class="btn btn-google"><i class="fa fa-google-plus" target="_blank"></i> <span>Plus 1</span></a>
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=<?php the_permalink(); ?>&title=<?php the_title(); ?>&source=<?php the_title(); ?>" class="btn btn-linkedin"><i class="fa fa-linkedin" target="_blank"></i> <span>Link</span></a>
        <a href="https://pinterest.com/pin/create/button/?url=<?php the_permalink(); ?>&description=<?php bloginfo('description'); ?>&media=<?php echo $image[0]; ?>" class="btn btn-pinterest" target="_blank"><i class="fa fa-pinterest"></i> <span>Pin</span></a>
		</div></div>
		<?php endif; ?>

		<?php $author_meta = get_the_author_meta( 'description' ); ?>
		<?php if ($author_meta) : ?>
		<div class="author-info">
			<div class="author-avatar">
				<a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' )) ); ?>">
					<?php echo get_avatar( get_the_author_meta( 'ID' ), apply_filters( 'ed_school_author_bio_avatar_size', 90 ) ); ?>
				</a>
			</div>
			<div class="author-description">
				<div class="author-tag"><?php echo esc_html__( 'Author', 'ed-school' ); ?></div>
				<h2 class="author-title"><?php echo get_the_author(); ?></h2>
				<p class="author-bio">
					<?php the_author_meta( 'description' ); ?>
				</p>
			</div>
		</div>
		<?php endif; ?>

		<section id="respond">
			<div class="fb-comments" data-href="<?php _e($current_url); ?>" data-width="100%" data-numposts="10"></div>
		</section>
		
		<?php // comments_template( '/templates/comments.php' ); ?>
	</div>
<?php endwhile; ?>