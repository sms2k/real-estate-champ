<?php
/**
 * Fired during plugin activation.
 */
class REC_Activator {

    /**
     * Activation hook.
     */
    public static function activate() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        // Properties table
        $table_properties = $wpdb->prefix . 'rec_properties';
        $sql_properties = "CREATE TABLE IF NOT EXISTS $table_properties (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            title varchar(255) NOT NULL,
            description text,
            address varchar(255),
            city varchar(100),
            state varchar(50),
            zip_code varchar(20),
            price decimal(12,2),
            bedrooms int(11),
            bathrooms decimal(3,1),
            square_feet int(11),
            property_type varchar(50),
            status varchar(20) DEFAULT 'draft',
            property_data longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY status (status)
        ) $charset_collate;";

        // Property images table
        $table_images = $wpdb->prefix . 'rec_property_images';
        $sql_images = "CREATE TABLE IF NOT EXISTS $table_images (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) NOT NULL,
            file_path varchar(500) NOT NULL,
            file_name varchar(255) NOT NULL,
            file_size int(11),
            mime_type varchar(100),
            image_order int(11) DEFAULT 0,
            caption text,
            is_main tinyint(1) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY property_id (property_id)
        ) $charset_collate;";

        // Generated content table
        $table_content = $wpdb->prefix . 'rec_generated_content';
        $sql_content = "CREATE TABLE IF NOT EXISTS $table_content (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) NOT NULL,
            content_type varchar(50) NOT NULL,
            platform varchar(50),
            title varchar(500),
            content longtext NOT NULL,
            images longtext,
            video_path varchar(500),
            status varchar(20) DEFAULT 'pending',
            published_at datetime,
            scheduled_for datetime,
            error_message text,
            metadata longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY property_id (property_id),
            KEY status (status),
            KEY content_type (content_type)
        ) $charset_collate;";

        // Social accounts table
        $table_social = $wpdb->prefix . 'rec_social_accounts';
        $sql_social = "CREATE TABLE IF NOT EXISTS $table_social (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            platform varchar(50) NOT NULL,
            platform_user_id varchar(255),
            platform_username varchar(255),
            access_token text NOT NULL,
            refresh_token text,
            expires_at datetime,
            scope text,
            page_id varchar(255),
            page_access_token text,
            is_active tinyint(1) DEFAULT 1,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY platform (platform)
        ) $charset_collate;";

        // Settings/API keys table
        $table_settings = $wpdb->prefix . 'rec_settings';
        $sql_settings = "CREATE TABLE IF NOT EXISTS $table_settings (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            setting_key varchar(100) NOT NULL UNIQUE,
            setting_value longtext,
            is_encrypted tinyint(1) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY setting_key (setting_key)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_properties);
        dbDelta($sql_images);
        dbDelta($sql_content);
        dbDelta($sql_social);
        dbDelta($sql_settings);

        // Set default options
        add_option('rec_version', REC_VERSION);
        add_option('rec_activation_time', current_time('mysql'));

        // Create upload directory
        $upload_dir = wp_upload_dir();
        $rec_upload_dir = $upload_dir['basedir'] . '/real-estate-champ';

        if (!file_exists($rec_upload_dir)) {
            wp_mkdir_p($rec_upload_dir);
            wp_mkdir_p($rec_upload_dir . '/properties');
            wp_mkdir_p($rec_upload_dir . '/videos');
        }

        // Flush rewrite rules
        flush_rewrite_rules();
    }
}
