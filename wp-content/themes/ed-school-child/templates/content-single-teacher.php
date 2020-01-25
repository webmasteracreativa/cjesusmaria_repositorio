<?php while ( have_posts() ) : the_post(); ?>
	<div <?php post_class(); ?>>
		<div class="thumbnail center">
			<?php echo get_the_post_thumbnail( $post->ID, 'full' ); ?>
		</div>
			<?php the_title( '<blockquote><h4>', '</h4></blockquote>' ); ?>
		<div class="teacher-meta-data">
			<?php $job_title = ed_school_get_rwmb_meta( 'job_title', $post->ID ); ?>
			<?php if ( $job_title ) : ?>
				<div class="job-title">
					<i class="Contacto-uniF10A"></i>
					<?php echo esc_html( $job_title ); ?>
				</div>
			<?php endif; ?>
			<?php $location = ed_school_get_rwmb_meta( 'location', $post->ID ); ?>
			<?php if ( $location ) : ?>
				<div class="location">
					<i class="Col-uniF15A"></i> Responsable de: <?php echo esc_html( $location ); ?>
				</div>
			<?php endif; ?>
		</div>
    <?php $columna_1 = '[vc_row el_id="teacher_b"][vc_column][ultimate_info_table design_style="design06" color_scheme="blue" package_heading="Áreas / Asignaturas" package_sub_heading="en este horario puedo atender padres de familia" icon_type="selector" icon="Col-uniF1EE" icon_size="60" icon_color="#333333" el_class="horario_profesor"]';
    			$columna_2 = '[vc_row el_id="teacher_b"][vc_column width="1/2"][ultimate_info_table design_style="design06" color_scheme="blue" package_heading="Áreas / Asignaturas" package_sub_heading="soy profesor/a de estas asignaturas" icon_type="selector" icon="Col-uniF123" icon_size="60" icon_color="#333333" el_class="horario_profesor"]';
    			$columna_m = '[/ultimate_info_table][/vc_column][vc_column width="1/2"][ultimate_info_table design_style="design06" color_scheme="blue" package_heading="Horario de atención" package_sub_heading="en este horario puedo atender padres de familia" icon_type="selector" icon="Col-uniF1EE" icon_size="60" icon_color="#333333" el_class="horario_profesor"]';
    			$columna_f = '[/ultimate_info_table][/vc_column][/vc_row]';
    ?>
		<?php the_content(); ?>
		<?php $social = ed_school_get_rwmb_meta( 'social_meta', $post->ID ); ?>
		<?php $summary = ed_school_get_rwmb_meta( 'summary', $post->ID ); ?>
		<?php if ( $social ) : ?>
			<div class="info-teacher">
				<?php if ($summary == null){
        					echo do_shortcode( $columna_1 . $social . $columna_f);
        		}	else {
        					echo do_shortcode( $columna_2 . $summary . $columna_m  . $social . $columna_f);
            } ?>
			</div>
		<?php endif; ?>
		<?php //comments_template( '/templates/comments.php' ); ?>
	</div>
<?php endwhile; ?>
