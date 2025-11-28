<?php
/*
Plugin Name: Hub Manager Login
Description: Login automático desde Hub Node, multi-web, con logo e imagen dinámica, endpoint REST listo para React.
Version: 4.0.0
Author: Gabriel Rese
*/

if (!defined('ABSPATH')) exit;

// ---------------------------------------
// 1. Helpers para logo e imagen
// ---------------------------------------
function hub_manager_get_logo_url() {
    $logo_id = get_option('hub_manager_logo');
    return $logo_id ? wp_get_attachment_url($logo_id) : '';
}

function hub_manager_get_image_url() {
    $img_id = get_option('hub_manager_image');
    return $img_id ? wp_get_attachment_url($img_id) : '';
}

// ---------------------------------------
// 2. Login por token
// ---------------------------------------
add_action('rest_api_init', function() {
    register_rest_route('filament/v1', '/login', [
        'methods' => 'GET',
        'callback' => 'hub_manager_login',
        'permission_callback' => '__return_true',
    ]);
});

function hub_manager_login($request) {
    $token = $request->get_param('token');
    if (!$token) return ['status'=>'error','message'=>'Falta token'];

    $backend_url = 'https://backend-4tkovryc2-gabrielrese-gmailcoms-projects.vercel.app/api/tokens/validate';
    $response = wp_remote_post($backend_url, [
        'body'=>json_encode(['token'=>$token]),
        'headers'=>['Content-Type'=>'application/json'],
        'timeout'=>10
    ]);

    if(is_wp_error($response)) return ['status'=>'error','message'=>'Error al conectar backend'];

    $body = json_decode(wp_remote_retrieve_body($response), true);
    if(empty($body['token']['valid']) || !$body['token']['valid']) return ['status'=>'error','message'=>'Token inválido'];

    $email = $body['token']['email'] ?? '';
    if (!$email) return ['status'=>'error','message'=>'Token sin email'];

    $user = get_user_by('email', $email);
    if (!$user) return ['status'=>'error','message'=>'Usuario no encontrado: ' . $email];

    wp_set_current_user($user->ID);
    wp_set_auth_cookie($user->ID);
    wp_redirect(admin_url());
    exit;
    wp_redirect(admin_url());
    exit;
}

function hub_manager_sync_data() {
    $backend_url = 'https://backend-4tkovryc2-gabrielrese-gmailcoms-projects.vercel.app/api/stores/sync';
    // Para local testing si es necesario, descomentar:
    // $backend_url = 'http://localhost:3000/api/stores/sync';

    $body = [
        'url' => get_site_url(),
        'logo' => hub_manager_get_logo_url(),
        'image' => hub_manager_get_image_url(),
        'app_password' => get_option('hub_manager_app_password','')
    ];

    wp_remote_request($backend_url, [
        'method' => 'PUT',
        'body' => json_encode($body),
        'headers' => ['Content-Type' => 'application/json'],
        'timeout' => 5,
        'blocking' => false
    ]);
}

// ---------------------------------------
// 3. Menú admin y subida de archivos
// ---------------------------------------
add_action('admin_menu', function() {
    add_menu_page(
        'Hub Manager Login',
        'Hub Manager',
        'manage_options',
        'hub-manager-login',
        'hub_manager_settings_page',
        'dashicons-admin-network',
        80
    );
});

function hub_manager_settings_page() {
    if (is_admin()) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
    }

    // Guardar imágenes
    if(isset($_POST['hub_manager_save_nonce']) && wp_verify_nonce($_POST['hub_manager_save_nonce'],'hub_manager_save_action')) {
        if(!empty($_FILES['hub_manager_logo']['name'])) {
            $logo_id = media_handle_upload('hub_manager_logo', 0);
            if(!is_wp_error($logo_id)) update_option('hub_manager_logo',$logo_id);
        }
        if(!empty($_FILES['hub_manager_image']['name'])) {
            $img_id = media_handle_upload('hub_manager_image',0);
            if(!is_wp_error($img_id)) update_option('hub_manager_image',$img_id);
        }
        if(!empty($_POST['hub_manager_app_password'])) {
            update_option('hub_manager_app_password', sanitize_text_field($_POST['hub_manager_app_password']));
        }
        
        // Sincronizar con backend
        hub_manager_sync_data();
    }

    $logo_url = hub_manager_get_logo_url();
    $img_url = hub_manager_get_image_url();
    $app_password = get_option('hub_manager_app_password','');

    ?>
    <div class="wrap">
        <h1>Hub Manager Login</h1>
        <form method="post" enctype="multipart/form-data">
            <?php wp_nonce_field('hub_manager_save_action','hub_manager_save_nonce'); ?>
            <table class="form-table">
                <tr>
                    <th>Logo</th>
                    <td>
                        <?php if($logo_url): ?><img src="<?php echo esc_url($logo_url); ?>" style="max-width:150px;display:block;margin-bottom:8px;"><?php endif; ?>
                        <input type="file" name="hub_manager_logo">
                    </td>
                </tr>
                <tr>
                    <th>Imagen adicional</th>
                    <td>
                        <?php if($img_url): ?><img src="<?php echo esc_url($img_url); ?>" style="max-width:150px;display:block;margin-bottom:8px;"><?php endif; ?>
                        <input type="file" name="hub_manager_image">
                    </td>
                </tr>
                <tr>
                    <th>App Password</th>
                    <td><input type="text" name="hub_manager_app_password" value="<?php echo esc_attr($app_password); ?>" class="regular-text"></td>
                </tr>
            </table>
            <?php submit_button('Guardar cambios'); ?>
        </form>
    </div>
    <?php
}

// ---------------------------------------
// 4. Endpoint REST unificado para stores
// ---------------------------------------
add_action('rest_api_init', function() {
    register_rest_route('filament/v1','/stores',[
        'methods'=>'GET',
        'callback'=>'hub_manager_get_stores',
        'permission_callback'=>'__return_true'
    ]);
});

function hub_manager_get_stores() {
    $stores = [];

    // Ejemplo WP store
    $stores[] = [
        'id'=>1,
        'name'=>get_bloginfo('name'),
        'platform'=>'WP + WOO',
        'url'=>get_site_url(),
        'username'=>get_option('admin_email'),
        'app_password'=>get_option('hub_manager_app_password',''),
        'logo'=>hub_manager_get_logo_url(),
        'image'=>hub_manager_get_image_url()
    ];


    return $stores;
}
