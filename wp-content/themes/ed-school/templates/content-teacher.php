<?php global $post_id; ?>
<div class="teacher one third wh-padding">
	<div class="thumbnail">
		<?php ed_school_get_thumbnail( array( 'thumbnail' => 'ed-school-medium' ) ); ?>
	</div>
	<div class="item">
		<h5 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h5>
		<?php $job_title = ed_school_get_rwmb_meta( 'job_title', $post_id ); ?>
		<?php if ( $job_title ) : ?>
			<div class="job-title"><?php echo esc_html( $job_title ); ?></div>
		<?php endif; ?>
		<?php $summary = ed_school_get_rwmb_meta( 'summary', $post_id ); ?>
		<?php if ( $summary ) : ?>
			<div
				class="summary"><?php echo wp_trim_words( do_shortcode( $summary ), apply_filters( 'ed_school_teacher_summary_word_count', 10 ) ); ?></div>
		<?php else: ?>
			<div class="summary"><?php echo do_shortcode( get_the_excerpt() ); ?></div>
		<?php endif; ?>
		<?php $social = ed_school_get_rwmb_meta( 'social_meta', $post_id ); ?>
		<?php if ( $social ) : ?>
			<div class="social">
				<div class="text"><?php esc_html_e( 'Meet us on:', 'ed-school' ); ?></div>
				<?php echo do_shortcode( $social ); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
