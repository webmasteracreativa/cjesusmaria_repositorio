<?php

if ( ed_school_get_child_pages() OR $post->post_parent > 0 ) { ?>

	<nav class="site-nav children-links clearfix">

		<ul>
			<?php

			$args = array(
				'child_of' => ed_school_get_top_ancestor_id(),
				'title_li' => ''
			);

			?>

			<?php wp_list_pages($args); ?>
		</ul>
	</nav>

<?php } ?>