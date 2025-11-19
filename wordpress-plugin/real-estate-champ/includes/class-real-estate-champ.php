<?php
/**
 * The core plugin class.
 */
class Real_Estate_Champ {

    /**
     * The loader that's responsible for maintaining and registering all hooks.
     */
    protected $loader;

    /**
     * The unique identifier of this plugin.
     */
    protected $plugin_name;

    /**
     * The current version of the plugin.
     */
    protected $version;

    /**
     * Define the core functionality of the plugin.
     */
    public function __construct() {
        $this->version = REC_VERSION;
        $this->plugin_name = 'real-estate-champ';

        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_api_hooks();
    }

    /**
     * Load the required dependencies for this plugin.
     */
    private function load_dependencies() {
        // The class responsible for orchestrating the actions and filters
        require_once REC_PLUGIN_DIR . 'includes/class-rec-loader.php';

        // Admin-specific functionality
        require_once REC_PLUGIN_DIR . 'admin/class-rec-admin.php';

        // REST API endpoints
        require_once REC_PLUGIN_DIR . 'api/class-rec-api.php';

        // Database models
        require_once REC_PLUGIN_DIR . 'includes/models/class-rec-property.php';
        require_once REC_PLUGIN_DIR . 'includes/models/class-rec-content.php';

        // Services
        require_once REC_PLUGIN_DIR . 'includes/services/class-rec-ai-service.php';
        require_once REC_PLUGIN_DIR . 'includes/services/class-rec-social-service.php';

        $this->loader = new REC_Loader();
    }

    /**
     * Register all of the hooks related to the admin area functionality.
     */
    private function define_admin_hooks() {
        $plugin_admin = new REC_Admin($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_styles');
        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts');
        $this->loader->add_action('admin_menu', $plugin_admin, 'add_plugin_admin_menu');
        $this->loader->add_action('admin_init', $plugin_admin, 'register_settings');
    }

    /**
     * Register all of the hooks related to the REST API.
     */
    private function define_api_hooks() {
        $plugin_api = new REC_API($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('rest_api_init', $plugin_api, 'register_routes');
    }

    /**
     * Run the loader to execute all of the hooks with WordPress.
     */
    public function run() {
        $this->loader->run();
    }

    /**
     * The name of the plugin.
     */
    public function get_plugin_name() {
        return $this->plugin_name;
    }

    /**
     * The reference to the class that orchestrates the hooks.
     */
    public function get_loader() {
        return $this->loader;
    }

    /**
     * Retrieve the version number of the plugin.
     */
    public function get_version() {
        return $this->version;
    }
}
