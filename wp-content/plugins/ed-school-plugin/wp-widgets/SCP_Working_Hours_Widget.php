<?php

class SCP_Working_Hours_Widget extends WP_Widget {

	protected $textdomain = SCP_TEXT_DOMAIN;

	/**
	 * Constructor
	 */
	public function __construct() {

		$widget_ops = array(
			'classname'   => 'widget-working-hours',
			'description' => __( 'Working Hours. ( for footer section)', $this->textdomain ),
		);

		parent::__construct( 'scp_working_hours', SCP_PLUGIN_NAME . ' - Working Hours Widget', $widget_ops );
	}

	/**
	 * Outputs the options form on admin
	 *
	 * @see WP_Widget::form()
	 *
	 * @param $instance current settings
	 */
	public function form( $instance ) {

		//Get Posts from first category (current one)
		$default = array(
			'title'              => __( 'Working Hours', $this->textdomain ),
			'fields_with_labels' => 'saturday_hours|sunday_hours',
			'monday_title'       => 'Monday',
			'monday_hours'       => '9am - 6pm',
			'tuesday_title'      => 'Tuesday',
			'tuesday_hours'      => '9am - 6pm',
			'wednesday_title'    => 'Wednesday',
			'wednesday_hours'    => '9am - 6pm',
			'thursday_title'     => 'Thursday',
			'thursday_hours'     => '9am - 6pm',
			'friday_title'       => 'Friday',
			'friday_hours'       => '9am - 6pm',
			'saturday_title'     => 'Saturday',
			'saturday_hours'     => 'Closed',
			'sunday_title'       => 'Sunday',
			'sunday_hours'       => 'Closed',
		);

		$instance = wp_parse_args( (array) $instance, $default );

		?>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Widget Title', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'title' ); ?>"
			       id="<?php echo $this->get_field_id( 'title' ); ?>"
			       value="<?php echo esc_attr( $instance['title'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'fields_with_labels' ); ?>"><?php _e( 'Fields with labels (pipe separated list)', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'fields_with_labels' ); ?>"
			       id="<?php echo $this->get_field_id( 'fields_with_labels' ); ?>"
			       value="<?php echo esc_attr( $instance['fields_with_labels'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'monday_title' ); ?>"><?php _e( 'Monday Title', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'monday_title' ); ?>"
			       id="<?php echo $this->get_field_id( 'monday_title' ); ?>"
			       value="<?php echo esc_attr( $instance['monday_title'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'monday_hours' ); ?>"><?php _e( 'Monday Hours', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'monday_hours' ); ?>"
			       id="<?php echo $this->get_field_id( 'monday_hours' ); ?>"
			       value="<?php echo esc_attr( $instance['monday_hours'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'tuesday_title' ); ?>"><?php _e( 'Tuesday Title', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'tuesday_title' ); ?>"
			       id="<?php echo $this->get_field_id( 'tuesday_title' ); ?>"
			       value="<?php echo esc_attr( $instance['tuesday_title'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'tuesday_hours' ); ?>"><?php _e( 'Tuesday Hours', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'tuesday_hours' ); ?>"
			       id="<?php echo $this->get_field_id( 'tuesday_hours' ); ?>"
			       value="<?php echo esc_attr( $instance['tuesday_hours'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'wednesday_title' ); ?>"><?php _e( 'Wednesday Title', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'wednesday_title' ); ?>"
			       id="<?php echo $this->get_field_id( 'wednesday_title' ); ?>"
			       value="<?php echo esc_attr( $instance['wednesday_title'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'wednesday_hours' ); ?>"><?php _e( 'Wednesday Hours', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'wednesday_hours' ); ?>"
			       id="<?php echo $this->get_field_id( 'wednesday_hours' ); ?>"
			       value="<?php echo esc_attr( $instance['wednesday_hours'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'thursday_title' ); ?>"><?php _e( 'Thursday Title', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'thursday_title' ); ?>"
			       id="<?php echo $this->get_field_id( 'thursday_title' ); ?>"
			       value="<?php echo esc_attr( $instance['thursday_title'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'thursday_hours' ); ?>"><?php _e( 'Thursday Hours', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'thursday_hours' ); ?>"
			       id="<?php echo $this->get_field_id( 'thursday_hours' ); ?>"
			       value="<?php echo esc_attr( $instance['thursday_hours'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'friday_title' ); ?>"><?php _e( 'Friday Title', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'friday_title' ); ?>"
			       id="<?php echo $this->get_field_id( 'friday_title' ); ?>"
			       value="<?php echo esc_attr( $instance['friday_title'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'friday_hours' ); ?>"><?php _e( 'Friday Hours', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'friday_hours' ); ?>"
			       id="<?php echo $this->get_field_id( 'friday_hours' ); ?>"
			       value="<?php echo esc_attr( $instance['friday_hours'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'saturday_title' ); ?>"><?php _e( 'Saturday Title', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'saturday_title' ); ?>"
			       id="<?php echo $this->get_field_id( 'saturday_title' ); ?>"
			       value="<?php echo esc_attr( $instance['saturday_title'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'saturday_hours' ); ?>"><?php _e( 'Saturday Hours', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'saturday_hours' ); ?>"
			       id="<?php echo $this->get_field_id( 'saturday_hours' ); ?>"
			       value="<?php echo esc_attr( $instance['saturday_hours'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'sunday_title' ); ?>"><?php _e( 'Sunday Title', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'sunday_title' ); ?>"
			       id="<?php echo $this->get_field_id( 'sunday_title' ); ?>"
			       value="<?php echo esc_attr( $instance['sunday_title'] ); ?>"/>
		</p>
		<p>
			<label
				for="<?php echo $this->get_field_id( 'sunday_hours' ); ?>"><?php _e( 'Sunday Hours', $this->textdomain ); ?></label><br/>
			<input class="widefat" name="<?php echo $this->get_field_name( 'sunday_hours' ); ?>"
			       id="<?php echo $this->get_field_id( 'sunday_hours' ); ?>"
			       value="<?php echo esc_attr( $instance['sunday_hours'] ); ?>"/>
		</p>


	<?php
	}

	/**
	 * processes widget options to be saved
	 *
	 * @see WP_Widget::update()
	 */
	public function update( $new_instance, $old_instance ) {

		$instance = array();
		if ( empty( $old_instance ) ) {
			$old_instance = $new_instance;
		}

		foreach ( $old_instance as $k => $value ) {
			$instance[ $k ] = trim( strip_tags( $new_instance[ $k ] ) );
		}

		return $instance;
	}

	/**
	 * Front-end display of widget.
	 *
	 * @see WP_Widget::widget()
	 *
	 * @param array $args     Display arguments including before_title, after_title, before_widget, and after_widget.
	 * @param array $instance The settings for the particular instance of the widget
	 */
	public function widget( $args, $instance ) {
		extract( $args );

		$title = empty( $instance['title'] ) ? '' : apply_filters( 'widget_title', $instance['title'] );

		$instance['fields_with_labels'] = explode( '|', $instance['fields_with_labels'] );

		$out = '';
		$out .= $before_widget;

		if ( $title ) {
			$out .= $before_title . $title . $after_title;
		}

		$days = array('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

		$out .= '<ul>';

		foreach ( $days as $day ) {
			$out .= $this->get_line_html( $day . '_title', $day . '_hours', $instance );
		}

		$out .= '</ul>';
		$out .= $after_widget;

		echo $out;

	}

	public function get_line_html( $element_title_1, $element_title_2, $instance ) {

		$out = '';
		$out .= '<li>';
		$out .= '<span class="title">' . $this->wrap_if_in_array( $element_title_1, $instance[ $element_title_1 ], $instance['fields_with_labels'] ) . '</span>';
		$out .= '<span class="hours">' . $this->wrap_if_in_array( $element_title_2, $instance[ $element_title_2 ], $instance['fields_with_labels'] ) . '</span>';
		$out .= '</li>';

		return $out;
	}

	public function wrap_if_in_array( $key, $val, $fields ) {

		if ( in_array( $key, $fields ) ) {
			return '<em>' . $val . '</em>';
		}

		return $val;
	}

}

register_widget( 'SCP_Working_Hours_Widget' );
