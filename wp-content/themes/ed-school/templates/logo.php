<?php
$logo_url   = ed_school_get_logo_url();
$logo_width = ed_school_get_option( 'logo-width-exact', '' );

if ( $logo_width && isset( $logo_width['width'] ) ) {
	$logo_width = (int) $logo_width['width'] ? (int) $logo_width['width'] : '';
}

?>
<?php if ( $logo_url ): ?>
	<div class="<?php echo ed_school_class( 'logo' ); ?>">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<img width="<?php echo esc_attr( $logo_width ); ?>" src="<?php echo esc_url( $logo_url ); ?>" alt="logo">
		</a>
	</div>
<?php else: ?>
	<div class="<?php echo ed_school_class( 'logo' ); ?>">
		<h1 class="site-title">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
		</h1>

		<h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
	</div>
<?php endif; ?>
