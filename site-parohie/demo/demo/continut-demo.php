<?php
/**
 * Demo content for the fictional parish. Run once inside WordPress (blueprint runPHP step),
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
		'post_title'   => 'Acasă',
		'post_content' => $tipar ? $tipar['content'] : '',
		'menu_order'   => 1,
	)
);
$ordine          = 2;
$pagini          = array();
$continut_pagini = array(
	'blog'     => '',
	'pomelnic' => candela_demo_par( array( 'Scrieți numele de botez ale celor dragi, vii sau adormiți. Părintele îi pomenește la Sfânta Liturghie, la proscomidie, unde pentru fiecare nume se scoate o miridă din prescură.' ) )
		. '<!-- wp:candela/formular {"tip":"pomelnic"} /-->',
	'slujbe'   => '<!-- wp:heading --><h2 class="wp-block-heading">Calendarul lunii</h2><!-- /wp:heading -->'
		. '<!-- wp:candela/program-slujbe {"vedere":"luna","align":"wide"} /-->'
		. '<!-- wp:heading --><h2 class="wp-block-heading">Programul pentru avizier</h2><!-- /wp:heading -->'
		. '<!-- wp:candela/program-slujbe {"vedere":"lista","zile":31} /-->'
		. '<!-- wp:heading --><h2 class="wp-block-heading" id="programare">Programați o slujbă</h2><!-- /wp:heading -->'
		. candela_demo_par( array( 'Pentru Botez, Cununie, Spovedanie, sfeștanie sau parastas, alegeți o dată potrivită. Părintele vă sună pentru confirmare, după ce verifică programul bisericii.' ) )
		. '<!-- wp:candela/formular {"tip":"programare"} /-->',
	'contact'  => '<!-- wp:columns {"align":"wide"} --><div class="wp-block-columns alignwide"><!-- wp:column --><div class="wp-block-column">'
		. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Ne găsiți aici</h3><!-- /wp:heading -->'
		. '<!-- wp:candela/contact {"arataNume":true} /-->'
		. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Cum ajungeți</h3><!-- /wp:heading -->'
		. '<!-- wp:candela/harta /-->'
		. '</div><!-- /wp:column --><!-- wp:column {"width":"55%"} --><div class="wp-block-column" style="flex-basis:55%">'
		. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Scrieți-ne</h3><!-- /wp:heading -->'
		. '<!-- wp:candela/formular {"tip":"contact"} /-->'
		. '</div><!-- /wp:column --></div><!-- /wp:columns -->',
	'sprijin'  => candela_demo_par( array( 'Parohia trăiește din darurile credincioșilor ei. Din ele se plătesc chiria bisericii, lumânările și prescurile, ajutoarele pentru familiile în nevoie și taberele copiilor. Vă mulțumim pentru orice ajutor, cât de mic.' ) )
		. '<!-- wp:candela/sprijin {"align":"wide"} /-->'
		. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Și altfel decât cu bani</h3><!-- /wp:heading -->'
		. candela_demo_par( array( 'Avem nevoie de ajutor la curățenia bisericii, la cor, la masa de după Liturghie și la vizitele la bătrâni. Scrieți-ne sau vorbiți cu părintele după slujbă.' ) ),
	'despre'   => candela_demo_par( array( 'Parohia Ortodoxă Română «Sfântul Ierarh Nicolae» adună în fiecare duminică familiile de români din Orașul Demo și din împrejurimi. Este o parohie fictivă, creată pentru a arăta cum arată un site Candela Parohiei.' ) )
		. '<!-- wp:heading --><h2 class="wp-block-heading">Hramul</h2><!-- /wp:heading -->'
		. candela_demo_par( array( 'Ocrotitorul parohiei este Sfântul Ierarh Nicolae, arhiepiscopul Mirelor Lichiei, prăznuit pe 6 decembrie. În ajunul hramului, copiii parohiei primesc daruri după Vecernie.' ) )
		. '<!-- wp:heading --><h2 class="wp-block-heading">Istoric</h2><!-- /wp:heading -->'
		. candela_demo_par( array( 'Aici parohia își spune povestea: când s-a înființat, unde s-au ținut primele slujbe, cine a slujit, ce s-a construit și cum a crescut comunitatea. Textul îl scriem împreună cu părintele, din ce ne trimite.' ) )
		. '<!-- wp:heading --><h2 class="wp-block-heading">Preotul paroh</h2><!-- /wp:heading -->'
		. '<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"candela/organizatie","args":{"key":"preot_nume"}}}}} --><p></p><!-- /wp:paragraph -->'
		. candela_demo_par( array( 'Câteva rânduri despre părintele paroh: hirotonia, slujirea, cum poate fi găsit pentru Spovedanie și pentru o vorbă de folos.' ) ),
	'italiano' => '<!-- wp:group {"className":"candela-lang-it","layout":{"type":"constrained"}} --><div class="wp-block-group candela-lang-it">'
		. candela_demo_par( array(
			'La Parrocchia Ortodossa Romena «San Nicola» accoglie ogni domenica le famiglie romene della città e dei dintorni. La Divina Liturgia è celebrata in lingua romena; tutti sono i benvenuti.',
			'Per battesimi, matrimoni o altre celebrazioni potete scriverci tramite la pagina Contatti o telefonare al parroco.',
			'Questa è una parrocchia fittizia, creata per mostrare un sito Candela Parohiei.',
		) )
		. '<!-- wp:candela/contact /-->'
		. '</div><!-- /wp:group -->',
);
foreach ( array( 'Despre parohie' => 'despre', 'Slujbe' => 'slujbe', 'Blog' => 'blog', 'Pomelnic' => 'pomelnic', 'Sprijin' => 'sprijin', 'Contact' => 'contact', 'In italiano' => 'italiano' ) as $titlu => $slug ) {
	$pagini[ $slug ] = wp_insert_post(
		array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $titlu,
			'post_name'    => $slug,
			'menu_order'   => $ordine++,
			'post_content' => $continut_pagini[ $slug ] ?? candela_demo_par( array( 'Pagină demonstrativă.' ) ),
		)
	);
}
// Privacy page for the parish's visitors (the template every client site gets).
$confidentialitate = wp_insert_post(
	array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'Confidențialitate',
		'post_name'    => 'confidentialitate',
		'post_content' => candela_demo_par(
			array(
				'Parohia este operatorul datelor pe care le trimiteți prin acest site. Pentru orice întrebare despre ele, scrieți-ne prin pagina de contact.',
				'Pomelnicul: numele de botez ale celor pomeniți și, dacă doriți, numele dumneavoastră. Cererea de programare: numele, telefonul sau e-mailul și detaliile slujbei. Le folosim doar ca să pomenim la slujbă sau să vă răspundem. Temeiul: cererea dumneavoastră (art. 6 alin. 1 lit. b GDPR).',
				'Datele trimise prin formulare se șterg automat după 40 de zile. Le văd doar preotul și cei care întrețin site-ul, în numele parohiei. Nu le vindem și nu le dăm altora; notificările prin e-mail nu conțin datele dumneavoastră.',
				'Site-ul nu folosește cookie-uri de urmărire sau de reclamă. Harta se încarcă de la OpenStreetMap doar dacă o cereți.',
				'Aveți dreptul să cereți accesul la date, corectarea sau ștergerea lor și să depuneți plângere la autoritatea de protecție a datelor (în România: ANSPDCP).',
			)
		),
	)
);
update_option( 'wp_page_for_privacy_policy', $confidentialitate );

update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $acasa );
update_option( 'page_for_posts', $pagini['blog'] );

// An extra service this week (exception).
$ex = wp_insert_post( array( 'post_type' => 'candela_slujba', 'post_status' => 'publish', 'post_title' => 'Taina Sfântului Maslu' ) );
update_post_meta( $ex, 'candela_data', current_datetime()->modify( 'friday this week' )->format( 'Y-m-d' ) );
update_post_meta( $ex, 'candela_ora', '18:00' );
update_post_meta( $ex, 'candela_loc', 'în paraclisul parohiei' );

// Announcements.
$anunturi = array(
	'Postul Nașterii Domnului: programul spovedaniei'        => 'În fiecare sâmbătă din post, după Vecernie, părintele spovedește până la ultimul credincios. Cei care nu pot veni sâmbăta sunt rugați să sune pentru o altă zi.',
	'Colindătorii parohiei: repetiții duminica după Liturghie' => 'Copiii și tinerii care vor să meargă cu colindul la bătrânii parohiei sunt așteptați în sala parohială, duminica, după Sfânta Liturghie.',
	'Mulțumim pentru darurile de la Sfântul Dimitrie'        => 'Cu ajutorul dumneavoastră am trimis 40 de pachete familiilor nevoiașe din parohie. Dumnezeu să vă răsplătească.',
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
		'Ce spunem când aprindem o lumânare',
		'lumanare.jpg',
		array(
			'Lumânarea pe care o aprindem la intrarea în biserică este o jertfă mică, dar adevărată: un dar din munca noastră, adus lui Dumnezeu împreună cu rugăciunea.',
			'Lumina ei ne amintește că suntem chemați să fim lumină pentru cei din jur. De aceea o aprindem cu un gând limpede: pentru cei vii, în sfeșnicul de sus, și pentru cei adormiți, în cel de jos.',
			'Nu contează cât de mare este lumânarea, ci cu ce inimă o aprindem. Un cuvânt scurt, spus din suflet, ajunge mai departe decât multe vorbe.',
		),
	),
	array(
		'Psaltirea, cartea de rugăciune a familiei',
		'psaltire.jpg',
		array(
			'Psalmii au fost, de-a lungul veacurilor, rugăciunea de fiecare zi a creștinilor. Monahii îi citesc întregi în fiecare săptămână, dar și o familie îi poate face loc în casa ei.',
			'Un singur psalm citit seara, cu voce tare, împreună cu copiii, poate deveni un obicei bun. Cei mici învață repede cuvintele și le păstrează toată viața.',
			'Dacă nu știți de unde să începeți, întrebați-l pe părintele paroh. Vă va arăta o rânduială potrivită pentru familia dumneavoastră.',
		),
	),
	array(
		'De ce facem semnul Sfintei Cruci',
		'cruce.jpg',
		array(
			'Semnul Sfintei Cruci este cea mai scurtă mărturisire de credință. Cele trei degete unite arată credința în Sfânta Treime, iar cele două plecate spre palmă, cele două firi ale Mântuitorului, dumnezeiască și omenească.',
			'Ne însemnăm cu Sfânta Cruce la începutul și la sfârșitul rugăciunii, înainte de masă, la plecarea la drum și ori de câte ori avem nevoie de ajutorul lui Dumnezeu.',
			'Facem semnul încet și cu luare-aminte, ca să fie rugăciune, nu doar un gest.',
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
	array( 'pomelnic', array( 'pentru' => 'Pentru cei vii (sănătate și mântuire)', 'nume' => "Ioan\nMaria\nGheorghe\nElena", 'slujba' => 'La Sfânta Liturghie', 'trimis_de' => '' ) ),
	array( 'pomelnic', array( 'pentru' => 'Pentru cei adormiți (odihnă)', 'nume' => "Gheorghe\nAna", 'slujba' => 'La Sfânta Liturghie', 'trimis_de' => 'Maria' ) ),
	array( 'programare', array( 'slujba' => 'Botez', 'data' => current_datetime()->modify( '+24 days' )->format( 'Y-m-d' ), 'moment' => 'Dimineața', 'nume' => 'Familia Exemplu', 'telefon' => '+39 000 000 001', 'email' => '', 'detalii' => 'Nașii vin din România.' ) ),
);
foreach ( $mostre as list( $tip, $date ) ) {
	$id = wp_insert_post( array( 'post_type' => 'candela_intrare', 'post_status' => 'publish', 'post_title' => $tip ) );
	update_post_meta( $id, 'candela_tip', $tip );
	update_post_meta( $id, 'candela_date', $date );
	update_post_meta( $id, 'candela_citit', 0 );
}

// Demo parish editor (test account of the fictional parish; local demo only).
if ( ! username_exists( 'parintele' ) ) {
	wp_insert_user( array( 'user_login' => 'parintele', 'user_pass' => 'parintele-demo', 'display_name' => 'Părinte Ioan', 'role' => 'candela_editor_parohie', 'user_email' => 'parintele@example.org' ) );
}

// Demo logo (shown in the header; also the site icon).
$up   = wp_upload_dir();
$dest = trailingslashit( $up['path'] ) . 'sigla-demo.png';
copy( __DIR__ . '/imagini/sigla-demo.png', $dest );
$sigla = wp_insert_attachment( array( 'post_mime_type' => 'image/png', 'post_title' => 'Sigla parohiei (demo)', 'post_status' => 'inherit' ), $dest );
wp_update_attachment_metadata( $sigla, wp_generate_attachment_metadata( $sigla, $dest ) );
update_option( 'site_logo', $sigla );
update_option( 'site_icon', $sigla );

echo 'demo ok';
