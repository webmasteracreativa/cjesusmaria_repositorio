jQuery(document).ready(function() {
  
  	ts_build_hide_filter();

  	//In case you want all entries to hide when the page loads
	//jQuery('.ls-05_project-5').hide();	
	//To load a particular category
	//jQuery('#ls-01-sales-team').click();
	
});
	
function ts_build_hide_filter() {


	jQuery.noConflict();

	jQuery('#ls-filter-nav #ls-all').addClass('ls-current-li');
	jQuery("#ls-filter-nav > li").click(function(){
	    ls_show(this.id);
	}).children().click(function(e) {
	  return false;
	});

	jQuery("#ls-filter-nav > li > ul > li").click(function(){
	    ls_show(this.id);
	});

}


//FILTER CODE
function ls_show(category) {	 
	
	
	if (category == "ls-all") {
        jQuery('#ls-filter-nav > li').removeClass('ls-current-li');
        jQuery('#ls-filter-nav #ls-all').addClass('ls-current-li');
        jQuery('.lshowcase-filter-active').show(1400,'easeInOutExpo');
		}
	
	else {
		
		jQuery('#ls-filter-nav > li').removeClass('ls-current-li');
   		jQuery('#ls-filter-nav #' + category).addClass('ls-current-li');  
		jQuery('.lshowcase-filter-active.' + category).show(1400,'easeInOutExpo');
		jQuery('.lshowcase-filter-active:not(.'+ category+')').hide(800,'easeInOutExpo');

	}

	//hack to solve menu left open on touch devices
	/*

		jQuery('ul li ul li.ls-current-li')
		.parent()
		.hide()
		.parent()
		.on('click', function(){ 
			jQuery(this).addClass('ls-current-li')
			.children().show(); 
		});

	*/
	
}


jQuery(document).ajaxSuccess(function() {
  
  	ts_build_hide_filter();
	
});