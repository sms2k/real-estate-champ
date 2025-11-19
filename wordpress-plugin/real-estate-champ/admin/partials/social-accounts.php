<?php
/**
 * Social accounts page template.
 */

global $wpdb;
$user_id = get_current_user_id();
$table_name = $wpdb->prefix . 'rec_social_accounts';

$accounts = $wpdb->get_results($wpdb->prepare(
    "SELECT * FROM $table_name WHERE user_id = %d ORDER BY created_at DESC",
    $user_id
));
?>

<div class="wrap">
    <h1><?php _e('Connected Accounts', 'real-estate-champ'); ?></h1>

    <p><?php _e('Connect your social media accounts to publish property listings directly from the mobile app.', 'real-estate-champ'); ?></p>

    <div class="rec-social-connect">
        <h2><?php _e('Connect New Account', 'real-estate-champ'); ?></h2>
        <p><?php _e('Use the mobile PWA app to connect your social media accounts. The connection process requires OAuth which works best in the mobile app.', 'real-estate-champ'); ?></p>

        <?php if (get_option('rec_pwa_app_url')): ?>
            <a href="<?php echo esc_url(get_option('rec_pwa_app_url') . '/dashboard/settings'); ?>" class="button button-primary" target="_blank">
                <?php _e('Open App to Connect Accounts', 'real-estate-champ'); ?>
            </a>
        <?php endif; ?>
    </div>

    <h2><?php _e('Your Connected Accounts', 'real-estate-champ'); ?></h2>

    <?php if (empty($accounts)): ?>
        <div class="rec-empty-state">
            <p><?php _e('No accounts connected yet.', 'real-estate-champ'); ?></p>
        </div>
    <?php else: ?>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th><?php _e('Platform', 'real-estate-champ'); ?></th>
                    <th><?php _e('Username', 'real-estate-champ'); ?></th>
                    <th><?php _e('Status', 'real-estate-champ'); ?></th>
                    <th><?php _e('Connected', 'real-estate-champ'); ?></th>
                    <th><?php _e('Actions', 'real-estate-champ'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($accounts as $account): ?>
                <tr>
                    <td>
                        <strong><?php echo esc_html(ucfirst($account->platform)); ?></strong>
                    </td>
                    <td><?php echo esc_html($account->platform_username ?: '—'); ?></td>
                    <td>
                        <?php if ($account->is_active): ?>
                            <span class="rec-status-badge" style="background: #d4edda; color: #155724;">
                                <?php _e('Active', 'real-estate-champ'); ?>
                            </span>
                        <?php else: ?>
                            <span class="rec-status-badge" style="background: #f8d7da; color: #721c24;">
                                <?php _e('Inactive', 'real-estate-champ'); ?>
                            </span>
                        <?php endif; ?>
                    </td>
                    <td><?php echo esc_html(date('M j, Y', strtotime($account->created_at))); ?></td>
                    <td>
                        <button class="button button-small rec-disconnect-account" data-account-id="<?php echo esc_attr($account->id); ?>">
                            <?php _e('Disconnect', 'real-estate-champ'); ?>
                        </button>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<style>
.rec-social-connect {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.rec-empty-state {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    margin: 20px 0;
}
</style>

<script>
jQuery(document).ready(function($) {
    $('.rec-disconnect-account').on('click', function() {
        if (confirm('<?php _e('Are you sure you want to disconnect this account?', 'real-estate-champ'); ?>')) {
            const accountId = $(this).data('account-id');
            // TODO: Implement disconnect via AJAX
            alert('Disconnect functionality would be implemented here');
        }
    });
});
</script>
