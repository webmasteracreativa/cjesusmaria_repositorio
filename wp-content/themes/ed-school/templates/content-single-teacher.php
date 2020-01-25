<?php while ( have_posts() ) : the_post(); ?>
	<div <?php post_class(); ?>>
		<div class="thumbnail">
			<?php ed_school_get_thumbnail( array( 'thumbnail' => 'ed-school-square' ) ); ?>
		</div>
		<?php if ( ! ed_school_get_option( 'archive-single-use-page-title', false ) ) : ?>
			<?php the_title( '<h1>', '</h1>' ); ?>
		<?php endif; ?>
		<div class="teacher-meta-data">

			<?php $location = ed_school_get_rwmb_meta( 'location', $post->ID ); ?>
			<?php if ( $location ) : ?>
				<div class="location">
					<i class="icon-edplaceholder"></i>
					<?php echo esc_html( $location ); ?>
				</div>
			<?php endif; ?>
			<?php $job_title = ed_school_get_rwmb_meta( 'job_title', $post->ID ); ?>
			<?php if ( $job_title ) : ?>
				<div class="job-title">
					<i class="icon-edbook2"></i>
					<?php echo esc_html( $job_title ); ?>
				</div>
			<?php endif; ?>
		</div>

		<?php the_content(); ?>
		<?php $social = ed_school_get_rwmb_meta( 'social_meta', $post->ID ); ?>
		<?php if ( $social ) : ?>
			<div class="social">
				<div class="text"><?php esc_html_e( 'Meet me on', 'ed-school' ); ?></div>
				<?php echo do_shortcode( $social ); ?>
			</div>
		<?php endif; ?>
		<?php //comments_template( '/templates/comments.php' ); ?>
	</div>
<?php endwhile; ?>
