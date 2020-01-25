<?php
$theme_location = 'primary_navigation';

if ( has_nav_menu( 'mobile_navigation' ) ) {
	$theme_location = 'mobile_navigation';
}

$defaults = array(
	'theme_location' => $theme_location,
	'menu_class'     => ed_school_class( 'respmenu' ),
	// 'container_class' => ed_school_class( 'main-menu-container' ),
	'depth'          => 3,
	'fallback_cb'    => false,
	'walker'         => new Ed_School_Mobile_Menu_Walker()
);

$logo     = ed_school_get_option( 'respmenu-logo', array() );
$logo_url = isset( $logo['url'] ) && $logo['url'] ? $logo['url'] : '';

if ( ! $logo_url ) {
	$logo     = ed_school_get_option( 'logo', array() );
	$logo_url = isset( $logo['url'] ) && $logo['url'] ? $logo['url'] : '';
}

$respmenu_display_switch     = ed_school_get_option( 'respmenu-display-switch-img', array() );
$respmenu_display_switch_url = isset( $respmenu_display_switch['url'] ) && $respmenu_display_switch['url'] ? $respmenu_display_switch['url'] : '';

?>
<div id="wh-mobile-menu" class="respmenu-wrap">
	<div class="respmenu-header">
		<?php if ( $logo_url ) : ?>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="respmenu-header-logo-link">
				<img src="<?php echo esc_url( $logo_url ); ?>" class="respmenu-header-logo" alt="mobile-logo">
			</a>
		<?php else: ?>
			<div class="<?php echo ed_school_class( 'logo' ); ?>">
				<h1 class="site-title">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
				</h1>

				<h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
			</div>
		<?php endif; ?>
		<div class="respmenu-open">
			<?php if ( $respmenu_display_switch_url ) : ?>
				<img src="<?php echo esc_url( $respmenu_display_switch_url ); ?>" alt="mobile-menu-display-switch">
			<?php else: ?>
				<hr>
				<hr>
				<hr>
			<?php endif; ?>
		</div>
	</div>
	<?php wp_nav_menu( $defaults ); ?>
</div>
