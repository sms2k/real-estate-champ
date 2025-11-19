<?php
/**
 * Properties page template.
 */

$user_id = get_current_user_id();
$property_model = new REC_Property();
$properties = $property_model->get_by_user($user_id, 50);
?>

<div class="wrap">
    <h1 class="wp-heading-inline"><?php _e('Properties', 'real-estate-champ'); ?></h1>
    <a href="<?php echo esc_url(get_option('rec_pwa_app_url')); ?>" class="page-title-action" target="_blank">
        <?php _e('+ Add New (via Mobile App)', 'real-estate-champ'); ?>
    </a>
    <hr class="wp-header-end">

    <?php if (empty($properties)): ?>
        <div class="rec-empty-state">
            <div class="rec-empty-icon">🏠</div>
            <h2><?php _e('No Properties Yet', 'real-estate-champ'); ?></h2>
            <p><?php _e('Create your first property listing using the mobile PWA app!', 'real-estate-champ'); ?></p>
            <?php if (get_option('rec_pwa_app_url')): ?>
                <a href="<?php echo esc_url(get_option('rec_pwa_app_url')); ?>" class="button button-primary button-large" target="_blank">
                    <?php _e('Open Mobile App', 'real-estate-champ'); ?>
                </a>
            <?php endif; ?>
        </div>
    <?php else: ?>
        <table class="wp-list-table widefat fixed striped table-view-list">
            <thead>
                <tr>
                    <th><?php _e('Image', 'real-estate-champ'); ?></th>
                    <th><?php _e('Title', 'real-estate-champ'); ?></th>
                    <th><?php _e('Location', 'real-estate-champ'); ?></th>
                    <th><?php _e('Price', 'real-estate-champ'); ?></th>
                    <th><?php _e('Beds/Baths', 'real-estate-champ'); ?></th>
                    <th><?php _e('Status', 'real-estate-champ'); ?></th>
                    <th><?php _e('Created', 'real-estate-champ'); ?></th>
                    <th><?php _e('Actions', 'real-estate-champ'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($properties as $property): ?>
                <tr>
                    <td>
                        <?php if (!empty($property->images)): ?>
                            <img src="<?php echo esc_url($property->images[0]->url); ?>" alt="" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                        <?php else: ?>
                            <div style="width: 60px; height: 60px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                                🏠
                            </div>
                        <?php endif; ?>
                    </td>
                    <td><strong><?php echo esc_html($property->title ?: 'Untitled'); ?></strong></td>
                    <td><?php echo esc_html(($property->city ? $property->city . ', ' : '') . $property->state); ?></td>
                    <td><?php echo $property->price ? '$' . number_format($property->price) : '—'; ?></td>
                    <td><?php echo esc_html($property->bedrooms . ' / ' . $property->bathrooms); ?></td>
                    <td>
                        <span class="rec-status-badge rec-status-<?php echo esc_attr($property->status); ?>">
                            <?php echo esc_html(ucfirst($property->status)); ?>
                        </span>
                    </td>
                    <td><?php echo esc_html(date('M j, Y', strtotime($property->created_at))); ?></td>
                    <td>
                        <button class="button button-small rec-view-property" data-property-id="<?php echo esc_attr($property->id); ?>">
                            <?php _e('View Details', 'real-estate-champ'); ?>
                        </button>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<style>
.rec-empty-state {
    text-align: center;
    padding: 60px 20px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 20px;
}

.rec-empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
}

.rec-empty-state h2 {
    margin: 0 0 10px 0;
}

.rec-empty-state p {
    color: #666;
    margin-bottom: 20px;
}
</style>

<script>
jQuery(document).ready(function($) {
    $('.rec-view-property').on('click', function() {
        const propertyId = $(this).data('property-id');
        // Could open a modal or redirect to view page
        alert('Property details modal would open here for property ID: ' + propertyId);
    });
});
</script>
