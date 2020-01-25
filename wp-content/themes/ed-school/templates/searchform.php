<form role="search" method="get" class="search-form form-inline" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<input type="search" value="<?php if ( is_search() ) { echo get_search_query(); } ?>" name="s" class="search-field" placeholder="<?php esc_html_e( 'Search', 'ed-school' ); ?>">
	<label class="hidden"><?php esc_html_e( 'Search for:', 'ed-school' ); ?></label>
	<button type="submit" class="search-submit"><img src="<?php echo get_template_directory_uri() . '/assets/img/icon-search.png'; ?>" alt="search-icon"/></button>
</form>
