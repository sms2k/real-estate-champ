<?php
/**
 * Generated content model.
 */
class REC_Content {

    private $table_name;

    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'rec_generated_content';
    }

    /**
     * Get content by ID.
     */
    public function get($id) {
        global $wpdb;

        $content = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE id = %d",
            $id
        ));

        if ($content) {
            // Decode JSON fields
            if ($content->images) {
                $content->images = json_decode($content->images, true);
            }
            if ($content->metadata) {
                $content->metadata = json_decode($content->metadata, true);
            }
        }

        return $content;
    }

    /**
     * Get all content for a property.
     */
    public function get_by_property($property_id) {
        global $wpdb;

        $contents = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE property_id = %d ORDER BY created_at DESC",
            $property_id
        ));

        foreach ($contents as $content) {
            if ($content->images) {
                $content->images = json_decode($content->images, true);
            }
            if ($content->metadata) {
                $content->metadata = json_decode($content->metadata, true);
            }
        }

        return $contents;
    }

    /**
     * Create new content.
     */
    public function create($data) {
        global $wpdb;

        $content_data = array(
            'property_id'  => $data['property_id'],
            'content_type' => sanitize_text_field($data['content_type']),
            'platform'     => isset($data['platform']) ? sanitize_text_field($data['platform']) : null,
            'title'        => isset($data['title']) ? sanitize_text_field($data['title']) : null,
            'content'      => wp_kses_post($data['content']),
            'images'       => isset($data['images']) ? wp_json_encode($data['images']) : null,
            'video_path'   => isset($data['video_path']) ? sanitize_text_field($data['video_path']) : null,
            'status'       => isset($data['status']) ? sanitize_text_field($data['status']) : 'pending',
            'metadata'     => isset($data['metadata']) ? wp_json_encode($data['metadata']) : null,
        );

        $inserted = $wpdb->insert($this->table_name, $content_data);

        if ($inserted) {
            return $wpdb->insert_id;
        }

        return false;
    }

    /**
     * Update content.
     */
    public function update($id, $data) {
        global $wpdb;

        $update_data = array();

        if (isset($data['status'])) {
            $update_data['status'] = sanitize_text_field($data['status']);
        }

        if (isset($data['published_at'])) {
            $update_data['published_at'] = $data['published_at'];
        }

        if (isset($data['error_message'])) {
            $update_data['error_message'] = sanitize_text_field($data['error_message']);
        }

        if (isset($data['metadata'])) {
            $update_data['metadata'] = wp_json_encode($data['metadata']);
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
     * Delete content.
     */
    public function delete($id) {
        global $wpdb;

        $deleted = $wpdb->delete($this->table_name, array('id' => $id));

        return $deleted !== false;
    }
}
