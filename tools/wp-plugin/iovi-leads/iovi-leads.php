<?php
/**
 * Plugin Name: IOVI Leady
 * Description: Licznik kontaktów ze strony iovi-ink.pl (formularz, Instagram, e-mail, telefon, trasa). Zdarzenia przysyła frontend Next.js przez REST (/wp-json/iovi/v1/lead) z sekretem.
 * Version: 1.0.0
 * Author: Kacper Adamczyk
 */

if (!defined('ABSPATH')) {
	exit;
}

const IOVI_LEADS_TYPES = [
	'formularz' => 'Formularz kontaktowy',
	'instagram' => 'Klik w Instagram',
	'email'     => 'Klik w e-mail',
	'telefon'   => 'Klik w telefon',
	'trasa'     => 'Klik w trasę (Mapy Google)',
];

function iovi_leads_table() {
	global $wpdb;
	return $wpdb->prefix . 'iovi_leads';
}

register_activation_hook(__FILE__, function () {
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$table = iovi_leads_table();
	$charset = $wpdb->get_charset_collate();
	// Bez danych osobowych: brak IP, imion i e-maili — tylko kanał i miejsce na stronie.
	dbDelta("CREATE TABLE $table (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		created_at datetime NOT NULL,
		type varchar(20) NOT NULL,
		page_path varchar(255) NOT NULL DEFAULT '',
		placement varchar(80) NOT NULL DEFAULT '',
		referrer varchar(255) NOT NULL DEFAULT '',
		PRIMARY KEY  (id),
		KEY type_created (type, created_at)
	) $charset;");
});

add_action('rest_api_init', function () {
	register_rest_route('iovi/v1', '/lead', [
		'methods'             => 'POST',
		'permission_callback' => function (WP_REST_Request $request) {
			$secret = get_option('iovi_leads_secret');
			return $secret && hash_equals($secret, (string) $request->get_header('x-iovi-secret'));
		},
		'callback'            => function (WP_REST_Request $request) {
			global $wpdb;
			$type = sanitize_key($request->get_param('type'));
			if (!isset(IOVI_LEADS_TYPES[$type])) {
				return new WP_Error('iovi_bad_type', 'Nieznany typ zdarzenia', ['status' => 400]);
			}
			$wpdb->insert(iovi_leads_table(), [
				'created_at' => current_time('mysql'),
				'type'       => $type,
				'page_path'  => mb_substr(sanitize_text_field((string) $request->get_param('page_path')), 0, 255),
				'placement'  => mb_substr(sanitize_text_field((string) $request->get_param('placement')), 0, 80),
				'referrer'   => mb_substr(sanitize_text_field((string) $request->get_param('referrer')), 0, 255),
			]);
			return ['ok' => true, 'id' => $wpdb->insert_id];
		},
	]);
});

add_action('admin_menu', function () {
	add_menu_page('Leady', 'Leady', 'edit_posts', 'iovi-leads', 'iovi_leads_page', 'dashicons-chart-bar', 3);
});

function iovi_leads_counts($days) {
	global $wpdb;
	$table = iovi_leads_table();
	$where = $days ? $wpdb->prepare('WHERE created_at >= %s', date('Y-m-d H:i:s', current_time('timestamp') - $days * DAY_IN_SECONDS)) : '';
	$rows = $wpdb->get_results("SELECT type, COUNT(*) AS n FROM $table $where GROUP BY type", OBJECT_K);
	$counts = array_map(fn($label) => 0, IOVI_LEADS_TYPES);
	foreach ($rows as $type => $row) {
		if (isset($counts[$type])) {
			$counts[$type] = (int) $row->n;
		}
	}
	return $counts;
}

function iovi_leads_page() {
	global $wpdb;
	$table = iovi_leads_table();
	$periods = ['7 dni' => 7, '30 dni' => 30, '90 dni' => 90, 'Od początku' => 0];
	$counts = array_map('iovi_leads_counts', $periods);
	$since30 = date('Y-m-d H:i:s', current_time('timestamp') - 30 * DAY_IN_SECONDS);
	$by_place = $wpdb->get_results($wpdb->prepare(
		"SELECT type, placement, page_path, COUNT(*) AS n FROM $table WHERE created_at >= %s
		 GROUP BY type, placement, page_path ORDER BY n DESC LIMIT 30", $since30));
	$recent = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC LIMIT 50");
	?>
	<div class="wrap">
		<h1>Leady ze strony iovi-ink.pl</h1>
		<p>Kontakty ze strony: wysłane formularze i kliknięcia w kanały kontaktu. Kliknięcie w Instagram to wejście na profil (wiadomość wysyła się już w Instagramie).</p>

		<h2>Liczniki</h2>
		<table class="widefat striped" style="max-width:900px">
			<thead><tr><th>Kanał</th><?php foreach ($periods as $label => $_) : ?><th><?php echo esc_html($label); ?></th><?php endforeach; ?></tr></thead>
			<tbody>
			<?php foreach (IOVI_LEADS_TYPES as $type => $label) : ?>
				<tr><td><strong><?php echo esc_html($label); ?></strong></td>
				<?php foreach ($periods as $p => $_) : ?><td><?php echo (int) $counts[$p][$type]; ?></td><?php endforeach; ?></tr>
			<?php endforeach; ?>
			</tbody>
		</table>

		<h2>Skąd klikają (30 dni)</h2>
		<table class="widefat striped" style="max-width:900px">
			<thead><tr><th>Kanał</th><th>Miejsce na stronie</th><th>Podstrona</th><th>Liczba</th></tr></thead>
			<tbody>
			<?php foreach ($by_place as $r) : ?>
				<tr><td><?php echo esc_html(IOVI_LEADS_TYPES[$r->type] ?? $r->type); ?></td><td><?php echo esc_html($r->placement); ?></td><td><?php echo esc_html($r->page_path); ?></td><td><?php echo (int) $r->n; ?></td></tr>
			<?php endforeach; ?>
			<?php if (!$by_place) : ?><tr><td colspan="4">Brak zdarzeń w ostatnich 30 dniach.</td></tr><?php endif; ?>
			</tbody>
		</table>

		<h2>Ostatnie zdarzenia</h2>
		<table class="widefat striped" style="max-width:900px">
			<thead><tr><th>Data</th><th>Kanał</th><th>Miejsce</th><th>Podstrona</th><th>Wejście z</th></tr></thead>
			<tbody>
			<?php foreach ($recent as $r) : ?>
				<tr><td><?php echo esc_html($r->created_at); ?></td><td><?php echo esc_html(IOVI_LEADS_TYPES[$r->type] ?? $r->type); ?></td><td><?php echo esc_html($r->placement); ?></td><td><?php echo esc_html($r->page_path); ?></td><td><?php echo esc_html($r->referrer); ?></td></tr>
			<?php endforeach; ?>
			<?php if (!$recent) : ?><tr><td colspan="5">Jeszcze nic.</td></tr><?php endif; ?>
			</tbody>
		</table>
	</div>
	<?php
}

// Kafelek na pulpicie WP
add_action('wp_dashboard_setup', function () {
	wp_add_dashboard_widget('iovi_leads_widget', 'Leady (30 dni)', function () {
		foreach (iovi_leads_counts(30) as $type => $n) {
			echo '<p>' . esc_html(IOVI_LEADS_TYPES[$type]) . ': <strong>' . (int) $n . '</strong></p>';
		}
		echo '<p><a href="' . esc_url(admin_url('admin.php?page=iovi-leads')) . '">Szczegóły</a></p>';
	});
});
