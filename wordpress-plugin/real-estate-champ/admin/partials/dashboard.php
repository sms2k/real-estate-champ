<?php
/**
 * Dashboard page template.
 */

$user_id = get_current_user_id();
$property_model = new REC_Property();
$properties = $property_model->get_by_user($user_id, 10);

global $wpdb;
$content_table = $wpdb->prefix . 'rec_generated_content';
$social_table = $wpdb->prefix . 'rec_social_accounts';

$total_properties = $wpdb->get_var($wpdb->prepare(
    "SELECT COUNT(*) FROM {$wpdb->prefix}rec_properties WHERE user_id = %d",
    $user_id
));

$total_content = $wpdb->get_var($wpdb->prepare(
    "SELECT COUNT(*) FROM $content_table WHERE property_id IN (SELECT id FROM {$wpdb->prefix}rec_properties WHERE user_id = %d)",
    $user_id
));

$connected_accounts = $wpdb->get_var($wpdb->prepare(
    "SELECT COUNT(*) FROM $social_table WHERE user_id = %d AND is_active = 1",
    $user_id
));

$pwa_enabled = get_option('rec_enable_pwa');
$pwa_app_url = get_option('rec_pwa_app_url');
?>

<div class="wrap">
    <h1><?php _e('Real Estate Champ Dashboard', 'real-estate-champ'); ?></h1>

    <div class="rec-dashboard">
        <!-- Stats Cards -->
        <div class="rec-stats-grid">
            <div class="rec-stat-card">
                <div class="rec-stat-icon">🏠</div>
                <div class="rec-stat-content">
                    <div class="rec-stat-number"><?php echo esc_html($total_properties); ?></div>
                    <div class="rec-stat-label"><?php _e('Properties', 'real-estate-champ'); ?></div>
                </div>
            </div>

            <div class="rec-stat-card">
                <div class="rec-stat-icon">✨</div>
                <div class="rec-stat-content">
                    <div class="rec-stat-number"><?php echo esc_html($total_content); ?></div>
                    <div class="rec-stat-label"><?php _e('Generated Content', 'real-estate-champ'); ?></div>
                </div>
            </div>

            <div class="rec-stat-card">
                <div class="rec-stat-icon">🔗</div>
                <div class="rec-stat-content">
                    <div class="rec-stat-number"><?php echo esc_html($connected_accounts); ?></div>
                    <div class="rec-stat-label"><?php _e('Connected Accounts', 'real-estate-champ'); ?></div>
                </div>
            </div>
        </div>

        <!-- PWA Info -->
        <?php if ($pwa_enabled && $pwa_app_url): ?>
        <div class="rec-pwa-box">
            <h2>📱 <?php _e('Mobile App (PWA)', 'real-estate-champ'); ?></h2>
            <p><?php _e('Access Real Estate Champ from your phone! Install the Progressive Web App for the best mobile experience.', 'real-estate-champ'); ?></p>
            <a href="<?php echo esc_url($pwa_app_url); ?>" class="button button-primary" target="_blank">
                <?php _e('Open Mobile App', 'real-estate-champ'); ?>
            </a>
            <p class="description">
                <?php _e('On your phone, visit this link and tap "Add to Home Screen" to install the app.', 'real-estate-champ'); ?>
            </p>
        </div>
        <?php endif; ?>

        <!-- Quick Actions -->
        <div class="rec-quick-actions">
            <h2><?php _e('Quick Actions', 'real-estate-champ'); ?></h2>
            <div class="rec-action-buttons">
                <a href="<?php echo admin_url('admin.php?page=real-estate-champ-properties&action=new'); ?>" class="button button-primary button-large">
                    <?php _e('+ New Property', 'real-estate-champ'); ?>
                </a>
                <a href="<?php echo admin_url('admin.php?page=real-estate-champ-social'); ?>" class="button button-large">
                    <?php _e('Connect Social Account', 'real-estate-champ'); ?>
                </a>
            </div>
        </div>

        <!-- Recent Properties -->
        <div class="rec-recent-properties">
            <h2><?php _e('Recent Properties', 'real-estate-champ'); ?></h2>
            <?php if (empty($properties)): ?>
                <p><?php _e('No properties yet. Create your first property listing!', 'real-estate-champ'); ?></p>
            <?php else: ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th><?php _e('Title', 'real-estate-champ'); ?></th>
                            <th><?php _e('Location', 'real-estate-champ'); ?></th>
                            <th><?php _e('Price', 'real-estate-champ'); ?></th>
                            <th><?php _e('Status', 'real-estate-champ'); ?></th>
                            <th><?php _e('Created', 'real-estate-champ'); ?></th>
                            <th><?php _e('Actions', 'real-estate-champ'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($properties as $property): ?>
                        <tr>
                            <td><strong><?php echo esc_html($property->title ?: 'Untitled'); ?></strong></td>
                            <td><?php echo esc_html($property->city . ', ' . $property->state); ?></td>
                            <td><?php echo $property->price ? '$' . number_format($property->price) : '—'; ?></td>
                            <td>
                                <span class="rec-status-badge rec-status-<?php echo esc_attr($property->status); ?>">
                                    <?php echo esc_html(ucfirst($property->status)); ?>
                                </span>
                            </td>
                            <td><?php echo esc_html(date('M j, Y', strtotime($property->created_at))); ?></td>
                            <td>
                                <a href="<?php echo admin_url('admin.php?page=real-estate-champ-properties&action=edit&id=' . $property->id); ?>">
                                    <?php _e('Edit', 'real-estate-champ'); ?>
                                </a> |
                                <a href="<?php echo admin_url('admin.php?page=real-estate-champ-properties&action=generate&id=' . $property->id); ?>">
                                    <?php _e('Generate Content', 'real-estate-champ'); ?>
                                </a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
</div>

<style>
.rec-dashboard {
    max-width: 1200px;
}

.rec-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.rec-stat-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.rec-stat-icon {
    font-size: 36px;
}

.rec-stat-number {
    font-size: 32px;
    font-weight: bold;
    color: #2271b1;
}

.rec-stat-label {
    color: #666;
    font-size: 14px;
}

.rec-pwa-box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 8px;
    padding: 30px;
    margin: 20px 0;
}

.rec-pwa-box h2 {
    color: #fff;
    margin-top: 0;
}

.rec-pwa-box .button {
    margin-top: 10px;
}

.rec-pwa-box .description {
    color: rgba(255,255,255,0.8);
    margin-top: 10px;
}

.rec-quick-actions {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.rec-action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.rec-recent-properties {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.rec-status-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 500;
}

.rec-status-draft {
    background: #f0f0f0;
    color: #666;
}

.rec-status-published {
    background: #d4edda;
    color: #155724;
}

.rec-status-archived {
    background: #fff3cd;
    color: #856404;
}
</style>
