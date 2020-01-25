<?php
// add shortcode generator page
function lshowcase_shortcode_page_add()
{
	$menu_slug = 'edit.php?post_type=lshowcase';
	$submenu_page_title = 'Shortcode Generator';
	$submenu_title = 'Shortcode Generator';
	$capability = 'manage_options';
	$submenu_slug = 'lshowcase_shortcode';
	$submenu_function = 'lshowcase_shortcode_page';
	$defaultp = add_submenu_page($menu_slug, $submenu_page_title, $submenu_title, $capability, $submenu_slug, $submenu_function);
	add_action($defaultp, 'lshowcase_enqueue_admin_js' );
}

function lshowcase_enqueue_admin_js()
{
	wp_deregister_script( 'lshowcaseadmin' );
	wp_register_script( 'lshowcaseadmin', plugins_url( '/js/shortcode-builder.js', __FILE__) , array(
		'jquery'
	));
	wp_enqueue_script( 'lshowcaseadmin' );


wp_deregister_style( 'lshowcase-admin' );
  wp_register_style( 'lshowcase-admin', plugins_url( '/css/admin.css', __FILE__) , array() , false, false);
  wp_enqueue_style( 'lshowcase-admin' );


	wp_deregister_style( 'lshowcase-main-style' );
	wp_register_style( 'lshowcase-main-style', plugins_url( '/styles.css', __FILE__) , array() , false, false);
	wp_enqueue_style( 'lshowcase-main-style' );



    wp_deregister_style( 'lshowcase-fontawesome' );
  wp_register_style( 'lshowcase-fontawesome', plugins_url( '/css/font-awesome/css/font-awesome.css', __FILE__) , array() , false, false);
  wp_enqueue_style( 'lshowcase-fontawesome' );

	// in javascript, object properties are accessed as ajax_object.ajax_url, ajax_object.we_value

	wp_localize_script( 'lshowcaseadmin', 'ajax_object', array(
		'ajax_url' => admin_url( 'admin-ajax.php' )
	));
	wp_deregister_script( 'lshowcase-bxslider' );
	wp_register_script( 'lshowcase-bxslider', plugins_url( '/bxslider/jquery.bxslider.min.js', __FILE__) , array(
		'jquery'
	) , false, false);
	wp_enqueue_script( 'lshowcase-bxslider' );
	wp_deregister_style( 'lshowcase-bxslider-style' );
	wp_register_style( 'lshowcase-bxslider-style', plugins_url( '/bxslider/jquery.bxslider.css', __FILE__) , array() , false, false);
	wp_enqueue_style( 'lshowcase-bxslider-style' );
	wp_deregister_script( 'ls-jquery-ui' );
	wp_register_script( 'ls-jquery-ui', plugins_url( '/js/jquery-ui.min.js', __FILE__) , array(
		'jquery'
	) , false, false);
	wp_enqueue_script( 'ls-jquery-ui' );
	wp_deregister_script( 'lshowcase-tooltip' );
	wp_register_script( 'lshowcase-tooltip', plugins_url( '/js/tooltip.js', __FILE__) , array(
		'ls-jquery-ui'
	) , false, false);
	wp_enqueue_script( 'lshowcase-tooltip' );

	wp_deregister_script( 'lshowcase-jgrayscale' );
	wp_register_script( 'lshowcase-jgrayscale', plugins_url( '/js/grayscale.js', __FILE__) , array(
		'jquery'
	) , false, false);
	wp_enqueue_script( 'lshowcase-jgrayscale' );

  wp_deregister_script( 'lshowcase-hide-filter' );
  wp_register_script( 'lshowcase-hide-filter', plugins_url( '/js/filter.js', __FILE__) , array('jquery','jquery-ui-core','jquery-effects-core'), false, false);
  wp_enqueue_script( 'lshowcase-hide-filter' );

  wp_deregister_script( 'lshowcase-enhance-filter' );
  wp_register_script( 'lshowcase-enhance-filter', plugins_url( '/js/filter-enhance.js', __FILE__) , array(
    'jquery'
  ) , false, false);
  wp_enqueue_script( 'lshowcase-enhance-filter' );


  wp_deregister_script( 'lshowcase-isotope' );
  wp_register_script( 'lshowcase-isotope', plugins_url( '/js/isotope.pkgd.min.js', __FILE__ ),array('jquery',),false,false);
  wp_enqueue_script( 'lshowcase-isotope' );

  wp_deregister_script( 'lshowcase-cells-isotope' );
  wp_register_script( 'lshowcase-cells-isotope', plugins_url( '/js/cells-by-row.js', __FILE__ ),array('jquery','lshowcase-isotope'),false,false);
  wp_enqueue_script( 'lshowcase-cells-isotope' );
  
  wp_deregister_script( 'lshowcase-isotope-filter' );
  wp_register_script( 'lshowcase-isotope-filter', plugins_url( '/js/filter-isotope.js', __FILE__ ),array('jquery','lshowcase-isotope','lshowcase-isotope'),false,false);
  wp_enqueue_script( 'lshowcase-isotope-filter' );

}

add_action( 'wp_ajax_lshowcase', 'lshowcase_run_preview' );

function lshowcase_run_preview()
{
	$orderby = $_POST['porder'];
	$category = $_POST['pcategory'];
	$activeurl = $_POST['purl'];
	$style = $_POST['pstyle'];
	$interface = $_POST['pinterface'];
	$tooltip = $_POST['ptooltip'];
	$description = $_POST['pdescription'];
	$limit = $_POST['plimit'];
	$slidersettings = "";
	$img = $_POST['pimg'];
  $class = $_POST['pclass'];
  $filter = $_POST['pfilter'];
  $ids = '';

	$html = build_lshowcase($orderby, $category, $activeurl, $style, $interface, $tooltip, $description, $limit, $slidersettings, $img, $ids, $filter, $class);
	echo $html;
	die(); // this is required to return a proper result
}

function lshowcase_shortcode_page()
{ 
	settings_fields( 'lshowcase-plugin-settings' );
	$options = get_option( 'lshowcase-settings' );

  $s_settings = get_option( 'lshowcase_shortcode_settings', '' );
  $selectedv = array();

  if($s_settings!='') {
    foreach ($s_settings as $key => $value) {
      if(!isset($selectedv[$value['name']])) {
        $selectedv[$value['name']] = $value['value'];
      } else {
        $selectedv[$value['name']] = $selectedv[$value['name']].'|'.$value['value'];
      }
      
    }
  }
	
	?>
	
<h1>Shortcode Generador</h1>
    
     
    <table cellpadding="10" cellspacing="10">
      <tr><td valign="top">
    <div class="postbox" style="width:300px;">
    <form id="shortcode_generator" style="padding:20px;">
           
<p>
        <label for="orderby">Ordenar por:</label>
        <select id="orderby" name="orderby" onChange="lshowcaseshortcodegenerate()">

          <?php
            $current_order = isset($selectedv['orderby']) ? $selectedv['orderby'] : null;
          ?>


            <option value="none" <?php selected($current_order,'none'); ?>>Default (Order Field)</option>
            <option value="title" <?php selected($current_order,'title'); ?>>Título</option>
            <option value="ID" <?php selected($current_order,'ID'); ?>>ID</option>
            <option value="date" <?php selected($current_order,'date'); ?>>Fecha</option>
            <option value="modified" <?php selected($current_order,'modified'); ?>>Modificado</option>
            <option value="rand" <?php selected($current_order,'rand'); ?>>Aleatorio</option>
        </select></p>



 	 <p><label for="limit">Número de imágenes a mostrar:</label>

 <?php $current_limit = isset($selectedv['limit']) ? $selectedv['limit'] : '0'; ?>

    <input size="3" id="limit" name="limit" type="text" value="<?php echo $current_limit; ?>" onChange="lshowcaseshortcodegenerate()" /><span class="howto"> (Déjelo en blanco o 0 para mostrar todo)</span></p>

  <?php $multiple = isset($selectedv['multiple']) ? 'checked' : ''; ?>          

     Selección de múltiples categorías <input name="multiple" type="checkbox" id="multiple" onChange="lshowcaseshortcodegenerate()" value="multiple" <?php echo $multiple; ?>>

<span id="multiplemsg" class="howto"></span>


<p><label for="category">Categoría</label>:

<?php

          $current_category = isset($selectedv['category']) ? $selectedv['category'] : null;
          if($current_category != null) {
            $current_category = explode('|',$current_category);
            
          }

          $ismultiple = isset($selectedv['multiple']) ? 'multiple' : '';

          ?>

     
        <select id="category" name="category" onChange="lshowcaseshortcodegenerate()" <?php echo $ismultiple ; ?>>
          <option <?php if(is_array($current_category) && in_array("0", $current_category)) { echo "selected"; } ?> value="0" >Todo</option>
        
  <?php


	$terms = get_terms( "lshowcase-categories" );
	$count = count($terms);
	if ($count > 0) {
		foreach($terms as $term) {
      $select_echo = '';
      if(is_array($current_category) && in_array($term->slug, $current_category)) { $select_echo = "selected"; }
			echo "<option ".$select_echo." value='" . $term->slug . "' >" . $term->name . "</option>";
		}
	}

?></select></p>
 <p>
            <label for="activeurl">URL:
            </label>
        <select id="activeurl" name="activeurl" onChange="lshowcaseshortcodegenerate()">

          <?php
            $acturl = isset($selectedv['singleurl']) ? $selectedv['singleurl'] : 'new';
            ?>


          <option value="inactive" <?php selected($acturl,'inactive'); ?>>Inactivo</option>
          <option value="new" <?php selected($acturl,'new'); ?>>Abrir en nueva ventana</option>
          <option value="new_nofollow" <?php selected($acturl,'new_nofollow'); ?>>Abrir en nueva ventana (nofollow)</option>
          <option value="same" <?php selected($acturl,'same'); ?>>Abrir en la misma ventana</option>
        </select></p>
         
  
  
   <p>
     <label for="style">Style:</label>
        
        <select id="style" name="style" onChange="lshowcaseshortcodegenerate()">

          <?php
            $style = isset($selectedv['style']) ? $selectedv['style'] : 'normal';
            ?>


          <?php
	$stylesarray = lshowcase_styles_array();
	foreach($stylesarray as $option => $key) {
?>
          
          <option  <?php selected($style,$option); ?> value="<?php echo $option; ?>"><?php echo $key['description']; ?></option>
          <?php
	} ?>
		</select></p>

		<p>
		     <label for="tooltip">Mostrar Tooltip:</label>
		       
		        <select id="tooltip" name="tooltip" onChange="lshowcaseshortcodegenerate()">

              <?php
            $tooltip = isset($selectedv['tooltip']) ? $selectedv['tooltip'] : 'false';
            ?>
		          
		          <option <?php selected($tooltip,'false'); ?> value="false">No</option> 
		          <option <?php selected($tooltip,'true'); ?> value="true">Si - Mostrar Título</option> 
		          <option <?php selected($tooltip,'true-description'); ?> value="true-description">Si - Mostrar Descripción</option> 
		          
		</select>

		</p>

		<p>
		     <label for="description">Show Info:</label>
		       
		        <select id="description" name="description" onChange="lshowcaseshortcodegenerate()">

               <?php
            $si = isset($selectedv['description']) ? $selectedv['description'] : 'false';
            ?>
		          
		          <option <?php selected($si,'false'); ?> value="false">No</option> 
		          <option <?php selected($si,'true'); ?>  value="true">Mostrar Título Abajo</option> 
		          <option <?php selected($si,'true-description'); ?>  value="true-description">Mostrar Descripción Abajo</option>
               <option <?php selected($si,'true-above'); ?>  value="true-above">Mostrar Título Arriba</option>
                <option <?php selected($si,'true-description-above'); ?> value="true-description-above">Mostrar Descripción Arriba</option>
                 <option <?php selected($si,'true-title-above-description-below'); ?> value="true-title-above-description-below">Mostrar Título Arriba Descripción Abajo</option> 
		            <option <?php selected($si,'true-title-description-below'); ?> value="true-title-description-below">Mostrar Título & Descripción Abajo</option> 

		</select>

		</p>

		

       
        <p>Diseño:

           <?php
            $layout = isset($selectedv['interface']) ? $selectedv['interface'] : 'grid';
            ?>
          
          <select id="interface" name="interface" onChange="lshowcaseshortcodegenerate()">
          <option <?php selected($layout,'grid'); ?> value="grid" selected>Normal Grid</option>
          <option <?php selected($layout,'hcarousel'); ?> value="hcarousel" >Horizontal Carousel</option>
          <option <?php selected($layout,'grid12'); ?> value="grid12" >Responsive Grid - 12 Columnas</option> 
          <option <?php selected($layout,'grid11'); ?> value="grid11" >Responsive Grid - 11 Columnas</option>
          <option <?php selected($layout,'grid10'); ?> value="grid10" >Responsive Grid - 10 Columnas</option>
          <option <?php selected($layout,'grid9'); ?> value="grid9" >Responsive Grid - 9 Columnas</option>
          <option <?php selected($layout,'grid8'); ?> value="grid8" >Responsive Grid - 8 Columnas</option>
          <option <?php selected($layout,'grid7'); ?> value="grid7" >Responsive Grid - 7 Columnas</option> 
          <option <?php selected($layout,'grid6'); ?> value="grid6" >Responsive Grid - 6 Columnas</option> 
          <option <?php selected($layout,'grid5'); ?> value="grid5" >Responsive Grid - 5 Columnas</option>  
          <option <?php selected($layout,'grid4'); ?> value="grid4" >Responsive Grid - 4 Columnas</option>
          <option <?php selected($layout,'grid3'); ?> value="grid3" >Responsive Grid - 3 Columnas</option>
          <option <?php selected($layout,'grid2'); ?> value="grid2" >Responsive Grid - 2 Columnas</option>
          <option <?php selected($layout,'grid1'); ?> value="grid1" >Responsive Grid - 1 Columna</option>     
          
</select></p>

<div id="ls_filter_option">

   <label for="filter">Mostrar menú de filtro:</label>

<select id="filter" name="filter" onChange="lshowcaseshortcodegenerate()">

     <?php
            $filter = isset($selectedv['filter']) ? $selectedv['filter'] : 'false';
            ?>
              
              <option <?php selected($filter,'false'); ?> value="false">No</option> 
              <option <?php selected($filter,'hide'); ?> value="hide">OCultar filtro</option> 
               <option <?php selected($filter,'isotope'); ?> value="isotope">OCultar (Isotope Script)</option> 
              <option <?php selected($filter,'enhance'); ?> value="enhance">Habilitar filtro</option> 

              
    </select>


</div>

<div id="ls_carousel_type">
	<p id="ls_carousel_settings_option" style="display:none;">
		<label for="">Configuración del carrusel: </label>
     <?php
    $carouselset = isset($selectedv['use_defaults']) ? $selectedv['use_defaults'] : '1';
            ?>
		<input name="use_defaults" id="use_defaults" type="radio" value="1" <?php
  checked($carouselset, '1' ); ?> onclick="hidecustomsettings();" />
              Por defecto
                <input <?php
  checked($carouselset, '0' ); ?> name="use_defaults" id="use_defaults" type="radio" value="0" onclick="showcustomsettings();" />
              Personalizar
	</p>
	<div id="ls_carousel_settings" style="display:none; background:#FFF; padding:5px;"> 
		
<table width="100%">
  <tr>
    <?php
    $autoscroll = isset($selectedv['lshowcase_carousel_autoscroll']) ? $selectedv['lshowcase_carousel_autoscroll'] : $options['lshowcase_carousel_autoscroll'];
            ?>
    <td nowrap >Auto Scroll</td>
    <td><select name="lshowcase_carousel_autoscroll" onChange="lshowcaseshortcodegenerate()">
      <option value="true"  <?php
	selected($autoscroll, 'true' ); ?>>Si - Con Pausa</option>
      <option value="ticker"  <?php
	selected($autoscroll, 'ticker' ); ?>>Si - Sin Parar</option>
      <option value="false" <?php
	selected($autoscroll, 'false' ); ?>>No</option>
    </select></td>
  
  
  </table>
  <table width="100%" id="lst_pause_time">
  
  <tr>
     <?php
    $pausetime = isset($selectedv['lshowcase_carousel_pause']) ? $selectedv['lshowcase_carousel_pause'] : $options['lshowcase_carousel_pause'];
            ?>
    <td nowrap >Tiempo de pausa</td>
    <td><input type="text" name="lshowcase_carousel_pause" value="<?php
	echo $pausetime; ?>" onChange="lshowcaseshortcodegenerate()" size="10" /></td>
  </tr><tr><td colspan="2"><span class="howto">La cantidad de tiempo (en ms) entre cada transición automática</span></td>
  </tr>
  </table>
  <table width="100%" id="lst_pause_hover">
  <tr>
     <?php
    $autohover = isset($selectedv['lshowcase_carousel_autohover']) ? $selectedv['lshowcase_carousel_autohover'] : $options['lshowcase_carousel_autohover'];
            ?>
    <td nowrap >Pausar en Hover</td>
    <td><select name="lshowcase_carousel_autohover" onChange="lshowcaseshortcodegenerate()">
      <option value="true" <?php
	selected($autohover, 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($autohover, 'false' ); ?>>No</option>
    </select></td>
  </tr><tr><td colspan="2"><span class="howto">El desplazamiento automático se pausará cuando el mouse pase sobre el grid</span></td>
  </tr>
  
  </table>
  <table width="100%" id="lst_auto_controls">
  
  <tr>

    <?php
    $acontrols = isset($selectedv['lshowcase_carousel_autocontrols']) ? $selectedv['lshowcase_carousel_autocontrols'] : $options['lshowcase_carousel_autocontrols'];
            ?>

    <td nowrap >Controles automáticos</td>
    <td><select name="lshowcase_carousel_autocontrols" onChange="lshowcaseshortcodegenerate()">
      <option value="true" <?php
	selected($acontrols, 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($acontrols, 'false' ); ?>>No</option>
    </select></td>
  </tr><tr><td colspan="2"><span class="howto">Si está activo, se agregarán controles de "Iniciar" / "Parar"</span></td>
  </tr>
  
  </table>
  <table width="100%">
  
  <tr>
    <?php
            $tspeed = isset($selectedv['lshowcase_carousel_speed']) ? $selectedv['lshowcase_carousel_speed'] : $options['lshowcase_carousel_speed'];
            ?>
    <td nowrap >Velocidad de transición:</td>
    <td><input type="text" name="lshowcase_carousel_speed" value="<?php
	echo $tspeed; ?>" onChange="lshowcaseshortcodegenerate()" size="10" /></td>
  </tr><tr><td colspan="2"><span class="howto">Deslice la duración de la transición (en ms - entero) </span></td>
  </tr>
  <tr>
     <?php
            $imargin = isset($selectedv['lshowcase_carousel_slideMargin']) ? $selectedv['lshowcase_carousel_slideMargin'] : $options['lshowcase_carousel_slideMargin'];
            ?>
    <td nowrap >Margen de Imagen:</td>
    <td><input type="text" size="10" name="lshowcase_carousel_slideMargin" value="<?php
	echo $imargin; ?>" onChange="lshowcaseshortcodegenerate()" /></td>
  </tr><tr><td colspan="2"><span class="howto">Margen entre cada imagen (entero)</span></td>
  </tr>
  </table>
  <table width="100%" id="lst_carousel_common_settings">
  <tr>
    <?php
            $infinite = isset($selectedv['lshowcase_carousel_infiniteLoop']) ? $selectedv['lshowcase_carousel_infiniteLoop'] : $options['lshowcase_carousel_infiniteLoop'];
            ?>
    <td nowrap >Loop Infinito:</td>
    <td><select name="lshowcase_carousel_infiniteLoop" onChange="lshowcaseshortcodegenerate()">
      <option value="true" <?php
	selected($infinite , 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($infinite , 'false' ); ?>>No</option>
    </select></td>

  <tr>
    <?php
            $showpager = isset($selectedv['lshowcase_carousel_pager']) ? $selectedv['lshowcase_carousel_pager'] : $options['lshowcase_carousel_pager'];
            ?>
    <td nowrap >Mostrar paginación:</td>
    <td><select name="lshowcase_carousel_pager" onChange="lshowcaseshortcodegenerate()">
      <option value="true" <?php
	selected($showpager, 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($showpager, 'false' ); ?>>No</option>
    </select></td>
  </tr><tr><td colspan="2"><span class="howto">Si está activo, se agregará una paginación.</span></td>
  </tr>
  <tr>

     <?php
            $showcontrols = isset($selectedv['lshowcase_carousel_controls']) ? $selectedv['lshowcase_carousel_controls'] : $options['lshowcase_carousel_controls'];
            ?>

    <td nowrap >Mostrar controles:</td>
    <td><select name="lshowcase_carousel_controls" onChange="lshowcaseshortcodegenerate()">
      <option value="true" <?php
	selected($showcontrols, 'true' ); ?>>Si</option>
      <option value="false" <?php
	selected($showcontrols, 'false' ); ?>>No</option>
    </select></td>
  </tr><tr><td colspan="2"><span class="howto">Si se activan los controles de imagen Activo, "Siguiente" / "Anterior", se agregarán.</span></td>
  </tr>

<?php 
if(isset($options['lshowcase_carousel_mode']) && $options['lshowcase_carousel_mode'] != 'horizontal') {
	?>
<tr>
    <td colspan="2" ><span style="color:red;">Atención: el modo de transición en la configuración no es 'horizontal'. La configuración a continuación será ignorada y solo se mostrará 1 diapositiva a la vez.<span></td>
   
  </tr>
	<?php
}

?>

  <tr>

    <?php
            $mins = isset($selectedv['lshowcase_carousel_minSlides']) ? $selectedv['lshowcase_carousel_minSlides'] : $options['lshowcase_carousel_minSlides'];
            ?>

    <td nowrap >Elementos mínimos:</td>
    <td><input size="10" type="text" name="lshowcase_carousel_minSlides" value="<?php
	echo $mins; ?>" onChange="lshowcaseshortcodegenerate()" /></td>
  </tr><tr><td colspan="2"><span class="howto">El número mínimo de elementos que se mostrarán.</span></td>
  </tr>
  <tr>
    <?php
            $ms = isset($selectedv['lshowcase_carousel_maxSlides']) ? $selectedv['lshowcase_carousel_maxSlides'] : $options['lshowcase_carousel_maxSlides'];
            ?>
    <td nowrap >Elementos Máximos:</td>
    <td><input size="10" type="text" name="lshowcase_carousel_maxSlides" value="<?php
	echo $ms; ?>" onChange="lshowcaseshortcodegenerate()" /></td>
  </tr><tr><td colspan="2"><span class="howto">El número máximo de elementos que se mostrarán. (coloque 0 para permitir que el script calcule el número máximo de diapositivas que se ajustan a la ventana gráfica)</span></td>
  </tr>
  <tr>
     <?php
            $stm = isset($selectedv['lshowcase_carousel_moveSlides']) ? $selectedv['lshowcase_carousel_moveSlides'] : $options['lshowcase_carousel_moveSlides'];
            ?>
    <td nowrap >Elementos al mover:</td>
    <td><input size="10" type="text" name="lshowcase_carousel_moveSlides" value="<?php
	echo $stm; ?>" onChange="lshowcaseshortcodegenerate()" /></td>
  </tr><tr><td colspan="2"><span class="howto">La cantidad de elementos al avanzar en la transición. Si es cero, se usará la cantidad de elementos totalmente visibles.</span></td>
</tr>
</table>



	</div>

	<table width="100%" style="border-top:1px dashed #CCC; margin-top:20px; padding:10px;">

     <?php
            $imgsize = isset($selectedv['lshowcase_image_size_overide']) ? $selectedv['lshowcase_image_size_overide'] : '';
            ?>
<tr>
    <td nowrap >Anular tamaño de imagen:</td>
    <td><input size="10" type="text" name="lshowcase_image_size_overide" value="<?php echo $imgsize; ?>" size="10" onChange="lshowcaseshortcodegenerate()" /></td>
  </tr><tr><td colspan="2"><span class="howto">Déjelo en blanco para usar los valores predeterminados.
En caso de que desee anular la configuración de tamaño de imagen predeterminada, use este campo para poner los valores de ancho y alto en el siguiente formato: ancho, alto
ex. 100,100.
El valor más pequeño prevalecerá si las imágenes no tienen exactamente este tamaño. Las imágenes pueden ser escaladas. (En el diseño de cuadrícula sensible, esta opción no tendrá efecto)</span></td>
</tr>

</table>

<table width="100%" style="border-top:1px dashed #CCC; margin-top:20px; padding:10px;">

 <?php
            $cssclass = isset($selectedv['lshowcase_wrap_class']) ? $selectedv['lshowcase_wrap_class'] : '';
            ?>

<tr>
    <td nowrap >CSS Class:</td>
    <td><input size="10" type="text" name="lshowcase_wrap_class" id="lshowcase_wrap_class" value="<?php echo $cssclass; ?>" size="10" onChange="lshowcaseshortcodegenerate()" /></td>
  </tr><tr><td colspan="2"><span class="howto">Establezca una clase css personalizada para este div de ajuste de diseño</span></td>
</tr>




</table>

</div>

<input type="hidden" id="current_shortcode" value="" />


</form>
    </div>
    </td><td valign="top">
   
     <a class="ls-remember button-primary" onclick="lshowcase_save_shortcode_settings();"><?php echo __('Recordar esta configuración','lshowcase'); ?></a>
        <span class="lshowcase_message_area"></span>



    <h3>Shortcode</h3> 
    <span class="howto">
    Utilice este shortcode para mostrar la lista de elementos en sus publicaciones o páginas. Simplemente copie este fragmento de texto y colóquelo donde desee que se muestre.
    <br> Puedes usar el shortcode <strong>[show-logos]</strong> sin parámetros para usar la última configuración guardada.
    </span>
    <div id="shortcode_div">
       <textarea id="shortcode" style="width:100%; height:55px;"></textarea>
    </div>
    
    <h3>PHP Función</h3>
    <span class="howto">¡Usa esta función PHP para mostrar la lista de elementos directamente en tus archivos de temas!</span>
    <div id="phpcode_div"> 

       <textarea id="phpcode" style="width:100%; height:55px;"></textarea>

    </div>
    
    <h3> Vista previa</h3>
      
	<div id="preview"></div>
    <div id="hcarouselhelp"><i class="fa fa-exclamation-triangle"></i> El diseño del carrusel utiliza Javascript / jQuery. Si el carrusel no se muestra al usar el código breve, lo más probable es que haya un error de javascript en el código de su página que impida que las funciones del carrusel se inicien correctamente. Por lo general, es un conflicto con otros complementos. <br></div>
    

     <a class="ls-remember button-primary" onclick="lshowcase_save_shortcode_settings();"><?php echo __('Remember these settings','lshowcase'); ?></a>
        <span class="lshowcase_message_area"></span>
        <span class="howto"><?php echo __('Haga clic aquí para que la configuración actual se recuerde la próxima vez que visite la página del generador de shortcodes.','lshowcase'); ?></span>

      </td></tr></table>


    
    
<?php
	$options = get_option( 'lshowcase-settings' );
	$mode = isset($options['lshowcase_carousel_mode']) ? "'".$options['lshowcase_carousel_mode']."'" : "'horizontal'";
	$slidewidth = $options['lshowcase_thumb_width'];
	
	$autoscroll = $options['lshowcase_carousel_autoscroll'];
	$pausetime = $options['lshowcase_carousel_pause'];
	$autohover = $options['lshowcase_carousel_autohover'];
	$pager = $options['lshowcase_carousel_pager'];
	$tickerhover = $autohover;
	$ticker = 'false';
	$usecss = 'true';
	$auto = 'true';

	if ($autoscroll == 'false') {
		$auto = 'false';
	}

	if ($autoscroll=='ticker') {
		$ticker = 'true';
		$tickerhover = $autohover;
		$autoscroll = 'true';
		$pager = 'false';
		$auto = 'false';
		
		if ($tickerhover=='true') {
			$usecss = 'false';
		} 
	}

	$autocontrols = $options['lshowcase_carousel_autocontrols'];
	$speed = $options['lshowcase_carousel_speed'];
	$slidemargin = $options['lshowcase_carousel_slideMargin'];
	$loop = $options['lshowcase_carousel_infiniteLoop'];
	$controls = $options['lshowcase_carousel_controls'];
	$minslides = $options['lshowcase_carousel_minSlides'];
	$maxslides = $options['lshowcase_carousel_maxSlides'];
	$moveslides = $options['lshowcase_carousel_moveSlides'];



?>
<script type="text/javascript">

	
	
	function checkslider()
	{
	
		 
		 var layout = document.getElementById( 'interface' ).value;

		 

		if(document.getElementsByName('use_defaults')[1].checked) { 

			
			var slidewidth = <?php echo $slidewidth; ?>;

			var imgwo = document.getElementsByName('lshowcase_image_size_overide')[0].value;
			if (imgwo!="") {

				 var imgwarray = imgwo.split(",");
				 slidewidth = parseInt(imgwarray[0]);
			};

			var autoscroll = document.getElementsByName('lshowcase_carousel_autoscroll')[0].value;
			var pause = parseInt(document.getElementsByName('lshowcase_carousel_pause')[0].value);
			
			var autohover = (document.getElementsByName('lshowcase_carousel_autohover')[0].value === 'true');
			var pager = (document.getElementsByName('lshowcase_carousel_pager')[0].value === 'true');

			

			var tickerhover = autohover;
			var ticker = false;			
			var usecss = true;
			var auto = true;

			var mode = <?php echo $mode; ?>;

			if (autoscroll == 'false') {
				auto = false;
			}

			if (autoscroll=='ticker') {
				ticker = true;
				tickerhover = autohover;
				pager = false;
				auto = false;
				
				if (tickerhover==true) {
					usecss = false;
				} 
			}


			var autocontrols = (document.getElementsByName('lshowcase_carousel_autocontrols')[0].value === 'true');
			var speed = parseInt(document.getElementsByName('lshowcase_carousel_speed')[0].value);
			var slidemargin = parseInt(document.getElementsByName('lshowcase_carousel_slideMargin')[0].value);
			var infiniteloop = (document.getElementsByName('lshowcase_carousel_infiniteLoop')[0].value === 'true');
			
			var controls = (document.getElementsByName('lshowcase_carousel_controls')[0].value === 'true');
			var minslides = parseInt(document.getElementsByName('lshowcase_carousel_minSlides')[0].value);
			var maxslides = parseInt(document.getElementsByName('lshowcase_carousel_maxSlides')[0].value);
			var moveslides = parseInt(document.getElementsByName('lshowcase_carousel_moveSlides')[0].value);

		}


		else {


			 var mode = <?php echo $mode; ?>;
			 var slidewidth = <?php echo $slidewidth; ?>;
			 var auto = <?php echo $auto; ?>;
			 var pause = <?php echo $pausetime; ?>;
			 var autohover = <?php echo $autohover; ?>;
			 var ticker = <?php echo $ticker; ?>;
			 var tickerhover = <?php echo $tickerhover; ?>;
			 var usecss = <?php echo $usecss; ?>;
			 var autocontrols = <?php echo $autocontrols; ?>;
			 var speed = <?php echo $speed; ?>;
			 var slidemargin = <?php echo $slidemargin; ?>;
			 var infiniteloop = <?php echo $loop; ?> ;
			 var pager = <?php echo $pager; ?>;
			 var controls = <?php echo $controls; ?>;		 
			 var minslides = <?php echo $minslides; ?>;
			 var maxslides = <?php echo $maxslides; ?>;
			 var moveslides = <?php echo $moveslides; ?>;
		}
	
	if(layout=="hcarousel" ) {

		 var sliderDiv = jQuery( '.lshowcase-wrap-carousel-0' );

		 if(maxslides==0) {

			 	var view_width = sliderDiv.parent().width();

			 	if(controls == true ) { view_width = view_width-70; }

				 var slider_real = slidemargin + slidewidth;
				 maxslides = Math.floor(view_width/slider_real);

			 }

		sliderDiv.css({display:'block'});
			
		sliderDiv.bxSlider({
		
			auto: auto,		
			pause: pause,
			autoHover: autohover,
			ticker: ticker,
			tickerHover: tickerhover,
			useCSS: usecss,
			autoControls: autocontrols,
			mode: mode,
			speed: speed,
			slideMargin: slidemargin,
			infiniteLoop: infiniteloop,
		    pager: pager, 
			controls: controls,
		    slideWidth: slidewidth,
		    minSlides: minslides,
		    maxSlides: maxslides,
		    moveSlides: moveslides,
		    autoDirection: 'next',	//change to 'prev' if you want to reverse order
		    onSliderLoad: function(currentIndex){ 

		    	var sli = jQuery('.lshowcase-logos .bx-wrapper');
		    	var marg = '0 35px';

		    	if(controls == false ) { marg = 'none'; }

		    	sli.css({
				margin: marg
				}); 

		    	jQuery('.lshowcase-logos').css({
				maxWidth: sli.width()+80
				}); 

           //to align elements in the center in ticker
           /*
          We change the class, becasue the lshowcase-slide has a float:none!important that breaks
          the ticker code. 
           */
             if(ticker) {

              sliderheight = sliderDiv.parent().height();
              console.log(sliderheight);

                      if(sliderheight>0) {
                        sliderDiv.find(".lshowcase-slide")
                        .addClass('lshowcase-ticker-slide')
                        .removeClass('lshowcase-slide')
                        .css("height",sliderheight + 'px');
                      }
            
             }
		    	}  	

			});
		}

		
	}
	
	
	function checktooltip() {
		
	var tooltip = document.getElementById( 'tooltip' ).value;
	
	if(tooltip=="true" || tooltip=="true-description") {
		
			jQuery( '.lshowcase-tooltip' ).tooltip({
			content: function () { return jQuery(this).attr('title') },
    close: function( event, ui ) {
          ui.tooltip.hover(
              function () {
                  jQuery(this).stop(true).fadeTo(400, 1); 
                  //.fadeIn("slow"); // doesn't work because of stop()
              },
              function () {
                  jQuery(this).fadeOut("400", function(){ jQuery(this).remove(); })
              }
          );
        },
			position: {
			my: "center bottom-20",
			at: "center top",
			using: function( position, feedback ) {
			jQuery( this ).css( position );
			jQuery( "<div>" )
			.addClass( "lsarrow" )
			.addClass( feedback.vertical )
			.addClass( feedback.horizontal )
			.appendTo( this );
			}
			}
			});
		}

	}

	function checkgrayscale() {
		
		
		jQuery(".lshowcase-jquery-gray").fadeIn(500);
		
		// clone image
		jQuery('.lshowcase-jquery-gray').each(function(){
			var el = jQuery(this);
			el.css({"position":"absolute"}).wrap("<div class='img_wrapper' style='display: inline-block'>").clone().addClass('ls_img_grayscale').css({"position":"absolute","z-index":"998","opacity":"0"}).insertBefore(el).queue(function(){
				var el = jQuery(this);
				el.parent().css({"width":this.width,"height":this.height});
				el.dequeue();
			});
			this.src = check_ls_grayscale(this.src);
		});
		
		// Fade image 
		jQuery('.lshowcase-jquery-gray').mouseover(function(){
			jQuery(this).parent().find('img:first').stop().animate({opacity:1}, 1000);
		})
		jQuery('.ls_img_grayscale').mouseout(function(){
			jQuery(this).stop().animate({opacity:0}, 1000);
		});		
	
	}

	// Grayscale effect with canvas method
	function check_ls_grayscale(src){

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var imgObj = new Image();
		imgObj.src = src;
		canvas.width = imgObj.width;
		canvas.height = imgObj.height; 
		ctx.drawImage(imgObj, 0, 0); 
		var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for(var y = 0; y < imgPixels.height; y++){
			for(var x = 0; x < imgPixels.width; x++){
				var i = (y * 4) * imgPixels.width + x * 4;
				var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
				imgPixels.data[i] = avg; 
				imgPixels.data[i + 1] = avg; 
				imgPixels.data[i + 2] = avg;
			}
		}
		ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
		return canvas.toDataURL();

    }
	
	
	
	 </script>
     <?php
}

add_action( 'wp_ajax_lshowcase_save_shortcode_data', 'lshowcase_save_shortcode_data');

 function lshowcase_save_shortcode_data() {

    if(isset($_POST['options'])) {
      update_option('lshowcase_shortcode_settings', $_POST['options'] );
      update_option('lshowcase_shortcode', $_POST['shortcode'] );
    }
    
 }

?>