<?php get_template_part( 'templates/head' ); ?>
<?php $rtl = ed_school_get_option( 'is-rtl', false ); ?>
<body <?php body_class('boxed'); ?><?php if ($rtl): ?> dir="<?php echo esc_attr('rtl'); ?>"<?php endif; ?>>
<?php get_template_part( 'templates/header-mobile' ); ?>
	<div class="wh-main-wrap">
		<?php get_template_part( 'templates/header' ); ?>
