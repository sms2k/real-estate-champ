<?php
/**
 * REST API endpoints for the plugin.
 */
class REC_API {

    private $plugin_name;
    private $version;
    private $namespace;

    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->namespace = 'real-estate-champ/v1';
    }

    /**
     * Register REST API routes.
     */
    public function register_routes() {
        // Properties endpoints
        register_rest_route($this->namespace, '/properties', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_properties'),
                'permission_callback' => array($this, 'check_auth'),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this, 'create_property'),
                'permission_callback' => array($this, 'check_auth'),
            ),
        ));

        register_rest_route($this->namespace, '/properties/(?P<id>\d+)', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_property'),
                'permission_callback' => array($this, 'check_auth'),
            ),
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array($this, 'update_property'),
                'permission_callback' => array($this, 'check_auth'),
            ),
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array($this, 'delete_property'),
                'permission_callback' => array($this, 'check_auth'),
            ),
        ));

        // Image upload endpoint
        register_rest_route($this->namespace, '/properties/(?P<id>\d+)/images', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array($this, 'upload_property_images'),
            'permission_callback' => array($this, 'check_auth'),
        ));

        // Chat endpoint (for AI conversation)
        register_rest_route($this->namespace, '/chat', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array($this, 'chat'),
            'permission_callback' => array($this, 'check_auth'),
        ));

        // Content generation endpoint
        register_rest_route($this->namespace, '/properties/(?P<id>\d+)/generate-content', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array($this, 'generate_content'),
            'permission_callback' => array($this, 'check_auth'),
        ));

        // Publish content endpoint
        register_rest_route($this->namespace, '/content/(?P<id>\d+)/publish', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array($this, 'publish_content'),
            'permission_callback' => array($this, 'check_auth'),
        ));

        // Social accounts endpoints
        register_rest_route($this->namespace, '/social-accounts', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_social_accounts'),
                'permission_callback' => array($this, 'check_auth'),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this, 'connect_social_account'),
                'permission_callback' => array($this, 'check_auth'),
            ),
        ));

        // Settings endpoint (for PWA to get configuration)
        register_rest_route($this->namespace, '/settings', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array($this, 'get_settings'),
            'permission_callback' => array($this, 'check_auth'),
        ));

        // Sync status endpoint (for offline sync)
        register_rest_route($this->namespace, '/sync', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array($this, 'sync_data'),
            'permission_callback' => array($this, 'check_auth'),
        ));
    }

    /**
     * Check if user is authenticated.
     */
    public function check_auth($request) {
        return is_user_logged_in();
    }

    /**
     * Get all properties for current user.
     */
    public function get_properties($request) {
        $property_model = new REC_Property();
        $user_id = get_current_user_id();

        $properties = $property_model->get_by_user($user_id);

        return rest_ensure_response(array(
            'success' => true,
            'data'    => $properties,
        ));
    }

    /**
     * Get single property.
     */
    public function get_property($request) {
        $property_model = new REC_Property();
        $property_id = $request['id'];
        $user_id = get_current_user_id();

        $property = $property_model->get($property_id);

        if (!$property || $property->user_id != $user_id) {
            return new WP_Error('not_found', 'Property not found', array('status' => 404));
        }

        return rest_ensure_response(array(
            'success' => true,
            'data'    => $property,
        ));
    }

    /**
     * Create new property.
     */
    public function create_property($request) {
        $property_model = new REC_Property();
        $user_id = get_current_user_id();

        $params = $request->get_json_params();
        $params['user_id'] = $user_id;

        $property_id = $property_model->create($params);

        if (!$property_id) {
            return new WP_Error('creation_failed', 'Failed to create property', array('status' => 500));
        }

        return rest_ensure_response(array(
            'success' => true,
            'data'    => array('id' => $property_id),
        ));
    }

    /**
     * Update property.
     */
    public function update_property($request) {
        $property_model = new REC_Property();
        $property_id = $request['id'];
        $user_id = get_current_user_id();

        $property = $property_model->get($property_id);

        if (!$property || $property->user_id != $user_id) {
            return new WP_Error('not_found', 'Property not found', array('status' => 404));
        }

        $params = $request->get_json_params();
        $updated = $property_model->update($property_id, $params);

        if (!$updated) {
            return new WP_Error('update_failed', 'Failed to update property', array('status' => 500));
        }

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Property updated successfully',
        ));
    }

    /**
     * Delete property.
     */
    public function delete_property($request) {
        $property_model = new REC_Property();
        $property_id = $request['id'];
        $user_id = get_current_user_id();

        $property = $property_model->get($property_id);

        if (!$property || $property->user_id != $user_id) {
            return new WP_Error('not_found', 'Property not found', array('status' => 404));
        }

        $deleted = $property_model->delete($property_id);

        if (!$deleted) {
            return new WP_Error('delete_failed', 'Failed to delete property', array('status' => 500));
        }

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Property deleted successfully',
        ));
    }

    /**
     * Upload property images.
     */
    public function upload_property_images($request) {
        $property_model = new REC_Property();
        $property_id = $request['id'];
        $user_id = get_current_user_id();

        $property = $property_model->get($property_id);

        if (!$property || $property->user_id != $user_id) {
            return new WP_Error('not_found', 'Property not found', array('status' => 404));
        }

        $files = $request->get_file_params();
        $uploaded_images = array();

        if (!empty($files)) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            require_once(ABSPATH . 'wp-admin/includes/media.php');
            require_once(ABSPATH . 'wp-admin/includes/image.php');

            foreach ($files as $file_key => $file) {
                $upload_overrides = array('test_form' => false);
                $movefile = wp_handle_upload($file, $upload_overrides);

                if ($movefile && !isset($movefile['error'])) {
                    $image_data = array(
                        'property_id' => $property_id,
                        'file_path'   => $movefile['file'],
                        'file_name'   => basename($movefile['file']),
                        'file_size'   => filesize($movefile['file']),
                        'mime_type'   => $movefile['type'],
                    );

                    $image_id = $property_model->add_image($image_data);
                    $uploaded_images[] = array(
                        'id'   => $image_id,
                        'url'  => $movefile['url'],
                        'file' => $movefile['file'],
                    );
                }
            }
        }

        return rest_ensure_response(array(
            'success' => true,
            'data'    => $uploaded_images,
        ));
    }

    /**
     * Chat with AI.
     */
    public function chat($request) {
        $ai_service = new REC_AI_Service();
        $params = $request->get_json_params();

        $messages = isset($params['messages']) ? $params['messages'] : array();
        $property_id = isset($params['property_id']) ? $params['property_id'] : null;

        $response = $ai_service->chat($messages, $property_id);

        return rest_ensure_response(array(
            'success' => true,
            'data'    => $response,
        ));
    }

    /**
     * Generate content for property.
     */
    public function generate_content($request) {
        $ai_service = new REC_AI_Service();
        $property_id = $request['id'];
        $user_id = get_current_user_id();

        $property_model = new REC_Property();
        $property = $property_model->get($property_id);

        if (!$property || $property->user_id != $user_id) {
            return new WP_Error('not_found', 'Property not found', array('status' => 404));
        }

        $params = $request->get_json_params();
        $platforms = isset($params['platforms']) ? $params['platforms'] : array('blog');

        $generated_content = $ai_service->generate_content($property_id, $platforms);

        return rest_ensure_response(array(
            'success' => true,
            'data'    => $generated_content,
        ));
    }

    /**
     * Publish content to platforms.
     */
    public function publish_content($request) {
        $social_service = new REC_Social_Service();
        $content_id = $request['id'];
        $user_id = get_current_user_id();

        $content_model = new REC_Content();
        $content = $content_model->get($content_id);

        if (!$content) {
            return new WP_Error('not_found', 'Content not found', array('status' => 404));
        }

        $result = $social_service->publish($content);

        return rest_ensure_response(array(
            'success' => $result['success'],
            'data'    => $result,
        ));
    }

    /**
     * Get social accounts.
     */
    public function get_social_accounts($request) {
        global $wpdb;
        $user_id = get_current_user_id();

        $table_name = $wpdb->prefix . 'rec_social_accounts';
        $accounts = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_name WHERE user_id = %d AND is_active = 1",
            $user_id
        ));

        return rest_ensure_response(array(
            'success' => true,
            'data'    => $accounts,
        ));
    }

    /**
     * Connect social account.
     */
    public function connect_social_account($request) {
        $params = $request->get_json_params();
        $user_id = get_current_user_id();

        global $wpdb;
        $table_name = $wpdb->prefix . 'rec_social_accounts';

        $data = array(
            'user_id'           => $user_id,
            'platform'          => sanitize_text_field($params['platform']),
            'platform_user_id'  => sanitize_text_field($params['platform_user_id']),
            'platform_username' => sanitize_text_field($params['platform_username']),
            'access_token'      => $params['access_token'],
            'refresh_token'     => isset($params['refresh_token']) ? $params['refresh_token'] : null,
            'expires_at'        => isset($params['expires_at']) ? $params['expires_at'] : null,
            'scope'             => isset($params['scope']) ? $params['scope'] : null,
        );

        $inserted = $wpdb->insert($table_name, $data);

        if (!$inserted) {
            return new WP_Error('insert_failed', 'Failed to connect account', array('status' => 500));
        }

        return rest_ensure_response(array(
            'success' => true,
            'data'    => array('id' => $wpdb->insert_id),
        ));
    }

    /**
     * Get settings for PWA.
     */
    public function get_settings($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rec_settings';

        $settings = $wpdb->get_results("SELECT setting_key, setting_value FROM $table_name WHERE is_encrypted = 0");

        $settings_array = array();
        foreach ($settings as $setting) {
            $settings_array[$setting->setting_key] = maybe_unserialize($setting->setting_value);
        }

        return rest_ensure_response(array(
            'success' => true,
            'data'    => $settings_array,
        ));
    }

    /**
     * Sync data for offline capability.
     */
    public function sync_data($request) {
        $params = $request->get_json_params();
        $user_id = get_current_user_id();

        // Handle offline data that needs to be synced
        $synced_items = array();

        if (isset($params['properties'])) {
            foreach ($params['properties'] as $property_data) {
                // Create or update properties that were created offline
                $property_model = new REC_Property();

                if (isset($property_data['temp_id'])) {
                    // This was created offline, create it now
                    $property_data['user_id'] = $user_id;
                    $property_id = $property_model->create($property_data);

                    $synced_items[] = array(
                        'temp_id' => $property_data['temp_id'],
                        'id'      => $property_id,
                        'type'    => 'property',
                    );
                }
            }
        }

        return rest_ensure_response(array(
            'success' => true,
            'data'    => $synced_items,
        ));
    }
}
