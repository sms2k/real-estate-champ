<?php
/**
 * Fired during plugin deactivation.
 */
class REC_Deactivator {

    /**
     * Deactivation hook.
     */
    public static function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();

        // Note: We don't delete tables or data on deactivation
        // Users should manually delete data if they want to completely remove the plugin
    }
}
