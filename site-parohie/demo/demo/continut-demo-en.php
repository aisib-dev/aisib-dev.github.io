<?php
/**
 * Demo content (ENGLISH) for the fictional parish. Run once inside WordPress (blueprint runPHP step),
 * with this folder mounted at /demo.
 *
 * @package Candela\Demo
 */

require_once '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

// Categories exist after activation; make sure anyway.
Candela\Core\Articole\Articole::categorii();
$cat_anunt = get_category_by_slug( 'anunturi' )->term_id;
$cat_blog  = get_category_by_slug( 'articole' )->term_id;

/** Paragraph blocks from plain strings. */
function candela_demo_par( array $paragrafe ): string {
	$out = '';
	foreach ( $paragrafe as $p ) {
		$out .= '<!-- wp:paragraph --><p>' . esc_html( $p ) . '</p><!-- /wp:paragraph -->';
	}
	return $out;
}

/** Imports an image from /demo/imagini as an attachment. */
function candela_demo_imagine( string $fisier, int $post_id, string $alt ): void {
	$up   = wp_upload_dir();
	$dest = trailingslashit( $up['path'] ) . $fisier;
	copy( __DIR__ . '/imagini/' . $fisier, $dest );
	$id = wp_insert_attachment(
		array(
			'post_mime_type' => 'image/jpeg',
			'post_title'     => $alt,
			'post_status'    => 'inherit',
		),
		$dest,
		$post_id
	);
	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $dest ) );
	update_post_meta( $id, '_wp_attachment_image_alt', $alt );
	set_post_thumbnail( $post_id, $id );
}

// Remove the default post and sample page.
wp_delete_post( 1, true );
wp_delete_post( 2, true );

// Pages.
$tipar = WP_Block_Patterns_Registry::get_instance()->get_registered( 'candela/acasa' );
$acasa = wp_insert_post(
	array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'Home',
		'post_content' => $tipar ? $tipar['content'] : '',
		'menu_order'   => 1,
	)
);
$ordine          = 2;
$pagini          = array();
$continut_pagini = array(
	'blog'     => '',
	'pomelnic' => candela_demo_par( array( 'Write the baptismal names of your loved ones, living or departed. Father commemorates them at the Divine Liturgy, at the Proskomedia, where a particle is taken from the prosphora for each name.' ) )
		. '<!-- wp:candela/formular {"tip":"pomelnic"} /-->',
	'slujbe'   => '<!-- wp:heading --><h2 class="wp-block-heading">This month</h2><!-- /wp:heading -->'
		. '<!-- wp:candela/program-slujbe {"vedere":"luna","align":"wide"} /-->'
		. '<!-- wp:heading --><h2 class="wp-block-heading">Schedule for the noticeboard</h2><!-- /wp:heading -->'
		. '<!-- wp:candela/program-slujbe {"vedere":"lista","zile":31} /-->'
		. '<!-- wp:heading --><h2 class="wp-block-heading" id="programare">Request a service</h2><!-- /wp:heading -->'
		. candela_demo_par( array( 'For a baptism, wedding, confession, house blessing or memorial service, choose a convenient date. Father will call you to confirm, after checking the church schedule.' ) )
		. '<!-- wp:candela/formular {"tip":"programare"} /-->',
	'contact'  => '<!-- wp:columns {"align":"wide"} --><div class="wp-block-columns alignwide"><!-- wp:column --><div class="wp-block-column">'
		. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Find us here</h3><!-- /wp:heading -->'
		. '<!-- wp:candela/contact {"arataNume":true} /-->'
		. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">How to get here</h3><!-- /wp:heading -->'
		. '<!-- wp:candela/harta /-->'
		. '</div><!-- /wp:column --><!-- wp:column {"width":"55%"} --><div class="wp-block-column" style="flex-basis:55%">'
		. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Write to us</h3><!-- /wp:heading -->'
		. '<!-- wp:candela/formular {"tip":"contact"} /-->'
		. '</div><!-- /wp:column --></div><!-- /wp:columns -->',
	'sprijin'  => candela_demo_par( array( 'The parish lives from the gifts of its faithful. They pay for the church building, candles and prosphora, help for families in need and the children’s camps. Thank you for any help, however small.' ) )
		. '<!-- wp:candela/sprijin {"align":"wide"} /-->'
		. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Other ways to help</h3><!-- /wp:heading -->'
		. candela_demo_par( array( 'We need help with cleaning the church, the choir, coffee hour after the Liturgy and visits to the elderly. Write to us or speak with Father after the service.' ) ),
	'despre'   => candela_demo_par( array( 'St. Nicholas Orthodox Church gathers families from Springfield and the surrounding towns every Sunday. It is a fictional parish, created to show what a Candela Parohiei website looks like.' ) )
		. '<!-- wp:heading --><h2 class="wp-block-heading">Our patron saint</h2><!-- /wp:heading -->'
		. candela_demo_par( array( 'Our patron is Saint Nicholas, Archbishop of Myra in Lycia, commemorated on December 6. On the eve of the feast, the children of the parish receive gifts after Vespers.' ) )
		. '<!-- wp:heading --><h2 class="wp-block-heading">Our history</h2><!-- /wp:heading -->'
		. candela_demo_par( array( 'Here the parish tells its story: when it was founded, where the first services were held, who served, what was built and how the community grew. We write this text together with Father, from what he sends us.' ) )
		. '<!-- wp:heading --><h2 class="wp-block-heading">Our priest</h2><!-- /wp:heading -->'
		. '<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"candela/organizatie","args":{"key":"preot_nume"}}}}} --><p></p><!-- /wp:paragraph -->'
		. candela_demo_par( array( 'A few lines about the parish priest: his ordination, his ministry, and how to reach him for confession or a word of counsel.' ) ),
	'italiano' => '<!-- wp:group {"className":"candela-lang-it","layout":{"type":"constrained"}} --><div class="wp-block-group candela-lang-it">'
		. candela_demo_par( array(
			'La Parrocchia Ortodossa Romena «San Nicola» accoglie ogni domenica le famiglie romene della città e dei dintorni. La Divina Liturgia è celebrata in lingua romena; tutti sono i benvenuti.',
			'Per battesimi, matrimoni o altre celebrazioni potete scriverci tramite la pagina Contatti o telefonare al parroco.',
			'Questa è una parrocchia fittizia, creata per mostrare un sito Candela Parohiei.',
		) )
		. '<!-- wp:candela/contact /-->'
		. '</div><!-- /wp:group -->',
);
foreach ( array( 'About us' => 'despre', 'Services' => 'slujbe', 'Blog' => 'blog', 'Names for prayer' => 'pomelnic', 'Give' => 'sprijin', 'Contact' => 'contact' ) as $titlu => $slug ) {
	$pagini[ $slug ] = wp_insert_post(
		array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $titlu,
			'post_name'    => $slug,
			'menu_order'   => $ordine++,
			'post_content' => $continut_pagini[ $slug ] ?? candela_demo_par( array( 'Demo page.' ) ),
		)
	);
}
// Privacy page for the parish's visitors (the template every client site gets).
$confidentialitate = wp_insert_post(
	array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'Privacy',
			'post_name'    => 'privacy',
			'post_content' => candela_demo_par(
				array(
					'The parish is responsible for the data you send through this website. For any question about it, write to us through the contact page.',
					'Names for prayer: the baptismal names of those to be commemorated and, if you wish, your own name. Service requests: your name, phone or email and the details of the service. We use them only to pray at the service or to answer you.',
					'Data sent through the forms is deleted automatically after 40 days. Only the priest and those who maintain the site on behalf of the parish can see it. We never sell it or pass it on; email notifications do not contain your data.',
					'This website uses no tracking or advertising cookies. The map loads from OpenStreetMap only if you ask for it.',
				)
			)
		),
	)
);
update_option( 'wp_page_for_privacy_policy', $confidentialitate );

update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $acasa );
update_option( 'page_for_posts', $pagini['blog'] );

// An extra service this week (exception).
$ex = wp_insert_post( array( 'post_type' => 'candela_slujba', 'post_status' => 'publish', 'post_title' => 'Holy Unction' ) );
update_post_meta( $ex, 'candela_data', current_datetime()->modify( 'friday this week' )->format( 'Y-m-d' ) );
update_post_meta( $ex, 'candela_ora', '18:00' );
update_post_meta( $ex, 'candela_loc', 'in the parish chapel' );

// Announcements.
$anunturi = array(
	'Nativity Fast: confessions'                       => 'Every Saturday of the Fast, after Vespers, Father hears confessions until the last person. If you cannot come on Saturday, please call to arrange another day.',
	'Carolers: rehearsals on Sunday after the Liturgy' => 'Children and young people who would like to go caroling to the elderly of the parish are welcome in the parish hall, on Sundays after the Divine Liturgy.',
	'Thank you for the Thanksgiving food drive'        => 'With your help we delivered 40 food boxes to families in need in our town. May God reward you.',
);
$i = 0;
foreach ( $anunturi as $titlu => $text ) {
	wp_insert_post(
		array(
			'post_type'     => 'post',
			'post_status'   => 'publish',
			'post_title'    => $titlu,
			'post_content'  => candela_demo_par( array( $text ) ),
			'post_category' => array( $cat_anunt ),
			'post_date'     => current_datetime()->modify( '-' . ( 2 + 5 * $i++ ) . ' days' )->format( 'Y-m-d H:i:s' ),
		)
	);
}

// Blog articles (demonstration texts).
$articole = array(
	array(
		'What we say when we light a candle',
		'lumanare.jpg',
		array(
			'The candle we light as we enter the church is a small but real offering: a gift from our work, brought to God together with our prayer.',
			'Its light reminds us that we are called to be light for those around us. So we light it with a clear thought: for the living on the upper stand, and for the departed on the lower one.',
			'It does not matter how large the candle is, but with what heart we light it. A short word said from the soul reaches further than many words.',
		),
	),
	array(
		'The Psalter, a prayer book for the family',
		'psaltire.jpg',
		array(
			'For centuries the Psalms have been the daily prayer of Christians. Monastics read them all every week, but a family can also make room for them at home.',
			'A single psalm read aloud in the evening, together with the children, can become a good habit. The little ones learn the words quickly and keep them all their lives.',
			'If you do not know where to begin, ask your parish priest. He will suggest a rule that suits your family.',
		),
	),
	array(
		'Why we make the sign of the Cross',
		'cruce.jpg',
		array(
			'The sign of the Cross is the shortest confession of faith. The three fingers joined together show our faith in the Holy Trinity, and the two folded into the palm the two natures of the Saviour, divine and human.',
			'We sign ourselves with the Cross at the beginning and end of prayer, before meals, when setting out on a journey and whenever we need God’s help.',
			'We make the sign slowly and attentively, so that it is a prayer and not only a gesture.',
		),
	),
);
$i = 0;
foreach ( $articole as list( $titlu, $imagine, $paragrafe ) ) {
	$id = wp_insert_post(
		array(
			'post_type'     => 'post',
			'post_status'   => 'publish',
			'post_title'    => $titlu,
			'post_content'  => candela_demo_par( $paragrafe ),
			'post_category' => array( $cat_blog ),
			'post_date'     => current_datetime()->modify( '-' . ( 1 + 4 * $i++ ) . ' days 10:00' )->format( 'Y-m-d H:i:s' ),
		)
	);
	candela_demo_imagine( $imagine, $id, $titlu );
}

// Sample entries, so the dashboard is not empty (fictional first names).
$mostre = array(
	array( 'pomelnic', array( 'pentru' => 'For the living (health and salvation)', 'nume' => "John\nMary\nGeorge\nHelen", 'slujba' => 'At the Divine Liturgy', 'trimis_de' => '' ) ),
	array( 'pomelnic', array( 'pentru' => 'For the departed (repose)', 'nume' => "George\nAnna", 'slujba' => 'At the Divine Liturgy', 'trimis_de' => 'Mary' ) ),
	array( 'programare', array( 'slujba' => 'Baptism', 'data' => current_datetime()->modify( '+24 days' )->format( 'Y-m-d' ), 'moment' => 'Morning', 'nume' => 'The Example family', 'telefon' => '+1 555 000 0001', 'email' => '', 'detalii' => 'The godparents are coming from Chicago.' ) ),
);
foreach ( $mostre as list( $tip, $date ) ) {
	$id = wp_insert_post( array( 'post_type' => 'candela_intrare', 'post_status' => 'publish', 'post_title' => $tip ) );
	update_post_meta( $id, 'candela_tip', $tip );
	update_post_meta( $id, 'candela_date', $date );
	update_post_meta( $id, 'candela_citit', 0 );
}

// Demo parish editor (test account of the fictional parish; local demo only).
if ( ! username_exists( 'parintele' ) ) {
	wp_insert_user( array( 'user_login' => 'parintele', 'user_pass' => 'parintele-demo', 'display_name' => 'Fr. John', 'role' => 'candela_editor_parohie', 'user_email' => 'parintele@example.org' ) );
}

// Demo logo (shown in the header; also the site icon).
$up   = wp_upload_dir();
$dest = trailingslashit( $up['path'] ) . 'sigla-demo.png';
copy( __DIR__ . '/imagini/sigla-demo.png', $dest );
$sigla = wp_insert_attachment( array( 'post_mime_type' => 'image/png', 'post_title' => 'Parish logo (demo)', 'post_status' => 'inherit' ), $dest );
wp_update_attachment_metadata( $sigla, wp_generate_attachment_metadata( $sigla, $dest ) );
update_option( 'site_logo', $sigla );
update_option( 'site_icon', $sigla );

echo 'demo ok';
