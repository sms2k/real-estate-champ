<?php
/**
 * Plugin Name: Real Estate Champ
 * Plugin URI: https://github.com/yourusername/real-estate-champ
 * Description: AI-powered property marketing platform that generates blog posts, social media content, and videos from property images and descriptions.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: real-estate-champ
 * Requires at least: 5.6
 * Requires PHP: 7.4
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Plugin version
define('REC_VERSION', '1.0.0');
define('REC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('REC_PLUGIN_URL', plugin_dir_url(__FILE__));
define('REC_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * The code that runs during plugin activation.
 */
function activate_real_estate_champ() {
    require_once REC_PLUGIN_DIR . 'includes/class-rec-activator.php';
    REC_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_real_estate_champ() {
    require_once REC_PLUGIN_DIR . 'includes/class-rec-deactivator.php';
    REC_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_real_estate_champ');
register_deactivation_hook(__FILE__, 'deactivate_real_estate_champ');

/**
 * The core plugin class
 */
require REC_PLUGIN_DIR . 'includes/class-real-estate-champ.php';

/**
 * Begins execution of the plugin.
 */
function run_real_estate_champ() {
    $plugin = new Real_Estate_Champ();
    $plugin->run();
}

run_real_estate_champ();
