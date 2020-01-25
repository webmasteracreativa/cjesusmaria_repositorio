<?php

class Wheels_Theme_Options_Importer implements Wheels_Importer_Interface {

	const FILTER_IMPORT_THEME_OPTIONS = 'wheels_import_theme_options';

	protected $textdomain = 'wheels';
	protected $theme_option_name = ED_SCHOOL_THEME_OPTION_NAME;
	protected $filename;

	public function import() {

		// File exists?
		if ( ! file_exists( $this->get_filename() ) ) {
			wp_die( esc_html__( 'Theme options Import file could not be found. Please try again.', 'ed-school' ), '', array( 'back_link' => true ) );
		}

		$data = null;
		if ( function_exists( 'scp_fgc') ) {
			$data = scp_fgc( $this->get_filename() );
		}

		if ($data) {

			$data = json_decode( $data, true );

			// Have valid data?
			// If no data or could not decode
			if ( empty( $data ) || ! is_array( $data ) ) {
				wp_die( esc_html__( 'Theme options import data could not be read. Please try a different file.', 'ed-school' ), '', array( 'back_link' => true ) );
			}

			// Hook before import
			$data = apply_filters( self::FILTER_IMPORT_THEME_OPTIONS, $data );

			if ( ! $this->get_theme_option_name() ) {
				wp_die( esc_html__( 'Theme options name not defined. Please define it and try again.', 'ed-school' ), '', array( 'back_link' => true ) );
			}

			update_option( $this->theme_option_name, $data );
			update_option( $this->get_theme_option_name() . '-transients', array( 'run_compiler' => 1 ) );
		}
	}

	public function get_textdomain() {
		return $this->textdomain;
	}

	public function set_textdomain( $textdomain ) {
		$this->textdomain = $textdomain;
	}

	public function get_theme_option_name() {
		return $this->theme_option_name;
	}

	public function set_theme_option_name( $theme_option_name ) {
		$this->theme_option_name = $theme_option_name;
	}

	public function get_filename() {
		return $this->content_filename;
	}

	public function set_filename( $filename ) {
		$this->content_filename = $filename;
	}

}
