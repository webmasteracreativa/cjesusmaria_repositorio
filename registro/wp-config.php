<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'jesus5o1_wp932');

/** MySQL database username */
define('DB_USER', 'jesus5o1_wp932');

/** MySQL database password */
define('DB_PASSWORD', 'u2A71Rp)[S');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '5e0m3k7vkwfyjbnrorrpldm1fdk65zhvi7dm0nk8wqnjzrh9p7dphychyng6y1st');
define('SECURE_AUTH_KEY',  'hbsbnmzhqnoh1u4grusuy1uigqbnbqhd62uzwvfcxfuebmvkhlpiwbvopsry8auj');
define('LOGGED_IN_KEY',    'flis0rfvcqhosf0nzzwbtbbstu0zsjl0zzjbhbge8nszeft1tb6gjzwkeuvpm2ki');
define('NONCE_KEY',        'ar91so7x6tle1xgqjpcqsrapd5vwz6dkbapgnay7oli7hryq4qvuszf6kwcyn0vt');
define('AUTH_SALT',        '6wtrx8gr4se8zi82fajcs5wreaasmiehohl5sugptihdrtldaqsijezszwqphyi1');
define('SECURE_AUTH_SALT', '1sxt6fge26vdqmfppxd0jvm9kcxndqmoqr6tvcuiemrk8msiuhxz1xuhwwm9hkfr');
define('LOGGED_IN_SALT',   't7b6ngmotm765svwa8zcvoafaxvyuzmn5qhoo7qpgfrde6emtz6zlmmydizlqbcn');
define('NONCE_SALT',       '4bkujcf7nfetlveb95aanfup1ra4z8wvdxolgvi2itwn93n6roc2yxqgvphyymtv');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wpdh_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
