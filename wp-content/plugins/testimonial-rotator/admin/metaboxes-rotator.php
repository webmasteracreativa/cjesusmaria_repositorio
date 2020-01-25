<?php
	
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

/* SHORTCODE DISPLAY HELPER */
function testimonial_rotator_shortcode_metabox()
{
	global $post;
	
	echo '
		<b>' . __('Base Rotator', 'testimonial-rotator') . '</b><br />
		[testimonial_rotator id="' . $post->ID . '"]<br /><br />
		
		<b>' . __('List All Testimonials', 'testimonial-rotator') . '</b><br />
		[testimonial_rotator id="' . $post->ID . '" format="list"]<br /><br />
		
		<b>' . __('Limit Results to 10 and list', 'testimonial-rotator') . '</b><br />
		[testimonial_rotator id="' . $post->ID . '" format="list" limit="10" paged="1" prev_next="1"]<br /><br />
		
		<b>' . __('Randomize Testimonials', 'testimonial-rotator') . '</b><br />
		[testimonial_rotator id="' . $post->ID . '" shuffle="true"]<br /><br />	
		
		<b>' . __('Show Aggregate Rating as Stars', 'testimonial-rotator') . '</b><br />
		[testimonial_rotator_rating id="' . $post->ID . '"]<br /><br />	
		
		<b>' . __('Show Aggregate Rating as Number', 'testimonial-rotator') . '</b><br />
		[testimonial_rotator_rating id="' . $post->ID . '" return="rating"]<br /><br />	
	';
}


/* TESTIMONIAL ROTATOR EFFECTS AND TIMING */
function testimonial_rotator_metabox_effects()
{
	global $post;

	$timeout				= (int) get_post_meta( $post->ID, '_timeout', true );
	$speed					= (int) get_post_meta( $post->ID, '_speed', true );
	$fx						= get_post_meta( $post->ID, '_fx', true );
	$shuffle				= get_post_meta( $post->ID, '_shuffle', true );
	$verticalalign			= get_post_meta( $post->ID, '_verticalalign', true );
	$prevnext				= get_post_meta( $post->ID, '_prevnext', true );
	$limit					= (int) get_post_meta( $post->ID, '_limit', true );
	$itemreviewed			= get_post_meta( $post->ID, '_itemreviewed', true );
	$template				= get_post_meta( $post->ID, '_template', true );
	$img_size				= get_post_meta( $post->ID, '_img_size', true );
	$title_heading			= get_post_meta( $post->ID, '_title_heading', true );
	
	$hidefeaturedimage		= get_post_meta( $post->ID, '_hidefeaturedimage', true );
	$hide_microdata			= get_post_meta( $post->ID, '_hide_microdata', true );
	$hide_title				= get_post_meta( $post->ID, '_hide_title', true );
	$hide_stars				= get_post_meta( $post->ID, '_hide_stars', true );
	$hide_body				= get_post_meta( $post->ID, '_hide_body', true );
	$hide_author			= get_post_meta( $post->ID, '_hide_author', true );
	
	$available_effects 		= testimonial_rotator_base_transitions();
	$image_sizes 			= get_intermediate_image_sizes();
	
	if(!$timeout) 	{ $timeout = 5; }
	if(!$speed) 	{ $speed = 1; }
	if(!$template) 	{ $template = 'default'; }
	if(!$img_size) 	{ $img_size = 'thumbnail'; }
	if(!$title_heading) 	{ $title_heading = apply_filters('testimonial_rotator_title_heading', 'h2'); }
	
	$available_themes = testimonial_rotator_available_themes();
	?>
	
	<style>
		.hg_slider_column { width: 46%; margin: 0 2%; float: left; } 
		
		/* 680 */
		@media only screen and (max-width: 680px) {
			.hg_slider_column { width: 100%; margin: 0 0 20px 0; float: none; }
		}
	
	</style>
	
	<div class="hg_slider_column">
	<p>
		<select name="fx">
			<?php foreach($available_effects as $available_effect) { ?>
			<option value="<?php echo $available_effect ?>" <?php if($available_effect == $fx) echo " SELECTED"; ?>><?php echo $available_effect ?></option>
			<?php } ?>
		</select>
		<?php _e('Transition Effect', 'testimonial-rotator'); ?>
	</p>
	
	<p>
		<select name="img_size">
			<?php foreach($image_sizes as $image_size) { ?>
			<option value="<?php echo $image_size ?>" <?php if($image_size == $img_size) echo " SELECTED"; ?>><?php echo $image_size ?></option>
			<?php } ?>
		</select>
		<?php _e('Image Size', 'testimonial-rotator'); ?>
	</p>
	
	<p>
		<input type="text" style="width: 45px; text-align: center;" name="timeout" value="<?php echo esc_attr( $timeout ); ?>" maxlength="4" />
		<?php _e('Seconds per Testimonial', 'testimonial-rotator'); ?>
	</p>
	
	<p>
		<input type="text" style="width: 45px; text-align: center;" name="speed" value="<?php echo esc_attr( $speed ); ?>" maxlength="4" />
		<?php _e('Transition Speed (in seconds)', 'testimonial-rotator'); ?>
	</p>
	
	<p>
		<input type="text" style="width: 45px; text-align: center;" name="limit" value="<?php echo esc_attr( $limit ); ?>" maxlength="4" />
		<?php _e('Limit Number of Testimonials', 'testimonial-rotator'); ?>
	</p>
	
	<p>
		<input type="text" style="width: 45px; text-align: center;" name="title_heading" value="<?php echo esc_attr( $title_heading ); ?>" maxlength="12" />
		<?php _e('Element for Title Field', 'testimonial-rotator'); ?>
	</p>
	
	</div>
	
	<div class="hg_slider_column">
	<p>
		<input id="testimonial_rotator_shuffle_check" type="checkbox" name="shuffle" value="1" <?php if($shuffle) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_shuffle_check"><?php _e('Randomize Testimonials', 'testimonial-rotator'); ?></label>
	</p>
	
	<p>
		<input id="testimonial_rotator_align_check" type="checkbox" name="verticalalign" value="1" <?php if($verticalalign) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_align_check"><?php _e('Vertical Align (Center Testimonials Height)', 'testimonial-rotator'); ?></label>
	</p>
	
	<p>
		<input id="testimonial_rotator_prevnext_check" type="checkbox" name="prevnext" value="1" <?php if($prevnext) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_prevnext_check"><?php _e('Show Previous/Next Buttons', 'testimonial-rotator'); ?></label>
	</p>
	
	<p>
		<input id="testimonial_rotator_featimg_check" type="checkbox" name="hidefeaturedimage" value="1" <?php if($hidefeaturedimage) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_featimg_check"><?php _e('Hide Featured Image', 'testimonial-rotator'); ?></label>
	</p>
	
	<p>
		<input id="testimonial_rotator_hidetitle_check" type="checkbox" name="hide_title" value="1" <?php if($hide_title) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_hidetitle_check"><?php _e('Hide Title', 'testimonial-rotator'); ?></label>
	</p>
	
	<p>
		<input id="testimonial_rotator_hidestars_check" type="checkbox" name="hide_stars" value="1" <?php if($hide_stars) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_hidestars_check"><?php _e('Hide Stars', 'testimonial-rotator'); ?></label>
	</p>
	
	<p>
		<input id="testimonial_rotator_hidebody_check" type="checkbox" name="hide_body" value="1" <?php if($hide_body) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_hidebody_check"><?php _e('Hide Body', 'testimonial-rotator'); ?></label>
	</p>
	
	<p>
		<input id="testimonial_rotator_hideauthor_check" type="checkbox" name="hide_author" value="1" <?php if($hide_author) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_hideauthor_check"><?php _e('Hide Author', 'testimonial-rotator'); ?></label>
	</p>
	
	<p>
		<input id="testimonial_rotator_microdata_check" type="checkbox" name="hide_microdata" value="1" onchange="if(this.checked) { jQuery('#item-reviewed-p').slideUp(); } else { jQuery('#item-reviewed-p').slideDown(); }" <?php if($hide_microdata) echo " CHECKED"; ?> />
		<label for="testimonial_rotator_microdata_check"><?php _e('Hide Microdata (hReview)', 'testimonial-rotator'); ?></label>
	</p>
	
	</div>
	<div class="clear"></div>
	
	<p id="item-reviewed-p" style="border-top: solid 1px #ccc; margin-top: 15px; padding-top: 15px;<?php if($hide_microdata) echo " display:none;"; ?>">
		<label for="itemreviewed"><?php _e('Name of Item Being Reviewed:', 'testimonial-rotator'); ?></label><br />
		<small><?php _e("Company Name, Product Name, etc.", 'testimonial-rotator'); ?> (<?php _e("not visible on your website, used for search engines", 'testimonial-rotator'); ?>)</small><br />
		<input type="text" style="width: 80%;" id="itemreviewed" name="itemreviewed" value="<?php echo esc_attr( $itemreviewed ); ?>" />
	</p>

	<div style="padding: 15px 0; margin: 15px 0; border-top: solid 1px #ccc; border-bottom: solid 1px #ccc;">
		
		<style>
			.testimonial-rotator-template-selector-wrap { border: solid 5px #ccc; } 
			.tr_template_selected { border: solid 5px #bee483; } 
			#testimonial-rotator-templates a:focus { box-shadow: none; } 
		</style>
		
		<script>
			jQuery(document).ready(function() 
			{
				jQuery('.testimonial-rotator-template-selector-wrap a').on('click', function() 
				{
					jQuery('.testimonial-rotator-template-selector-wrap').removeClass('tr_template_selected');
					jQuery('#testimonial_rotator_template').val( jQuery(this).data('slug') );
					jQuery(this).parent('.testimonial-rotator-template-selector-wrap').addClass('tr_template_selected');
				});
			});
		</script>
	
		<p>
			<strong><?php _e('Select a Theme:', 'testimonial-rotator'); ?></strong><br>
		</p>
		
		<div id="testimonial-rotator-templates">
		
			<?php foreach( $available_themes as $theme_slug => $available_theme ) { if( !isset($available_theme['icon']) ) $available_theme['icon'] = TESTIMONIAL_ROTATOR_URI . 'templates/' . $theme_slug. '/icon.png'; ?>
				<div class="testimonial-rotator-template-selector-wrap <?php if($template == $theme_slug) echo "tr_template_selected"; ?>" style="float: left; text-align: center; padding: 10px; margin: 10px; min-height: 100px;">
					<a href="javascript:;" class="testimonial-rotator-template-selector" data-slug="<?php echo esc_attr($theme_slug); ?>"><img src="<?php echo $available_theme['icon']; ?>" style="width: 155px;"></a><br>
					<b><?php echo $available_theme['title']; ?></b> - <a href="javascript:;" class="testimonial-rotator-template-selector" data-slug="<?php echo esc_attr($theme_slug); ?>"><?php echo __('Use', 'testimonial-rotator'); ?></a>
				</div>
			<?php } ?>
			
			<div style="clear:both;"></div>
			<input type="hidden" name="template" id="testimonial_rotator_template" value="<?php echo $template; ?>">
		</div>
		
	</div>

	<?php if($post->post_name) { ?>
	<p>
		<strong><?php _e('Make a Custom Template:', 'testimonial-rotator'); ?></strong><br>
		<?php _e('To create custom layouts for this rotator create a file called', 'testimonial-rotator'); ?>
		<b>loop-testimonial-<?php echo $post->post_name; ?>.php</b> <?php _e('and place it in your theme.', 'testimonial-rotator'); ?>
	</p>
	<?php } ?>

	<?php	
}

/* SAVE TESTIMONIAL ROTATOR META DATA */
function testimonial_rotator_save_rotator_meta( $post_id, $post ) 
{
	global $post;  
	if( isset( $_POST ) && isset( $post->ID ) )  
    {   
		
		// INPUTS
		if ( isset( $_POST['fx'] ) ) 				{ update_post_meta( $post->ID, '_fx', strip_tags( $_POST['fx'] ) ); }
		if ( isset( $_POST['timeout'] ) ) 			{ update_post_meta( $post->ID, '_timeout', strip_tags( $_POST['timeout'] ) ); }
		if ( isset( $_POST['speed'] ) ) 			{ update_post_meta( $post->ID, '_speed', strip_tags( $_POST['speed'] ) ); }
		if ( isset( $_POST['limit'] ) ) 			{ update_post_meta( $post->ID, '_limit', strip_tags( $_POST['limit'] ) ); }
		if ( isset( $_POST['itemreviewed'] ) ) 		{ update_post_meta( $post->ID, '_itemreviewed', strip_tags( $_POST['itemreviewed'] ) ); }
		if ( isset( $_POST['template'] ) ) 			{ update_post_meta( $post->ID, '_template', strip_tags( $_POST['template'] ) ); }
		if ( isset( $_POST['img_size'] ) ) 			{ update_post_meta( $post->ID, '_img_size', strip_tags( $_POST['img_size'] ) ); }
		if ( isset( $_POST['title_heading'] ) ) 	{ update_post_meta( $post->ID, '_title_heading', strip_tags( $_POST['title_heading'] ) ); }


		// CHECKBOXES
		update_post_meta( $post->ID, '_shuffle', isset( $_POST['shuffle']) ? 1 : 0 );
		update_post_meta( $post->ID, '_verticalalign', isset( $_POST['verticalalign']) ? 1 : 0 );
		update_post_meta( $post->ID, '_prevnext', isset( $_POST['prevnext']) ? 1 : 0 );
		update_post_meta( $post->ID, '_hidefeaturedimage', isset( $_POST['hidefeaturedimage']) ? 1 : 0 );
		update_post_meta( $post->ID, '_hide_microdata', isset( $_POST['hide_microdata']) ? 1 : 0 );
		update_post_meta( $post->ID, '_hide_title', isset( $_POST['hide_title']) ? 1 : 0 );
		update_post_meta( $post->ID, '_hide_stars', isset( $_POST['hide_stars']) ? 1 : 0 );
		update_post_meta( $post->ID, '_hide_body', isset( $_POST['hide_body']) ? 1 : 0 );
		update_post_meta( $post->ID, '_hide_author', isset( $_POST['hide_author']) ? 1 : 0 );
	}
}


function testimonial_rotator_testimonial_count_meta()
{
	global $post;
	$originalpost = $post;
	 
	$id = $post->ID;
	
	$testimonials_args = array(
								'post_type' => 'testimonial',
								'order' => 'ASC',
								'orderby' => "menu_order",
								'posts_per_page' => -1,
								'meta_query' => testimonial_rotator_meta_query( $id )
							);
							
	// GET ROTATOR SLIDES
	$slide_query = new WP_Query( $testimonials_args );

	if ( $slide_query->have_posts() )
	{
		echo "<ol>";
		while ( $slide_query->have_posts() ) 
		{
			$slide_query->the_post();
			echo "<li><a href='post.php?post=" . get_the_id() . "&action=edit'>" . get_the_title() . "</a></li>";
		}
		echo "</ol>";
		
		echo "<a href='edit.php?post_type=testimonial&rotator_id=" . $id . "' class='button'>" . __('View in Edit List', 'testimonial-rotator') . "</a>";
	}
	else
	{
		echo "<p>" . __('No testimonials have been associated to this rotator yet.', 'testimonial-rotator') . "</p>";
	}
	
	wp_reset_postdata();
	$post = $originalpost;
}

