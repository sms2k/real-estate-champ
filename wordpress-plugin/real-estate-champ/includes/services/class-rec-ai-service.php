<?php
/**
 * AI Service - Integrates with Google Gemini API.
 */
class REC_AI_Service {

    private $api_key;

    public function __construct() {
        $this->api_key = get_option('rec_google_ai_api_key');
    }

    /**
     * Chat with AI.
     */
    public function chat($messages, $property_id = null) {
        if (!$this->api_key) {
            return array(
                'error' => 'Google AI API key not configured',
            );
        }

        $url = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=' . $this->api_key;

        // Convert messages to Gemini format
        $contents = array();
        foreach ($messages as $msg) {
            $contents[] = array(
                'role' => $msg['role'] === 'user' ? 'user' : 'model',
                'parts' => array(array('text' => $msg['content'])),
            );
        }

        $body = array(
            'contents' => $contents,
        );

        $response = wp_remote_post($url, array(
            'body'    => wp_json_encode($body),
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'timeout' => 30,
        ));

        if (is_wp_error($response)) {
            return array('error' => $response->get_error_message());
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);

        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            $reply = $data['candidates'][0]['content']['parts'][0]['text'];

            // Extract property data if this is for a property
            if ($property_id) {
                $this->extract_and_save_property_data($property_id, $messages, $reply);
            }

            return array(
                'message' => $reply,
                'success' => true,
            );
        }

        return array('error' => 'Unexpected API response');
    }

    /**
     * Generate content for property.
     */
    public function generate_content($property_id, $platforms) {
        $property_model = new REC_Property();
        $property = $property_model->get($property_id);

        if (!$property) {
            return array('error' => 'Property not found');
        }

        $generated_content = array();

        // Generate blog post
        if (in_array('blog', $platforms)) {
            $blog_content = $this->generate_blog_post($property);
            if ($blog_content) {
                $generated_content['blog'] = $blog_content;
            }
        }

        // Generate social media posts
        $social_platforms = array_intersect($platforms, array('facebook', 'instagram', 'linkedin', 'google_business'));
        foreach ($social_platforms as $platform) {
            $social_content = $this->generate_social_post($property, $platform);
            if ($social_content) {
                $generated_content[$platform] = $social_content;
            }
        }

        return $generated_content;
    }

    /**
     * Generate blog post.
     */
    private function generate_blog_post($property) {
        $prompt = "Create an engaging, SEO-optimized blog post for this property:\n\n";
        $prompt .= "Title: {$property->title}\n";
        $prompt .= "Price: $" . number_format($property->price) . "\n";
        $prompt .= "Location: {$property->city}, {$property->state}\n";
        $prompt .= "Bedrooms: {$property->bedrooms}, Bathrooms: {$property->bathrooms}\n";
        $prompt .= "Description: {$property->description}\n\n";
        $prompt .= "Generate a well-structured blog post with an engaging title, introduction, detailed description highlighting features, and a conclusion. Minimum 500 words.";

        $response = $this->call_gemini($prompt);

        if ($response && isset($response['message'])) {
            // Save to database
            $content_model = new REC_Content();
            $content_id = $content_model->create(array(
                'property_id'  => $property->id,
                'content_type' => 'blog',
                'title'        => $property->title,
                'content'      => $response['message'],
                'status'       => 'generated',
            ));

            return array(
                'id'      => $content_id,
                'content' => $response['message'],
            );
        }

        return null;
    }

    /**
     * Generate social media post.
     */
    private function generate_social_post($property, $platform) {
        $platform_specs = array(
            'facebook'       => array('max_length' => 500, 'style' => 'conversational'),
            'instagram'      => array('max_length' => 2200, 'style' => 'visually descriptive'),
            'linkedin'       => array('max_length' => 700, 'style' => 'professional'),
            'google_business' => array('max_length' => 1500, 'style' => 'local and community-focused'),
        );

        $spec = $platform_specs[$platform];

        $prompt = "Create a {$spec['style']} {$platform} post for this property (max {$spec['max_length']} chars):\n\n";
        $prompt .= "Property: {$property->title}\n";
        $prompt .= "Price: $" . number_format($property->price) . "\n";
        $prompt .= "Location: {$property->city}, {$property->state}\n";
        $prompt .= "Beds/Baths: {$property->bedrooms}/{$property->bathrooms}\n\n";
        $prompt .= "Include relevant hashtags and a call to action.";

        $response = $this->call_gemini($prompt);

        if ($response && isset($response['message'])) {
            $content_model = new REC_Content();
            $content_id = $content_model->create(array(
                'property_id'  => $property->id,
                'content_type' => 'social',
                'platform'     => $platform,
                'content'      => $response['message'],
                'status'       => 'generated',
            ));

            return array(
                'id'      => $content_id,
                'content' => $response['message'],
            );
        }

        return null;
    }

    /**
     * Call Gemini API.
     */
    private function call_gemini($prompt) {
        return $this->chat(array(
            array('role' => 'user', 'content' => $prompt),
        ));
    }

    /**
     * Extract property data from conversation.
     */
    private function extract_and_save_property_data($property_id, $messages, $latest_response) {
        // This would use AI to extract structured data from the conversation
        // For now, just store the conversation
        $property_model = new REC_Property();
        $property = $property_model->get($property_id);

        if ($property) {
            $property_data = $property->property_data ?: array();
            $property_data['chat_history'] = $messages;

            $property_model->update($property_id, array(
                'property_data' => $property_data,
            ));
        }
    }
}
