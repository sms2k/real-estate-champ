<?php
/**
 * Property model.
 */
class REC_Property {

    private $table_name;
    private $images_table;

    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'rec_properties';
        $this->images_table = $wpdb->prefix . 'rec_property_images';
    }

    /**
     * Get property by ID.
     */
    public function get($id) {
        global $wpdb;

        $property = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE id = %d",
            $id
        ));

        if ($property) {
            // Get images
            $property->images = $this->get_images($id);

            // Decode property data JSON
            if ($property->property_data) {
                $property->property_data = json_decode($property->property_data, true);
            }
        }

        return $property;
    }

    /**
     * Get all properties for a user.
     */
    public function get_by_user($user_id, $limit = 100, $offset = 0) {
        global $wpdb;

        $properties = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE user_id = %d ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $user_id,
            $limit,
            $offset
        ));

        foreach ($properties as $property) {
            $property->images = $this->get_images($property->id);

            if ($property->property_data) {
                $property->property_data = json_decode($property->property_data, true);
            }
        }

        return $properties;
    }

    /**
     * Create new property.
     */
    public function create($data) {
        global $wpdb;

        $property_data = array(
            'user_id'       => $data['user_id'],
            'title'         => isset($data['title']) ? sanitize_text_field($data['title']) : '',
            'description'   => isset($data['description']) ? wp_kses_post($data['description']) : '',
            'address'       => isset($data['address']) ? sanitize_text_field($data['address']) : '',
            'city'          => isset($data['city']) ? sanitize_text_field($data['city']) : '',
            'state'         => isset($data['state']) ? sanitize_text_field($data['state']) : '',
            'zip_code'      => isset($data['zip_code']) ? sanitize_text_field($data['zip_code']) : '',
            'price'         => isset($data['price']) ? floatval($data['price']) : null,
            'bedrooms'      => isset($data['bedrooms']) ? intval($data['bedrooms']) : null,
            'bathrooms'     => isset($data['bathrooms']) ? floatval($data['bathrooms']) : null,
            'square_feet'   => isset($data['square_feet']) ? intval($data['square_feet']) : null,
            'property_type' => isset($data['property_type']) ? sanitize_text_field($data['property_type']) : '',
            'status'        => isset($data['status']) ? sanitize_text_field($data['status']) : 'draft',
            'property_data' => isset($data['property_data']) ? wp_json_encode($data['property_data']) : null,
        );

        $inserted = $wpdb->insert($this->table_name, $property_data);

        if ($inserted) {
            return $wpdb->insert_id;
        }

        return false;
    }

    /**
     * Update property.
     */
    public function update($id, $data) {
        global $wpdb;

        $update_data = array();

        $allowed_fields = array(
            'title', 'description', 'address', 'city', 'state', 'zip_code',
            'price', 'bedrooms', 'bathrooms', 'square_feet', 'property_type', 'status'
        );

        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $update_data[$field] = $data[$field];
            }
        }

        if (isset($data['property_data'])) {
            $update_data['property_data'] = wp_json_encode($data['property_data']);
        }

        if (empty($update_data)) {
            return false;
        }

        $updated = $wpdb->update(
            $this->table_name,
            $update_data,
            array('id' => $id)
        );

        return $updated !== false;
    }

    /**
     * Delete property.
     */
    public function delete($id) {
        global $wpdb;

        // Delete images first
        $images = $this->get_images($id);
        foreach ($images as $image) {
            if (file_exists($image->file_path)) {
                unlink($image->file_path);
            }
        }

        $wpdb->delete($this->images_table, array('property_id' => $id));

        // Delete property
        $deleted = $wpdb->delete($this->table_name, array('id' => $id));

        return $deleted !== false;
    }

    /**
     * Get property images.
     */
    public function get_images($property_id) {
        global $wpdb;

        $images = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$this->images_table} WHERE property_id = %d ORDER BY image_order, id",
            $property_id
        ));

        // Add URLs to images
        $upload_dir = wp_upload_dir();
        foreach ($images as $image) {
            $image->url = str_replace($upload_dir['basedir'], $upload_dir['baseurl'], $image->file_path);
        }

        return $images;
    }

    /**
     * Add image to property.
     */
    public function add_image($data) {
        global $wpdb;

        $image_data = array(
            'property_id' => $data['property_id'],
            'file_path'   => $data['file_path'],
            'file_name'   => $data['file_name'],
            'file_size'   => isset($data['file_size']) ? $data['file_size'] : 0,
            'mime_type'   => isset($data['mime_type']) ? $data['mime_type'] : '',
            'image_order' => isset($data['image_order']) ? $data['image_order'] : 0,
            'caption'     => isset($data['caption']) ? $data['caption'] : '',
            'is_main'     => isset($data['is_main']) ? $data['is_main'] : 0,
        );

        $inserted = $wpdb->insert($this->images_table, $image_data);

        if ($inserted) {
            return $wpdb->insert_id;
        }

        return false;
    }

    /**
     * Set main image.
     */
    public function set_main_image($property_id, $image_id) {
        global $wpdb;

        // Unset current main image
        $wpdb->update(
            $this->images_table,
            array('is_main' => 0),
            array('property_id' => $property_id)
        );

        // Set new main image
        $updated = $wpdb->update(
            $this->images_table,
            array('is_main' => 1),
            array('id' => $image_id, 'property_id' => $property_id)
        );

        return $updated !== false;
    }
}
