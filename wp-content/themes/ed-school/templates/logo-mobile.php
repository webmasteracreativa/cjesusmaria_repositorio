<?php

$respmenu_use                     = (int) ed_school_get_option( 'respmenu-use', 1 );
$respmenu_show_start              = (int) ed_school_get_option( 'respmenu-show-start', 767 );
$respmenu_logo                    = ed_school_get_option( 'respmenu-logo', array() );
$respmenu_logo_url                = isset( $respmenu_logo['url'] ) && $respmenu_logo['url'] ? $respmenu_logo['url'] : '';
$respmenu_display_switch_logo     = ed_school_get_option( 'respmenu-display-switch-img', array() );
$respmenu_display_switch_logo_url = isset( $respmenu_display_switch_logo['url'] ) && $respmenu_display_switch_logo['url'] ? $respmenu_display_switch_logo['url'] : '';

if ( $respmenu_use && $respmenu_show_start ) {





}
