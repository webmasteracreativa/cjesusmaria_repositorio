<?php get_template_part( 'templates/head' ); ?>
<?php if (is_single()): ?> <link rel='stylesheet' id='teacher-css' href='/wp-content/plugins/Ultimate_VC_Addons/assets/min-css/pricing.min.css?ver=3.16.23' type='text/css' media='all' /> <?php endif; ?>
<?php $rtl = ed_school_get_option( 'is-rtl', false ); ?>
<body <?php body_class(); ?><?php if ($rtl): ?> dir="<?php echo esc_attr('rtl'); ?>"<?php endif; ?>>
	<?php get_template_part( 'templates/header-mobile' ); ?>
	<?php get_template_part( 'templates/header' ); ?>
<a class="btn-pagofix" href="https://www.pagosvirtualesavvillas.com.co/personal/pagos/5216">Pago en línea</a>