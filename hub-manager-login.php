<?php
/*
Plugin Name: Hub Manager Login
Description: Login automático desde Hub Node, multi-web, con logos, imágenes, iconos y endpoint REST para React.
Version: 4.0.0
Author: Gabriel Rese
*/

if (!defined('ABSPATH')) exit;

/* ---------------------------------------------------------
   1. HELPERS PARA OBTENER LOGO E IMAGEN
--------------------------------------------------------- */
function hub_manager_get_logo_url()
{
    $logo_id = get_option('hub_manager_logo');
    return $logo_id ? wp_get_attachment_url($logo_id) : '';
}

function hub_manager_get_image_url()
{
    $img_id = get_option('hub_manager_image');
    return $img_id ? wp_get_attachment_url($img_id) : '';
}

/* ---------------------------------------------------------
   2. LOGIN POR TOKEN
--------------------------------------------------------- */
add_action('rest_api_init', function () {
    register_rest_route('filament/v1', '/login', [
        'methods' => 'GET',
        'callback' => 'hub_manager_login',
        'permission_callback' => '__return_true',
    ]);
});

function hub_manager_login($request)
{
    $token = $request->get_param('token');
    if (!$token) {
        return ['status' => 'error', 'message' => 'Falta token'];
    }

    $backend_url = 'https://backend-4tkovryc2-gabrielrese-gmailcoms-projects.vercel.app/api/tokens/validate';

    $response = wp_remote_post($backend_url, [
        'body' => json_encode(['token' => $token]),
        'headers' => ['Content-Type' => 'application/json'],
        'timeout' => 10
    ]);

    if (is_wp_error($response)) {
        return ['status' => 'error', 'message' => 'Error al conectar backend'];
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (empty($body['token']['valid'])) {
        return ['status' => 'error', 'message' => 'Token inválido'];
    }

    // Usuario fijo (en el futuro lee del backend si quieres)
    $user_id = 1;
    wp_set_current_user($user_id);
    wp_set_auth_cookie($user_id);

    wp_redirect(admin_url());
    exit;
}

/* ---------------------------------------------------------
   3. MENÚ DE ADMINISTRACIÓN
--------------------------------------------------------- */
add_action('admin_menu', function () {
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

/* ---------------------------------------------------------
   4. FORMULARIO DE AJUSTES
--------------------------------------------------------- */
function hub_manager_settings_page()
{
    if (is_admin()) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
    }

    // Guardar imágenes + contraseña
    if (isset($_POST['hub_manager_save_nonce']) &&
        wp_verify_nonce($_POST['hub_manager_save_nonce'], 'hub_manager_save_action')) {

        if (!empty($_FILES['hub_manager_logo']['name'])) {
            $logo_id = media_handle_upload('hub_manager_logo', 0);
            if (!is_wp_error($logo_id)) update_option('hub_manager_logo', $logo_id);
        }

        if (!empty($_FILES['hub_manager_image']['name'])) {
            $img_id = media_handle_upload('hub_manager_image', 0);
            if (!is_wp_error($img_id)) update_option('hub_manager_image', $img_id);
        }

        if (!empty($_POST['hub_manager_app_password'])) {
            update_option(
                'hub_manager_app_password',
                sanitize_text_field($_POST['hub_manager_app_password'])
            );
        }

        // Guardar iconos
        if (!empty($_POST['hub_manager_platform_icons'])) {
            update_option(
                'hub_manager_platform_icons',
                sanitize_text_field($_POST['hub_manager_platform_icons'])
            );
        }
    }

    $logo_url = hub_manager_get_logo_url();
    $img_url = hub_manager_get_image_url();
    $app_password = get_option('hub_manager_app_password', '');
    $icons_raw = get_option('hub_manager_platform_icons', '');
    ?>

    <div class="wrap">
        <h1>Hub Manager Login</h1>
        <form method="post" enctype="multipart/form-data">
            <?php wp_nonce_field('hub_manager_save_action', 'hub_manager_save_nonce'); ?>

            <table class="form-table">

                <tr>
                    <th>Logo</th>
                    <td>
                        <?php if ($logo_url): ?>
                            <img src="<?php echo esc_url($logo_url); ?>" style="max-width:150px;margin-bottom:8px;display:block;">
                        <?php endif; ?>
                        <input type="file" name="hub_manager_logo">
                    </td>
                </tr>

                <tr>
                    <th>Imagen adicional</th>
                    <td>
                        <?php if ($img_url): ?>
                            <img src="<?php echo esc_url($img_url); ?>" style="max-width:150px;margin-bottom:8px;display:block;">
                        <?php endif; ?>
                        <input type="file" name="hub_manager_image">
                    </td>
                </tr>

                <tr>
                    <th>App Password</th>
                    <td>
                        <input type="password" name="hub_manager_app_password"
                               value="<?php echo esc_attr($app_password); ?>"
                               class="regular-text">
                    </td>
                </tr>

                <tr>
                    <th>Iconos de plataforma</th>
                    <td>
                        <input type="text"
                               name="hub_manager_platform_icons"
                               value="<?php echo esc_attr($icons_raw); ?>"
                               class="regular-text"
                               style="width: 100%;">
                        <p class="description">
                            Escribe los iconos separados por comas.<br>
                            Ejemplo: <code>bi bi-wordpress, bi bi-cart-check, bi bi-apple</code>
                        </p>
                    </td>
                </tr>

            </table>

            <?php submit_button('Guardar cambios'); ?>
        </form>
    </div>

    <?php
}

/* ---------------------------------------------------------
   5. CONVERTIR ICONOS A ARRAY (IMPORTANTE)
--------------------------------------------------------- */
function hub_manager_get_platform_icons()
{
    $raw = get_option('hub_manager_platform_icons', '');
    if (!$raw) return [];
    
    $icons = array_map('trim', explode(',', $raw));
    return array_filter($icons);
}

/* ---------------------------------------------------------
   6. DETECCIÓN AUTOMÁTICA DE CMS/PLUGINS
--------------------------------------------------------- */
function hub_manager_get_platforms()
{
    $platforms = ['wordpress'];

    if (class_exists('WooCommerce')) {
        $platforms[] = 'woocommerce';
    }

    return $platforms;
}

/* ---------------------------------------------------------
   7. API REST DE STORES PARA REACT
--------------------------------------------------------- */
add_action('rest_api_init', function () {
    register_rest_route('filament/v1', '/stores', [
        'methods' => 'GET',
        'callback' => 'hub_manager_get_stores',
        'permission_callback' => '__return_true'
    ]);
});

function hub_manager_get_stores()
{
    return [
        [
            'id' => 1,
            'name' => get_bloginfo('name'),
            'platform' => hub_manager_get_platforms(),          // array WP + WOO
            'platform_icons' => hub_manager_get_platform_icons(), // array iconos personalizados
            'url' => get_site_url(),
            'username' => get_option('admin_email'),
            'app_password' => get_option('hub_manager_app_password', ''),
            'logo' => hub_manager_get_logo_url(),
            'image' => hub_manager_get_image_url()
        ]
    ];
}
