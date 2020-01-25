<?php if ( function_exists( 'breadcrumb_trail' ) ): ?>
	<div class="<?php echo ed_school_class( 'breadcrumbs-bar' ); ?>">
		<div class="<?php echo ed_school_class( 'container' ); ?>">
			<div class="<?php echo ed_school_class( 'breadcrumbs-grid-wrapper' ); ?>">
				<div class="<?php echo ed_school_class( 'breadcrumbs' ); ?>">
					<?php breadcrumb_trail( array( 'show_browse' => false ) ); ?>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>
