<?php
/**
 * The admin-specific functionality of the plugin.
 */
class REC_Admin {

    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Register the stylesheets for the admin area.
     */
    public function enqueue_styles() {
        wp_enqueue_style(
            $this->plugin_name,
            REC_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            $this->version,
            'all'
        );
    }

    /**
     * Register the JavaScript for the admin area.
     */
    public function enqueue_scripts() {
        wp_enqueue_script(
            $this->plugin_name,
            REC_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            $this->version,
            false
        );
    }

    /**
     * Register the administration menu.
     */
    public function add_plugin_admin_menu() {
        // Main menu
        add_menu_page(
            'Real Estate Champ',
            'Real Estate Champ',
            'manage_options',
            $this->plugin_name,
            array($this, 'display_plugin_dashboard'),
            'dashicons-admin-home',
            26
        );

        // Dashboard
        add_submenu_page(
            $this->plugin_name,
            'Dashboard',
            'Dashboard',
            'edit_posts',
            $this->plugin_name,
            array($this, 'display_plugin_dashboard')
        );

        // Properties
        add_submenu_page(
            $this->plugin_name,
            'Properties',
            'Properties',
            'edit_posts',
            $this->plugin_name . '-properties',
            array($this, 'display_properties_page')
        );

        // Settings (admin only)
        add_submenu_page(
            $this->plugin_name,
            'Settings',
            'Settings',
            'manage_options',
            $this->plugin_name . '-settings',
            array($this, 'display_settings_page')
        );

        // Social Accounts
        add_submenu_page(
            $this->plugin_name,
            'Connected Accounts',
            'Connected Accounts',
            'edit_posts',
            $this->plugin_name . '-social',
            array($this, 'display_social_accounts_page')
        );
    }

    /**
     * Render the dashboard page.
     */
    public function display_plugin_dashboard() {
        require_once REC_PLUGIN_DIR . 'admin/partials/dashboard.php';
    }

    /**
     * Render the properties page.
     */
    public function display_properties_page() {
        require_once REC_PLUGIN_DIR . 'admin/partials/properties.php';
    }

    /**
     * Render the settings page.
     */
    public function display_settings_page() {
        require_once REC_PLUGIN_DIR . 'admin/partials/settings.php';
    }

    /**
     * Render the social accounts page.
     */
    public function display_social_accounts_page() {
        require_once REC_PLUGIN_DIR . 'admin/partials/social-accounts.php';
    }

    /**
     * Register plugin settings.
     */
    public function register_settings() {
        // General settings
        register_setting('rec_general_settings', 'rec_google_ai_api_key');
        register_setting('rec_general_settings', 'rec_facebook_app_id');
        register_setting('rec_general_settings', 'rec_facebook_app_secret');
        register_setting('rec_general_settings', 'rec_linkedin_client_id');
        register_setting('rec_general_settings', 'rec_linkedin_client_secret');
        register_setting('rec_general_settings', 'rec_google_business_client_id');
        register_setting('rec_general_settings', 'rec_google_business_client_secret');
        register_setting('rec_general_settings', 'rec_enable_pwa');
        register_setting('rec_general_settings', 'rec_pwa_app_url');

        // API Settings Section
        add_settings_section(
            'rec_api_settings_section',
            __('API Configuration', 'real-estate-champ'),
            array($this, 'api_settings_section_callback'),
            'rec_general_settings'
        );

        // Google AI API Key
        add_settings_field(
            'rec_google_ai_api_key',
            __('Google AI API Key', 'real-estate-champ'),
            array($this, 'text_field_callback'),
            'rec_general_settings',
            'rec_api_settings_section',
            array(
                'label_for' => 'rec_google_ai_api_key',
                'type'      => 'password',
            )
        );

        // Facebook App ID
        add_settings_field(
            'rec_facebook_app_id',
            __('Facebook App ID', 'real-estate-champ'),
            array($this, 'text_field_callback'),
            'rec_general_settings',
            'rec_api_settings_section',
            array('label_for' => 'rec_facebook_app_id')
        );

        // Facebook App Secret
        add_settings_field(
            'rec_facebook_app_secret',
            __('Facebook App Secret', 'real-estate-champ'),
            array($this, 'text_field_callback'),
            'rec_general_settings',
            'rec_api_settings_section',
            array(
                'label_for' => 'rec_facebook_app_secret',
                'type'      => 'password',
            )
        );

        // LinkedIn Client ID
        add_settings_field(
            'rec_linkedin_client_id',
            __('LinkedIn Client ID', 'real-estate-champ'),
            array($this, 'text_field_callback'),
            'rec_general_settings',
            'rec_api_settings_section',
            array('label_for' => 'rec_linkedin_client_id')
        );

        // LinkedIn Client Secret
        add_settings_field(
            'rec_linkedin_client_secret',
            __('LinkedIn Client Secret', 'real-estate-champ'),
            array($this, 'text_field_callback'),
            'rec_general_settings',
            'rec_api_settings_section',
            array(
                'label_for' => 'rec_linkedin_client_secret',
                'type'      => 'password',
            )
        );

        // Google Business Client ID
        add_settings_field(
            'rec_google_business_client_id',
            __('Google Business Client ID', 'real-estate-champ'),
            array($this, 'text_field_callback'),
            'rec_general_settings',
            'rec_api_settings_section',
            array('label_for' => 'rec_google_business_client_id')
        );

        // Google Business Client Secret
        add_settings_field(
            'rec_google_business_client_secret',
            __('Google Business Client Secret', 'real-estate-champ'),
            array($this, 'text_field_callback'),
            'rec_general_settings',
            'rec_api_settings_section',
            array(
                'label_for' => 'rec_google_business_client_secret',
                'type'      => 'password',
            )
        );

        // PWA Settings Section
        add_settings_section(
            'rec_pwa_settings_section',
            __('Progressive Web App (PWA) Configuration', 'real-estate-champ'),
            array($this, 'pwa_settings_section_callback'),
            'rec_general_settings'
        );

        // Enable PWA
        add_settings_field(
            'rec_enable_pwa',
            __('Enable PWA', 'real-estate-champ'),
            array($this, 'checkbox_field_callback'),
            'rec_general_settings',
            'rec_pwa_settings_section',
            array('label_for' => 'rec_enable_pwa')
        );

        // PWA App URL
        add_settings_field(
            'rec_pwa_app_url',
            __('PWA App URL', 'real-estate-champ'),
            array($this, 'text_field_callback'),
            'rec_general_settings',
            'rec_pwa_settings_section',
            array(
                'label_for'   => 'rec_pwa_app_url',
                'description' => __('URL of your deployed PWA app (e.g., https://app.yoursite.com)', 'real-estate-champ'),
            )
        );
    }

    /**
     * API settings section callback.
     */
    public function api_settings_section_callback() {
        echo '<p>' . __('Configure your API keys for AI and social media integrations.', 'real-estate-champ') . '</p>';
    }

    /**
     * PWA settings section callback.
     */
    public function pwa_settings_section_callback() {
        echo '<p>' . __('Configure your Progressive Web App settings. Enable this to allow users to use the mobile app.', 'real-estate-champ') . '</p>';
    }

    /**
     * Text field callback.
     */
    public function text_field_callback($args) {
        $option_name = $args['label_for'];
        $value = get_option($option_name);
        $type = isset($args['type']) ? $args['type'] : 'text';
        $description = isset($args['description']) ? $args['description'] : '';

        echo '<input type="' . esc_attr($type) . '" id="' . esc_attr($option_name) . '" name="' . esc_attr($option_name) . '" value="' . esc_attr($value) . '" class="regular-text" />';

        if ($description) {
            echo '<p class="description">' . esc_html($description) . '</p>';
        }
    }

    /**
     * Checkbox field callback.
     */
    public function checkbox_field_callback($args) {
        $option_name = $args['label_for'];
        $value = get_option($option_name);
        $checked = $value ? 'checked' : '';

        echo '<input type="checkbox" id="' . esc_attr($option_name) . '" name="' . esc_attr($option_name) . '" value="1" ' . $checked . ' />';
    }
}
