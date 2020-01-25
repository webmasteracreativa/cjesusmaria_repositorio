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
define('DB_NAME', 'jesus5o1_website');
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
define('AUTH_KEY',         'ckx1s3mjxau5asfeesiiots3teb1diva647gsfbo9jmdk4ybpsmzjcbwa8qrsbml');
define('SECURE_AUTH_KEY',  '2tiephha5j5o6xe6vpjy1pyfssvyvbhlj0vqeex6mqldcsg2qvwd1katq6otua0e');
define('LOGGED_IN_KEY',    'nssqpw576glt10hz0deqbnfbfdffb3haumcf8qf9mauopskel4r2cmdexxkzcmy5');
define('NONCE_KEY',        'lbwsjyiqidywpphkypfyebvcxyuwbrlknyie36eq4mbhjnnpbqrqpfrexol9no9n');
define('AUTH_SALT',        'zampxoszlg7netfc2ctpxlhh5x7vluxythpk3u6d1ud8ngcujxww2w8ixtaehai8');
define('SECURE_AUTH_SALT', 'boooavizuolv1npevgil9xukbxzqwbfnpyzj5ygy3218bvcdcxvl5c1hxbnjgpun');
define('LOGGED_IN_SALT',   'uzxyyp6qofgcpugi16tz0yy4dw8xird9wfjgyjabnqeyixdck82xivt9ercwyn8w');
define('NONCE_SALT',       '7uejkuyontpg7o7k9fqd5melttkv8sf7ywxgineck5xlwgmotssk4kudhdqhxiaa');
/**#@-*/
/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wpitul_';
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
