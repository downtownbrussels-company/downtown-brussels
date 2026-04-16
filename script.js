/* =============================================
   DOWNTOWN BRUSSELS — script.js
   Multilingual | Events Logic | Interactions
   ============================================= */

'use strict';

const RESERVATION_CONFIG = window.RESERVATION_CONFIG || {
  restaurantEmail: 'downtownbrussels@gmail.com',
  email: {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: 'c3f55ae8-b370-4f5b-a1f8-f4aa4dcb5e9f'
  },
  telegram: {
    botToken: '8649049980:AAEp5ef2_u4luNM4966JXD0NsS1n6JfYH5Y',
    chatId: '-5199999590'
  },
  antiSpam: {
    minimumFillTimeMs: 4000,
    cooldownMs: 60000,
    storageKey: 'downtown-reservation-last-submit'
  },
  requestTimeoutMs: 12000
};

const RESERVATION_UI_TEXT = {
  required: 'Please fill in all required fields.',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a valid phone number.',
  datetime: 'Please choose a future date and time.',
  guests: 'Please enter at least 1 guest.',
  spam: 'Please wait a moment before sending another reservation.',
  sendingError: 'We could not send your reservation right now. Please try again or contact us by phone.',
  configError: 'Reservation delivery is not configured yet.'
};

const RESERVATION_DATE_PLACEHOLDER = 'Select date and time';

// =============================================
// 1. TRANSLATIONS
// =============================================
const translations = {
  en: {
    nav_home: 'Home', nav_offers: 'Offers', nav_menu: 'Menu',
    nav_events: 'Events', nav_about: 'About', nav_reserve: 'Reservations',
    nav_reserve_btn: 'RESERVATION', nav_reserve_cta: 'RESERVATION',
    nav_tasting: 'Tasting',
    hero_badge: 'Brussels #1 Sports Bar',
    hero_title: 'The Place of Belgian Beers & Sports Events',
    hero_subtitle: 'Discover our exclusive selection of Belgian Trappist and Abbey beers, with an authentic and refined character. …now also the go-to destination for all sports fans, from football to tennis and rugby.',
    hero_btn1: 'Discover Our Beers', hero_btn2: 'Reserve Your Table',
    stat_beers: 'Belgian Beers', stat_screens: 'Live Screens', stat_open: 'Open Daily',
    offer_tag: 'Limited Deal', offer_title: 'Special Offers',
    offer_badge: 'Offer',
    offer_headline: '2 Stella Artois Beers + Free Snack',
    offer_desc: 'Grab two ice-cold Stella Artois and enjoy a complimentary bar snack on us. The perfect combo for the game!',
    offer_cta: 'Claim Offer',
    tasting_tag: 'Premium Selection', tasting_title: 'Belgian Beer Tasting',
    tasting_subtitle: 'Experience Belgium\'s finest craft beers, from Trappist monasteries to award-winning breweries.',
    tasting_badge_label: 'Flight', tasting_headline: 'Discover the Essence of Belgium',
    tasting_item1_meta: 'Lager · 5.2%', tasting_item2_meta: 'Abbey Ale · 6.6%', tasting_item3_meta: 'Strong Ale · 8.0%', tasting_item4_meta: 'Amber Ale · 8.4%',
    beer_style_lager: 'Lager', beer_style_abbey: 'Abbey Ale',
    beer_style_strong: 'Strong Ale', beer_style_amber: 'Amber Ale',
    feat_tag: 'Why DownTown', feat_title: 'The DownTown Experience',
    feat1_title: 'The authenticity of Belgian beer',
    feat1_desc: 'Located in the city centre, our brasserie is proud to offer an exclusive selection of our beers. Each glass is an invitation to discover authentic craftsmanship and unmatched richness of flavours.',
    feat2_title: 'The match atmosphere!',
    feat2_desc: 'Experience the biggest sporting events as if you were there! From football to tennis and rugby, we broadcast matches on a giant screen. The electric atmosphere, the passion of the fans, and table service comfort make DownTown the ideal place to enjoy every victory.',
    feat3_title: 'The essential stop on your bar tour',
    feat3_desc: 'DownTown is the strategic meeting point for your bar crawl in Brussels! Ideally located near the Bourse, our brasserie welcomes groups looking for a festive and authentic atmosphere.',
    feat4_title: 'Happy Hour',
    feat4_desc: 'Every day from 14:00 to 22:00, the DownTown atmosphere comes alive with our Happy Hour offers! It\'s the perfect time to relax and enjoy discounted prices on a selection of drinks: bottled beers 3 for €12, Spritz & aperitifs 2 for €12, our classic cocktails and mocktails – 1 bought = 1 FREE.',
    menu_tag: 'Drink Menu', menu_title: 'Our Menu',
    menu_all: 'All', menu_shots: 'Shots', menu_cocktails: 'Cocktails',
    menu_alcohol: 'Spirits', menu_beers: 'Beers', menu_wines: 'Wines',
    menu_sparkling_wines: 'Sparkling wines', menu_wines_label: 'Wines', menu_champagnes: 'Champagnes', menu_hot_drinks: 'Hot Drinks',
    menu_softs: 'Softs', menu_cider: 'Cider',
    menu_label_euro_bottle: '€ BOTTLE', menu_label_glass: 'GLASS',
    menu_label_bottle_glass: 'GLASS/BOTTLE',
    menu_label_bottle_5cl: 'Glass/Bottle',
    menu_term_bottle: 'Bottle', menu_term_glass: 'Glass',
    menu_term_bottle_glass: 'Bottle/Glass',
    menu_term_bottle_5cl: 'Bottle/5cl',
    shot1_desc: 'Pure agave, lime & salt', shot2_desc: 'Classic herbal spirit shot', shot3_desc: 'Italian anise liqueur',
    cocktail1_desc: 'White rum, fresh mint, lime, soda',
    cocktail2_desc: 'Vodka, peach schnapps, cranberry & OJ',
    cocktail3_desc: 'Aperol, prosecco, splash of soda',
    spirit1_desc: 'Tennessee whiskey, straight or mixed',
    wine1_desc: 'Smooth Bordeaux blend, glass',
    wine2_desc: 'Italian sparkling, glass',
    menu_classics: 'Classics', menu_signature: 'Signature',
    menu_red_wines: 'Red Wines', menu_rose_wines: 'Rosé Wines', menu_white_wines: 'White Wines',
    cf_mojito_name: 'Classic Mojito', cf_mojito_desc: 'Rum infused with fresh limes, mint, cane sugar',
    cf_sob_name: 'Sex on the Beach', cf_sob_desc: 'Vodka, peach liqueur, orange juice, cranberry',
    mi_tequila: 'Tequila', mi_jack: 'Jack Daniel\'s', mi_desperados: 'Desperados', mi_sambuca: 'Sambuca', mi_peppermint: 'Peppermint',
    mi_bacardi: 'Bacardi', mi_havana: 'Havana', mi_captain: 'Captain Morgan', mi_gordons: 'Gordon\'s Gin', mi_beefeater: 'Beefeater Gin', mi_bombay: 'Bombay Sapphire', mi_absolut: 'Absolut Vodka', mi_jameson: 'Jameson', mi_ricard: 'Ricard',
    mi_jupiler: 'Jupiler', mi_stella: 'Stella Artois', mi_leffe: 'Leffe Blonde', mi_tripel: 'Triple Karmeliet', mi_kwak: 'Kwak',
    mi_sichel: 'Bordeaux Sichel', mi_grands_chemins: 'Les Grands Chemins',
    mi_secret_pink: 'Secret de Pink Bio', mi_harmonie: 'Harmonie de Gascogne', mi_pellchaut: 'Domaine de Pellchaut',
    mi_tequila_sunrise: 'Tequila Sunrise', mi_daiquiri: 'Daiquiri', mi_margarita: 'Margarita', mi_pina_colada: 'Piña Colada', mi_caipiroska: 'Caipiroska', mi_cosmopolitan: 'Cosmopolitan', mi_pornstar: 'Porn Star Martini', mi_mocktails: 'Mocktails N/A',
    mi_kir_blanc: 'Kir Vin Blanc', mi_kir_royal: 'Kir Royal', mi_hugo: 'Hugo', mi_bellini: 'Bellini',
    mi_vodka_sprite: 'Vodka Sprite', mi_rhum_coca: 'Rhum Coca', mi_whiskey_coca: 'Whiskey Coca', mi_gin_tonic: 'Gin Tonic',
    mi_hoegaarden: 'Hoegaarden Rosé', mi_ipa_goose: 'IPA Goose Island', mi_victoria: 'Victoria',
    mi_chouffe: 'La Chouffe', mi_chouffe_cherry: 'Chouffe Cherry', mi_corona: 'Corona Extra', mi_kwak_rouge: 'Kwak Rouge', mi_kriek: 'Kriek', mi_kasteel: 'Kasteel Rouge',
    mi_nachos: 'Nachos + Sauce',
    label_hh: 'Happy Hour: 2 for 12€', label_draft_hh: 'Happy Hours 14:00 - 00:00', label_3_12: '3 for 12€', label_1_1_15: '1+1 for 15€', label_3_10: '3 for 10€',
    cat_draft: 'Draft Beer', cat_bottled: 'Bottled Beer',
    ribbon_text: '1+1 OFFER',
    dual_tag1: 'Special Offer', dual_title1: '2 Beers + Free Snack',
    dual_desc1: 'Order two Stella Artois and get a complimentary bar snack — nachos, dips, and more.',
    dual1_li1: '2× Stella Artois (50cl)', dual1_li2: 'Nachos with dips', dual1_li3: 'Valid any day, all day',
    dual1_cta: 'Claim Now',
    dual_tag2: 'Premium Tasting', dual_title2: 'Belgian Beer Tasting',
    dual_desc2: 'A curated journey through Belgium\'s finest brewing traditions. Four exceptional beers, four unique tastes.',
    dual2_cta: 'Book a Tasting',
    events_tag: 'Live on our Screens', events_title: 'Events',
    events_subtitle: 'UEFA Champions League 2026 — Quarter Finals',
    events_qualifiers: 'UEFA Champions League 2026',
    live_now: 'Live right now at DownTown',
    about_tag: 'Our Story', about_title: 'About DownTown',
    gallery_tag: 'Inside DownTown', gallery_title: 'Gallery',
    gallery_subtitle: 'Step into the glow of DownTown through signature cocktails, polished bar details, and the late-night mood that makes every round feel cinematic.',
    about_p1: 'DownTown Brussels is a vibrant sport bar in the heart of Brussels city centre, just steps away from Place de la Bourse and the iconic Grand Place.',
    about_p2: 'Watch all major live games on big screens, from football to tennis and rugby, in a lively atmosphere, with Belgian beer on tap and great music to complete the experience.',
    about_p3: 'Whether you\'re here to catch the big game, share a tasting board with friends, or simply unwind with a cold Belgian after work — DownTown is your place.',
    af1_title: '50+ Belgian Beers', af1_desc: 'Trappist, abbey, wheat & craft',
    af2_title: '10+ HD Screens', af2_desc: 'All major sports, never miss a match',
    af3_title: 'Central Location', af3_desc: 'Rue Henri Maus 15, Brussels centre',
    af4_title: 'Open Every Day', af4_desc: 'Mon–Sun 10:00 — 02:00',
    why_tag: 'Top Reasons', why_title: 'Why Visit DownTown?',
    why1_title: 'Authentic Belgian Beers', why1_desc: 'Over 50 Belgian beers including Trappist, abbey ales, wheat beers and exclusive craft selections.',
    why2_title: 'Live Sports Broadcasts', why2_desc: 'Football, tennis, Formula 1, rugby and more — 10+ HD screens with premium surround sound.',
    why3_title: 'Central Brussels Location', why3_desc: 'Steps from the Grand Place, in the heart of the Belgian capital.',
    why4_title: 'Premium Atmosphere', why4_desc: 'Whether a date night, group outing, or solo pint — our atmosphere suits every occasion.',
    res_tag: 'Book Now', res_title: 'Reserve Your Table',
    res_modal_title: 'Reserve Your Table',
    res_modal_subtitle: 'Secure your preferred table, tasting, or group evening and let our team prepare a seamless DownTown experience.',
    form_name: 'Full Name', form_email: 'Email', form_phone: 'Phone', form_when: 'Date / Time',
    form_select: 'Reservation Type', form_people: 'Amount of People', form_notes_extended: 'Extra Information',
    form_name_placeholder: 'Your name', form_email_placeholder: 'you@example.com', form_phone_placeholder: '+32 ........',
    form_people_placeholder: '2', form_notes_placeholder: 'Tell us about your preferences, occasion, or any special requests.',
    form_select_opt_dinner: 'Reserve a Table', form_select_opt_sports: 'Sports Night',
    form_select_opt_tasting: 'Beer Tasting', form_select_opt_private: 'Private Event',
    form_date: 'Date', form_time: 'Time', form_guests: 'Guests', form_notes: 'Special Requests',
    form_submit: 'Confirm Reservation', form_submit_modal: 'Reserve', form_sending: 'Sending...',
    form_success: '🎉 Reservation confirmed! See you soon at DownTown!',
    live_tag: 'On the Screens', live_title: 'Live Games',
    mdesc_tag: 'Our Drinks', mdesc_title: 'A World of Flavours',
    mdesc_p1: 'Discover a wide selection of drinks crafted to impress. Our bartenders are passionate about their craft — from perfectly balanced cocktails to the finest Belgian beers on tap.',
    mdesc_p2: 'Whether you\'re in the mood for a refreshing Belgian lager, a handcrafted cocktail, or an aged whisky — our menu has something for every palate.',
    mdesc_cta: 'Explore Full Menu',
    di1: 'Cocktails', di2: 'Beers', di3: 'Spirits', di4: 'Wines',
    menuDescription: 'Enjoy an extensive drinks menu at DownTown Brussels, featuring Belgian beers on tap, creative cocktails, and top-quality spirits.',
    eventsDescription: 'Looking for the best place to watch live sports in Brussels? Watch live football, Champions League and major sporting events at DownTown Brussels. With multiple screens, great sound and a lively crowd, it’s the perfect place in the city centre to enjoy the game with friends.',
    footer_tagline: 'The Temple of Belgian Beers & Sports Events in Brussels.',
    footer_hours_title: 'Opening Hours', footer_hours: 'Monday - Sunday',
    footer_contact_title: 'Contact', footer_nav_title: 'Quick Links',
    footer_nav_home: 'Home', footer_nav_menu: 'Menu', footer_nav_events: 'Events',
    footer_nav_res: 'Reservations', footer_nav_contact: 'Contact',
    footer_cta: 'Reservation',
    footer_addr_line1: 'Rue Henri Maus 15,', footer_addr_line2: '1000 Brussels (Place de la Bourse)',
    drawer_addr: 'Rue Henri Maus 15, 1000 Brussels (Place de la Bourse)', drawer_hours: 'Mon–Sun · 12:00 — 01:00',
    footer_rights: 'All rights reserved.', footer_made: 'Crafted with ❤️ in Brussels',
    sel_tag: 'What We Offer', sel_title: 'Our Selections',
    sel_subtitle: 'Three reasons to make DownTown your go-to Brussels destination.',
    sel1_title: 'Belgian Treasures', sel1_text: 'Trappist, Dubbels, Tripels, Lambics, Witbiers — an authentic collection for true beer lovers.', sel1_cta: 'Explore Selection',
    sel2_title: 'Supporter Zone', sel2_text: 'Watch major sports events live on big screens all year round. Enjoy an electric atmosphere with friends.', sel2_cta: 'See Live Events',
    sel3_title: 'Rare & Craft Beers', sel3_text: 'Enjoy Trappist, Dubbels, Tripels, Lambics, and Witbiers — carefully kept in barrels to preserve freshness and flavor.', sel3_cta: 'Discover More',
    loc_tag: 'Find Us', loc_title: 'Find Us', loc_subtitle: 'Visit us in the heart of Brussels.',
    loc_text: 'DownTown Brussels is ideally located just steps away from Place de la Bourse and the Grand Place. Easily accessible, our venue is the perfect destination to enjoy premium drinks, a vibrant atmosphere, and live sports.',
    loc_addr: 'Rue Henri Maus 15, 1000 Brussels (Place de la Bourse)', loc_cta: 'Open in Google Maps',
    faq_tag: 'Frequently Asked Questions', faq_title: 'FAQ',
    faq_subtitle: 'Everything you may want to know before your next night at DownTown.',
    faq: [
      {
        question: 'Is it necessary to book a table?',
        answer: 'Booking is not mandatory, but it is highly recommended, especially in the evening and on match days. Our venue near Place de la Bourse is very popular.'
      },
      {
        question: 'Can we book for a large group?',
        answer: 'Yes, absolutely! Whether it’s a birthday, afterwork, or a game night with friends enjoying a Belgian beer, we warmly welcome groups.'
      },
      {
        question: 'Is it possible to privatize a space?',
        answer: 'Yes! We offer private booking options for corporate or private events in the heart of Brussels, just steps from Place de la Bourse.'
      },
      {
        question: 'What is your brasserie’s specialty?',
        answer: 'Our specialty is Belgian beer! We proudly offer a curated selection of Belgian beers. Our team will gladly help you choose.'
      },
      {
        question: 'What sports and matches do you broadcast?',
        answer: 'We mainly show football (Champions League, Belgian Pro League, Premier League, National Team…), but also rugby and tennis. Enjoy the game with a great Belgian beer.'
      },
      {
        question: 'How to get to DownTown Brussels?',
        answer: 'We are located in the city center of Brussels, right next to Place de la Bourse, easily accessible by public transport.'
      },
      {
        question: 'Can we request a specific match?',
        answer: 'Yes! If you’re coming as a group, you can request a specific match when booking. If possible, we’ll be happy to show it while you enjoy a Belgian beer.'
      }
    ]
  },
  fr: {
    nav_home: 'Accueil', nav_offers: 'Offres', nav_menu: 'Menu',
    nav_events: 'Événements', nav_about: 'À propos', nav_reserve: 'Réservations',
    nav_reserve_btn: 'RÉSERVATION', nav_reserve_cta: 'RÉSERVATION',
    nav_tasting: 'Dégustation',
    hero_badge: 'Bar Sportif N°1 à Bruxelles',
    hero_title: 'L’endroit pour les bières belges & le sport en direct',
    hero_subtitle: 'Découvrez notre sélection exclusive de bières belges trappistes et d’abbaye, au caractère authentique et raffiné. …désormais aussi le lieu incontournable pour tous les passionnés de sport, du football au tennis en passant par le rugby.',
    hero_btn1: 'Découvrir Nos Bières', hero_btn2: 'Réserver une Table',
    stat_beers: 'Bières Belges', stat_screens: 'Écrans Live', stat_open: 'Ouvert Tous les Jours',
    offer_tag: 'Offre Limitée', offer_title: 'Offres Spéciales',
    offer_badge: 'Offre',
    offer_headline: '2 Stella Artois + Snack Offert',
    offer_desc: 'Commandez deux Stella Artois glacées et profitez d\'un snack offert. Le combo parfait pour le match!',
    offer_cta: 'Profiter de l\'Offre',
    tasting_tag: 'Sélection Premium', tasting_title: 'Dégustation de Bières Belges',
    tasting_subtitle: 'Vivez la quintessence des bières belges, des monastères trappistes aux brasseries primées.',
    tasting_badge_label: 'Palette', tasting_headline: 'Découvrez l\'Essence de la Belgique',
    tasting_item1_meta: 'Lager · 5.2%', tasting_item2_meta: 'Bière d\'Abbaye · 6.6%', tasting_item3_meta: 'Bière Forte · 8.0%', tasting_item4_meta: 'Bière Ambrée · 8.4%',
    beer_style_lager: 'Lager', beer_style_abbey: 'Bière d\'Abbaye',
    beer_style_strong: 'Bière Forte', beer_style_amber: 'Bière Ambrée',
    feat_tag: 'Pourquoi DownTown', feat_title: 'L\'Expérience DownTown',
    feat1_title: 'L\'authenticité de la bière belge',
    feat1_desc: 'Située au centre-ville, notre brasserie est fière de proposer une sélection exclusive de nos bières. Chaque verre est une invitation à découvrir un savoir-faire authentique et une richesse de saveurs inégalée.',
    feat2_title: 'L\'ambiance du match !',
    feat2_desc: 'Vivez les plus grands événements sportifs comme si vous y étiez ! Du football au tennis en passant par le rugby, nous diffusons les matchs sur écran géant. L\'ambiance électrique, la ferveur des supporters et le confort du service à table font de DownTown le lieu idéal pour vibrer au rythme des victoires.',
    feat3_title: 'L\'escale incontournable de vos tournées',
    feat3_desc: 'DownTown est le point de ralliement stratégique pour votre tournée des bars à Bruxelles ! Idéalement située près de la Bourse, notre brasserie accueille les groupes en quête d\'une ambiance festive et authentique.',
    feat4_title: 'Happy Hour',
    feat4_desc: 'Tous les jours de 14h à 22h, l\'ambiance DownTown s\'anime avec nos offres Happy Hour ! C\'est le moment idéal pour se détendre et profiter de nos tarifs réduits sur une sélection de boissons : bières en bouteille 3 pour 12 €, Spritz & apéritifs 2 pour 12 €, nos cocktails classiques et mocktails – 1 acheté = 1 OFFERT.',
    menu_tag: 'Carte des Boissons', menu_title: 'Notre Menu',
    menu_all: 'Tout', menu_shots: 'Shots', menu_cocktails: 'Cocktails',
    menu_alcohol: 'Spiritueux', menu_beers: 'Bières', menu_wines: 'Vins',
    menu_sparkling_wines: 'Vins pétillants', menu_wines_label: 'Vins', menu_champagnes: 'Champagnes', menu_hot_drinks: 'Boissons chaudes',
    menu_softs: 'Softs', menu_cider: 'Cider',
    menu_label_euro_bottle: '€ BOUTEILLE', menu_label_glass: 'VERRE',
    menu_label_bottle_glass: 'VERRE/BOUTEILLE',
    menu_label_bottle_5cl: 'VERRE/BOUTEILLE',
    menu_term_bottle: 'bouteille', menu_term_glass: 'verre',
    menu_term_bottle_glass: 'bouteille/verre',
    menu_term_bottle_5cl: 'bouteille/5cl',
    shot1_desc: 'Agave pur, citron vert & sel', shot2_desc: 'Shot d\'herbes classique', shot3_desc: 'Liqueur d\'anis italienne',
    cocktail1_desc: 'Rhum blanc, menthe fraîche, citron vert, soda',
    cocktail2_desc: 'Vodka, schnapps pêche, cranberry & OJ',
    cocktail3_desc: 'Aperol, prosecco, touche de soda',
    spirit1_desc: 'Whisky du Tennessee, sec ou mixé',
    spirit2_desc: 'Vodka premium suédoise',
    wine1_desc: 'Assemblage Bordeaux soyeux, verre',
    wine2_desc: 'Pétillant italien, verre',
    menu_classics: 'Classiques', menu_signature: 'Signature',
    menu_red_wines: 'Vins Rouges', menu_rose_wines: 'Vins Rosés', menu_white_wines: 'Vins Blancs',
    cf_mojito_name: 'Mojito Classique', cf_mojito_desc: 'Rhum infusé aux citrons verts frais, menthe, sucre de canne',
    cf_sob_name: 'Sex on the Beach', cf_sob_desc: 'Vodka, liqueur de pêche, jus d\'orange, canneberge',
    mi_tequila: 'Tequila', mi_jack: 'Jack Daniel\'s', mi_desperados: 'Desperados', mi_sambuca: 'Sambuca', mi_peppermint: 'Peppermint',
    mi_bacardi: 'Bacardi', mi_havana: 'Havana', mi_captain: 'Captain Morgan', mi_gordons: 'Gordon\'s Gin', mi_beefeater: 'Beefeater Gin', mi_bombay: 'Bombay Sapphire', mi_absolut: 'Absolut Vodka', mi_jameson: 'Jameson', mi_ricard: 'Ricard',
    mi_jupiler: 'Jupiler', mi_stella: 'Stella Artois', mi_leffe: 'Leffe Blonde', mi_tripel: 'Triple Karmeliet', mi_kwak: 'Kwak',
    mi_sichel: 'Bordeaux Sichel', mi_grands_chemins: 'Les Grands Chemins',
    mi_secret_pink: 'Secret de Pink Bio', mi_harmonie: 'Harmonie de Gascogne', mi_pellchaut: 'Domaine de Pellchaut',
    mi_tequila_sunrise: 'Tequila Sunrise', mi_daiquiri: 'Daiquiri', mi_margarita: 'Margarita', mi_pina_colada: 'Piña Colada', mi_caipiroska: 'Caipiroska', mi_cosmopolitan: 'Cosmopolitan', mi_pornstar: 'Porn Star Martini', mi_mocktails: 'Mocktails N/A',
    mi_kir_blanc: 'Kir Vin Blanc', mi_kir_royal: 'Kir Royal', mi_hugo: 'Hugo', mi_bellini: 'Bellini',
    mi_vodka_sprite: 'Vodka Sprite', mi_rhum_coca: 'Rhum Coca', mi_whiskey_coca: 'Whiskey Coca', mi_gin_tonic: 'Gin Tonic',
    mi_hoegaarden: 'Hoegaarden Rosé', mi_ipa_goose: 'IPA Goose Island', mi_victoria: 'Victoria',
    mi_chouffe: 'La Chouffe', mi_chouffe_cherry: 'Chouffe Cherry', mi_corona: 'Corona Extra', mi_kwak_rouge: 'Kwak Rouge', mi_kriek: 'Kriek', mi_kasteel: 'Kasteel Rouge',
    mi_nachos: 'Nachos + Sauce',
    label_hh: 'Happy Hour: 2 pour 12€', label_draft_hh: 'Happy Hours 14:00 - 00:00', label_3_12: '3 pour 12€', label_1_1_15: '1+1 pour 15€', label_3_10: '3 pour 10€',
    cat_draft: 'Bières Pression', cat_bottled: 'Bières Bouteille',
    ribbon_text: '1+1 OFFRE',
    dual_tag1: 'Offre Spéciale', dual_title1: '2 Bières + Snack Offert',
    dual_desc1: 'Commandez deux Stella Artois et recevez un snack offert — nachos, sauces et plus encore.',
    dual1_li1: '2× Stella Artois (50cl)', dual1_li2: 'Nachos avec sauces', dual1_li3: 'Valable tous les jours',
    dual1_cta: 'Profiter Maintenant',
    dual_tag2: 'Dégustation Premium', dual_title2: 'Dégustation Bières Belges',
    dual_desc2: 'Un voyage culinaire à travers les meilleures traditions brassicoles belges.',
    dual2_cta: 'Réserver une Dégustation',
    events_tag: 'Sur Nos Écrans', events_title: 'Événements',
    events_subtitle: 'UEFA Champions League 2026 — Quarts de finale',
    events_qualifiers: 'UEFA Champions League 2026',
    live_now: 'En direct maintenant chez DownTown',
    about_tag: 'Notre Histoire', about_title: 'À Propos de DownTown',
    about_p1: 'DownTown Brussels est un sport bar animé situé au cœur du centre-ville de Bruxelles, à quelques pas de la Place de la Bourse et de l’emblématique Grand-Place.',
    about_p2: 'Regardez tous les grands matchs en direct sur écrans géants, du football au tennis en passant par le rugby, dans une ambiance conviviale, avec des bières belges à la pression et une excellente musique pour compléter l’expérience.',
    about_p3: 'Que vous veniez pour regarder le grand match, partager un plateau de dégustation entre amis, ou simplement vous détendre après le travail — DownTown est votre endroit.',
    af1_title: '50+ Bières Belges', af1_desc: 'Trappistes, d\'abbaye, blanches & artisanales',
    af2_title: '10+ Écrans HD', af2_desc: 'Tous les sports majeurs, ne ratez aucun match',
    af3_title: 'Emplacement Central', af3_desc: 'Rue Henri Maus 15, centre de Bruxelles',
    af4_title: 'Ouvert Tous les Jours', af4_desc: 'Lun–Dim 10h00 — 02h00',
    why_tag: 'Meilleures Raisons', why_title: 'Pourquoi Visiter DownTown?',
    why1_title: 'Bières Belges Authentiques', why1_desc: 'Plus de 50 bières belges incluant trappistes, d\'abbaye et sélections artisanales exclusives.',
    why2_title: 'Sports en Direct', why2_desc: 'Football, tennis, F1, rugby — 10+ écrans HD avec son surround premium.',
    why3_title: 'Emplacement Central', why3_desc: 'À deux pas de la Grand-Place, au cœur de Bruxelles.',
    why4_title: 'Ambiance Premium', why4_desc: 'Soirée en amoureux, sortie en groupe ou pinte en solo — notre ambiance convient à toutes les occasions.',
    res_tag: 'Réservez', res_title: 'Réserver Votre Table',
    res_modal_title: 'Réserver Votre Table',
    res_modal_subtitle: 'Réservez votre table, dégustation ou soirée de groupe et laissez notre équipe préparer une expérience DownTown fluide et élégante.',
    form_name: 'Nom Complet', form_email: 'Email', form_phone: 'Téléphone', form_when: 'Date / Heure',
    form_select: 'Type de Réservation', form_people: 'Nombre de Personnes', form_notes_extended: 'Informations Supplémentaires',
    form_name_placeholder: 'Votre nom', form_email_placeholder: 'vous@example.com', form_phone_placeholder: '+32 ........',
    form_people_placeholder: '2', form_notes_placeholder: 'Indiquez vos préférences, l’occasion ou toute demande spéciale.',
    form_select_opt_dinner: 'Réserver une table', form_select_opt_sports: 'Soirée Sportive',
    form_select_opt_tasting: 'Dégustation de Bières', form_select_opt_private: 'Événement Privé',
    form_date: 'Date', form_time: 'Heure', form_guests: 'Convives', form_notes: 'Demandes Spéciales',
    form_submit: 'Confirmer la Réservation', form_submit_modal: 'Réserver', form_sending: 'Envoi...',
    form_success: '\uD83C\uDF89 R\u00E9servation confirm\u00E9e! \u00C0 bient\u00F4t chez DownTown!',
    live_tag: 'Sur les Écrans', live_title: 'Matchs en Direct',
    mdesc_tag: 'Nos Boissons', mdesc_title: 'Un Monde de Saveurs',
    mdesc_p1: 'Découvrez une large sélection de boissons conçues pour impressionner. Cocktails parfaitement équilibrés aux meilleures bières belges pression.',
    mdesc_p2: 'Lager rafraîchissante, cocktail artisanal ou whisky vieilli — notre menu propose quelque chose pour chaque palais.',
    mdesc_cta: 'Explorer le Menu Complet',
    di1: 'Cocktails', di2: 'Bières', di3: 'Spiritueux', di4: 'Vins',
    menuDescription: 'Profitez d’une carte de boissons variée au DownTown Brussels, avec des bières belges à la pression, des cocktails créatifs et des spiritueux de qualité.',
    eventsDescription: 'Vous cherchez le meilleur endroit pour regarder du sport en direct à Bruxelles ? Profitez du football, de la Ligue des Champions et des grands événements sportifs au DownTown Brussels, avec plusieurs écrans, un excellent son et une ambiance animée.',
    footer_tagline: 'L’endroit pour les bières belges & le sport en direct',
    footer_hours_title: 'Heures d\'Ouverture', footer_hours: 'Lundi - Dimanche',
    footer_contact_title: 'Contact', footer_nav_title: 'Liens Rapides',
    footer_nav_home: 'Accueil', footer_nav_menu: 'Menu', footer_nav_events: 'Événements',
    footer_nav_res: 'Réservations', footer_nav_contact: 'Contact',
    footer_cta: 'Réservation',
    footer_addr_line1: 'Rue Henri Maus 15,', footer_addr_line2: '1000 Bruxelles (Place de la Bourse)',
    drawer_addr: 'Rue Henri Maus 15, 1000 Bruxelles (Place de la Bourse)', drawer_hours: 'Lun–Dim : 12:00 – 01:00',
    footer_rights: 'Tous droits réservés.', footer_made: 'Créé avec ❤️ à Bruxelles',
    sel_tag: 'Notre Offre', sel_title: 'Nos Sélections',
    sel_subtitle: 'Trois raisons de faire de DownTown votre destination incontournable à Bruxelles.',
    sel1_title: 'Les Trésors Belges', sel1_text: 'Trappistes, Dubbels, Tripels, Lambics, Witbiers — une collection authentique pour les vrais amateurs.', sel1_cta: 'Explorer la Sélection',
    sel2_title: 'Zone Supporter', sel2_text: 'Regardez les grands événements sportifs en direct toute l\'année. Profitez d\'une ambiance électrique.', sel2_cta: 'Voir les Événements',
    sel3_title: 'Bières Rares & Craft', sel3_text: 'Savourez des Trappistes, Dubbels, Tripels, Lambics et Witbiers — soigneusement conservées en fûts pour préserver leur fraîcheur et leurs saveurs.', sel3_cta: 'En Savoir Plus',
    loc_tag: 'Nous trouver', loc_title: 'Nous trouver', loc_subtitle: 'Rendez-nous visite au cœur de Bruxelles.',
    loc_text: 'DownTown Brussels bénéficie d’un emplacement idéal, à quelques pas de la Place de la Bourse et de la Grand-Place. Facilement accessible, notre établissement est l’endroit parfait pour profiter de boissons de qualité, d’une ambiance dynamique et de retransmissions sportives en direct.',
    loc_addr: 'Rue Henri Maus 15, 1000 Bruxelles (Place de la Bourse)', loc_cta: 'Ouvrir dans Maps',
    faq_tag: 'Questions Fréquentes', faq_title: 'FAQ',
    gallery_tag: 'À l\'intérieur du centre-ville', gallery_title: 'Galerie',
    gallery_subtitle: 'Plongez dans l’ambiance lumineuse de Downtown à travers des cocktails signature, des détails de bar soignés et une atmosphère nocturne où chaque tournée devient cinématographique.',
    faq_subtitle: 'Tout ce que vous pouvez vouloir savoir avant votre prochaine soirée chez DownTown.',
    faq: [
      {
        question: 'Est-il nécessaire de réserver une table ?',
        answer: 'La réservation n’est pas obligatoire, mais elle est fortement recommandée, surtout en soirée et les jours de match. Notre établissement situé à la Place de la Bourse est très fréquenté.'
      },
      {
        question: 'Pouvons-nous réserver pour un grand groupe ?',
        answer: 'Oui, absolument ! Que ce soit pour un anniversaire, un afterwork ou une soirée jeux entre amis autour d’une Belgian beer, nous accueillons les groupes avec plaisir.'
      },
      {
        question: 'Peut-on privatiser un espace ?',
        answer: 'Oui, c’est possible ! Nous proposons des options de privatisation pour vos événements privés ou professionnels au cœur de Bruxelles, à deux pas de la Place de la Bourse.'
      },
      {
        question: 'Quelle est la spécialité de votre brasserie ?',
        answer: 'Notre spécialité, c’est la Belgian beer ! Nous proposons une sélection exclusive de bières belges. Notre équipe est là pour vous conseiller.'
      },
      {
        question: 'Quels sports et quels matchs diffusez-vous ?',
        answer: 'Nous diffusons principalement le football (Ligue des Champions, Pro League belge, Premier League, Équipe nationale…), mais aussi le rugby et le tennis, à savourer avec une Belgian beer.'
      },
      {
        question: 'Comment venir chez DownTown Brussels ?',
        answer: 'Nous sommes situés en plein centre-ville de Bruxelles, à proximité immédiate de la Place de la Bourse, facilement accessibles en transports en commun.'
      },
      {
        question: 'Peut-on demander la diffusion d’un match spécifique ?',
        answer: 'Oui ! Si vous êtes en groupe, vous pouvez demander un match spécifique lors de votre réservation. Nous ferons le maximum pour le diffuser avec une Belgian beer.'
      }
    ]
  },
  nl: {
    nav_home: 'Home', nav_offers: 'Aanbiedingen', nav_menu: 'Menu',
    nav_events: 'Evenementen', nav_about: 'Over ons', nav_reserve: 'Reserveringen',
    nav_reserve_btn: 'RESERVATIE', nav_reserve_cta: 'RESERVATIE',
    nav_tasting: 'Proeverij',
    hero_badge: 'Brussels #1 Sports Bar',
    hero_title: 'De plek voor Belgische bieren & live sport',
    hero_subtitle: 'Ontdek onze exclusieve selectie Belgische trappisten- en abdijbieren, met een authentiek en verfijnd karakter. …nu ook dé plek voor alle sportliefhebbers, van voetbal tot tennis en rugby.',
    hero_btn1: 'Ontdek onze Bieren', hero_btn2: 'Reserveer een Tafel',
    stat_beers: 'Belgische Bieren', stat_screens: 'Live Schermen', stat_open: 'Dagelijks Open',
    offer_tag: 'Beperkte Deal', offer_title: 'Speciale Aanbiedingen',
    offer_badge: 'Aanbieding',
    offer_headline: '2 Stella Artois Bieren + Gratis Snack',
    offer_desc: 'Bestel twee ijskoude Stella Artois en geniet van een gratis bar snack van het huis. De perfecte combo voor de wedstrijd!',
    offer_cta: 'Claim Aanbieding',
    tasting_tag: 'Premium Selectie', tasting_title: 'Belgische Bierproeverij',
    tasting_subtitle: 'Ervaar de beste Belgische speciaalbieren, van Trappistenkloosters tot bekroonde brouwerijen.',
    tasting_badge_label: 'Flight', tasting_headline: 'Ontdek de Essentie van België',
    tasting_item1_meta: 'Pils · 5.2%', tasting_item2_meta: 'Abdijbier · 6.6%', tasting_item3_meta: 'Sterk Blond · 8.0%', tasting_item4_meta: 'Amberbier · 8.4%',
    beer_style_lager: 'Pils', beer_style_abbey: 'Abdijbier',
    beer_style_strong: 'Sterk Blond', beer_style_amber: 'Amberbier',
    feat_tag: 'Waarom DownTown', feat_title: 'De DownTown Ervaring',
    feat1_title: 'De authenticiteit van Belgisch bier',
    feat1_desc: 'Gelegen in het stadscentrum is onze brasserie trots om een exclusieve selectie van onze bieren aan te bieden. Elk glas is een uitnodiging om authentiek vakmanschap en een ongeëvenaarde rijkdom aan smaken te ontdekken.',
    feat2_title: 'De match-sfeer!',
    feat2_desc: 'Beleef de grootste sportevenementen alsof je er zelf bij bent! Van voetbal tot tennis en rugby, wij zenden de wedstrijden uit op een groot scherm. De elektrische sfeer, de passie van de supporters en het comfort van bediening aan tafel maken DownTown de ideale plek om mee te leven met elke overwinning.',
    feat3_title: 'De onmisbare tussenstop voor jouw bar tour',
    feat3_desc: 'DownTown is het strategische ontmoetingspunt voor je bar crawl in Brussel! Ideaal gelegen nabij de Beurs verwelkomt onze brasserie groepen die op zoek zijn naar een feestelijke en authentieke sfeer.',
    feat4_title: 'Happy Hour',
    feat4_desc: 'Elke dag van 14:00 tot 22:00 komt de DownTown-sfeer tot leven met onze Happy Hour-aanbiedingen! Het is het ideale moment om te ontspannen en te profiteren van onze verlaagde prijzen op een selectie dranken: flessenbier 3 voor €12, Spritz & aperitieven 2 voor €12, onze klassieke cocktails en mocktails – 1 gekocht = 1 GRATIS.',
    menu_tag: 'Drankenkaart', menu_title: 'Ons Menu',
    menu_all: 'Alle', menu_shots: 'Shots', menu_cocktails: 'Cocktails',
    menu_alcohol: 'Sterke Drank', menu_beers: 'Bieren', menu_wines: 'Wijnen',
    menu_sparkling_wines: 'Mousserende wijnen', menu_wines_label: 'Wijnen', menu_champagnes: 'Champagnes', menu_hot_drinks: 'Warme dranken',
    menu_softs: 'Softs', menu_cider: 'Cider',
    menu_label_euro_bottle: '€ FLES', menu_label_glass: 'GLAS',
    menu_label_bottle_glass: 'GLAS/FLES',
    menu_label_bottle_5cl: 'GLAS/FLES',
    menu_term_bottle: 'fles', menu_term_glass: 'glas',
    menu_term_bottle_glass: 'fles/glas',
    menu_term_bottle_5cl: 'fles/5cl',
    shot1_desc: 'Pure agave, limoen & zout', shot2_desc: 'Klassieke kruidenspirit shot', shot3_desc: 'Italiaanse anijslikeur',
    cocktail1_desc: 'Witte rum, verse munt, limoen, soda',
    cocktail2_desc: 'Wodka, perzik schnapps, cranberry & jus d\'orange',
    cocktail3_desc: 'Aperol, prosecco, scheutje soda',
    spirit1_desc: 'Tennessee whiskey, puur of gemixt',
    spirit2_desc: 'Zweedse premium wodka',
    wine1_desc: 'Zachte Bordeaux blend, glas',
    wine2_desc: 'Italiaanse bubbels, glas',
    menu_classics: 'Klassiekers', menu_signature: 'Signature',
    menu_red_wines: 'Rode Wijnen', menu_rose_wines: 'Rosé Wijnen', menu_white_wines: 'Witte Wijnen',
    cf_mojito_name: 'Klassieke Mojito', cf_mojito_desc: 'Rum getrokken met verse limoenen, munt en rietsuiker',
    cf_sob_name: 'Sex on the Beach', cf_sob_desc: 'Wodka, perziklikeur, sinaasappelsap, cranberry',
    mi_tequila: 'Tequila', mi_jack: 'Jack Daniel\'s', mi_desperados: 'Desperados', mi_sambuca: 'Sambuca', mi_peppermint: 'Pepermunt',
    mi_bacardi: 'Bacardi', mi_havana: 'Havana', mi_captain: 'Captain Morgan', mi_gordons: 'Gordon\'s Gin', mi_beefeater: 'Beefeater Gin', mi_bombay: 'Bombay Sapphire', mi_absolut: 'Absolut Vodka', mi_jameson: 'Jameson', mi_ricard: 'Ricard',
    mi_jupiler: 'Jupiler', mi_stella: 'Stella Artois', mi_leffe: 'Leffe Blond', mi_tripel: 'Tripel Karmeliet', mi_kwak: 'Kwak',
    mi_sichel: 'Bordeaux Sichel', mi_grands_chemins: 'Les Grands Chemins',
    mi_secret_pink: 'Secret de Pink Bio', mi_harmonie: 'Harmonie de Gascogne', mi_pellchaut: 'Domaine de Pellchaut',
    mi_tequila_sunrise: 'Tequila Sunrise', mi_daiquiri: 'Daiquiri', mi_margarita: 'Margarita', mi_pina_colada: 'Piña Colada', mi_caipiroska: 'Caipiroska', mi_cosmopolitan: 'Cosmopolitan', mi_pornstar: 'Porn Star Martini', mi_mocktails: 'Mocktails N/A',
    mi_kir_blanc: 'Kir Witte Wijn', mi_kir_royal: 'Kir Royal', mi_hugo: 'Hugo', mi_bellini: 'Bellini',
    mi_vodka_sprite: 'Wodka Sprite', mi_rhum_coca: 'Rum Cola', mi_whiskey_coca: 'Whiskey Cola', mi_gin_tonic: 'Gin Tonic',
    mi_hoegaarden: 'Hoegaarden Rosé', mi_ipa_goose: 'IPA Goose Island', mi_victoria: 'Victoria',
    mi_chouffe: 'La Chouffe', mi_chouffe_cherry: 'Chouffe Cherry', mi_corona: 'Corona Extra', mi_kwak_rouge: 'Kwak Rouge', mi_kriek: 'Kriek', mi_kasteel: 'Kasteel Rouge',
    mi_nachos: 'Nachos + Saus',
    label_hh: 'Happy Hour: 2 voor 12€', label_draft_hh: 'Happy Hours 14:00 - 00:00', label_3_12: '3 voor 12€', label_1_1_15: '1+1 voor 15€', label_3_10: '3 voor 10€',
    cat_draft: 'Bier van de Tap', cat_bottled: 'Bier op Fles',
    ribbon_text: '1+1 AANBIEDING',
    dual_tag1: 'Speciale Aanbieding', dual_title1: '2 Bieren + Gratis Snack',
    dual_desc1: 'Bestel twee Stella Artois en ontvang een gratis bar snack — nachos, dips en meer.',
    dual1_li1: '2× Stella Artois (50cl)', dual1_li2: 'Nachos met dips', dual1_li3: 'Dagelijks geldig, de hele dag',
    dual1_cta: 'Claim Nu',
    dual_tag2: 'Premium Proeverij', dual_title2: 'Belgische Bierproeverij',
    dual_desc2: 'Een samengestelde reis door de beste Belgische brouwerstradities. Vier uitzonderlijke bieren, vier unieke smaken.',
    dual2_cta: 'Boek een Proeverij',
    events_tag: 'Live op onze Schermen', events_title: 'Evenementen',
    events_subtitle: 'UEFA Champions League 2026 — Kwartfinales',
    events_qualifiers: 'UEFA Champions League 2026',
    live_now: 'Nu live bij DownTown',
    about_tag: 'Ons Verhaal', about_title: 'Over DownTown',
    about_p1: 'DownTown Brussels is een levendige sport bar in het hart van het stadscentrum van Brussel, op slechts enkele stappen van het Beursplein (Place de la Bourse) en de iconische Grote Markt.',
    about_p2: 'Bekijk alle grote wedstrijden live op grote schermen, van voetbal tot tennis en rugby, in een gezellige sfeer, met Belgische bieren van het vat en goede muziek om de ervaring compleet te maken.',
    about_p3: 'Of je nu komt voor de grote wedstrijd, een proeverij deelt met vrienden, of gewoon wilt ontspannen met een koud Belgisch biertje na het werk — DownTown is jouw plek.',
    af1_title: '50+ Belgische Bieren', af1_desc: 'Trappisten, abdij, witbier & speciaal',
    af2_title: '10+ HD Schermen', af2_desc: 'Alle grote sporten, mis nooit meer een wedstrijd',
    af3_title: 'Centrale Locatie', af3_desc: 'Henri Mausstraat 15, centrum Brussel',
    af4_title: 'Elke Dag Open', af4_desc: 'Ma–Zo 10:00 — 02:00',
    why_tag: 'Beste Redenen', why_title: 'Waarom naar DownTown?',
    why1_title: 'Authentieke Belgische Bieren', why1_desc: 'Meer dan 50 Belgische bieren, waaronder Trappisten, abdijbieren, witbieren en exclusieve selecties.',
    why2_title: 'Live Sportuitzendingen', why2_desc: 'Voetbal, tennis, Formule 1, rugby en meer — 10+ HD-schermen met premium surround sound.',
    why3_title: 'Centrale Locatie in Brussel', why3_desc: 'Op een steenworp afstand van de Grote Markt, in het hart van de Belgische hoofdstad.',
    why4_title: 'Premium Sfeer', why4_desc: 'Of het nu gaat om een date, een groepsuitje of een solo biertje — onze sfeer past bij elke gelegenheid.',
    res_tag: 'Boek Nu', res_title: 'Reserveer Je Tafel',
    res_modal_title: 'Reserveer Je Tafel',
    res_modal_subtitle: 'Leg je ideale tafel, tasting of groepsavond vast en laat ons team een soepele DownTown-ervaring voorbereiden.',
    form_name: 'Volledige Naam', form_email: 'E-mail', form_phone: 'Telefoon', form_when: 'Datum / Tijd',
    form_select: 'Type Reservering', form_people: 'Aantal Personen', form_notes_extended: 'Extra Informatie',
    form_name_placeholder: 'Jouw naam', form_email_placeholder: 'jij@example.com', form_phone_placeholder: '+32 ........',
    form_people_placeholder: '2', form_notes_placeholder: 'Vertel ons over je voorkeuren, gelegenheid of speciale verzoeken.',
    form_select_opt_dinner: 'Een tafel reserveren', form_select_opt_sports: 'Sportavond',
    form_select_opt_tasting: 'Bierproeverij', form_select_opt_private: 'Privé-evenement',
    form_date: 'Datum', form_time: 'Tijd', form_guests: 'Gasten', form_notes: 'Speciale Verzoeken',
    form_submit: 'Bevestig Reservering', form_submit_modal: 'Reserveer', form_sending: 'Verzenden...',
    form_success: '\uD83C\uDF89 Reservering bevestigd! Tot snel bij DownTown!',
    live_tag: 'Op de Schermen', live_title: 'Live Wedstrijden',
    mdesc_tag: 'Onze Drankjes', mdesc_title: 'Een Wereld van Smaak',
    mdesc_p1: 'Ontdek een brede selectie dranken die indruk maken. Van perfect gebalanceerde cocktails tot de beste Belgische bieren van de tap.',
    mdesc_p2: 'Of je nu zin hebt in een verfrissende Belgische pils, een ambachtelijke cocktail of een gerijpte whisky — onze kaart heeft voor ieder wat wils.',
    mdesc_cta: 'Bekijk het Volledige Menu',
    di1: 'Cocktails', di2: 'Bieren', di3: 'Sterke Drank', di4: 'Wijnen',
    menuDescription: 'Geniet van een uitgebreide drankenkaart bij DownTown Brussels, met Belgische bieren van het vat, creatieve cocktails en kwaliteitsvolle sterke dranken.',
    eventsDescription: 'Op zoek naar de beste plek om live sport te kijken in Brussel? Bekijk voetbal, Champions League en grote sportevenementen bij DownTown Brussels, met meerdere schermen, geweldig geluid en een levendige sfeer.',
    footer_tagline: 'De plek voor Belgische bieren & live sport',
    footer_hours_title: 'Openingsuren', footer_hours: 'Maandag - Zondag',
    footer_contact_title: 'Contact', footer_nav_title: 'Snelkoppelingen',
    footer_nav_home: 'Home', footer_nav_menu: 'Menu', footer_nav_events: 'Evenementen',
    footer_nav_res: 'Reserveringen', footer_nav_contact: 'Contact',
    footer_cta: 'Reservatie',
    footer_addr_line1: 'Henri Mausstraat 15,', footer_addr_line2: '1000 Brussel (Beursplein)',
    drawer_addr: 'Henri Mausstraat 15, 1000 Brussel (Beursplein)', drawer_hours: 'Ma–Zo: 12:00 – 01:00',
    footer_rights: 'Alle rechten voorbehouden.', footer_made: 'Gemaakt met ❤️ in Brussel',
    sel_tag: 'Ons Aanbod', sel_title: 'Onze Selecties',
    sel_subtitle: 'Drie redenen waarom DownTown jouw bestemming in Brussel is.',
    sel1_title: 'Belgische Schatten', sel1_text: 'Trappisten, Dubbels, Tripels, Lambieken, Witbieren — een authentieke collectie voor echte bierliefhebbers.', sel1_cta: 'Ontdek Selectie',
    sel2_title: 'Supporters Zone', sel2_text: 'Bekijk het hele jaar door grote sportevenementen live op grote schermen. Geniet van een opwindende sfeer.', sel2_cta: 'Bekijk Live Events',
    sel3_title: 'Zeldzame & Speciaalbieren', sel3_text: 'Geniet van Trappisten, Dubbels, Tripels, Lambieken en Witbieren — zorgvuldig bewaard in vaten om versheid en smaak te behouden.', sel3_cta: 'Ontdek Meer',
    loc_tag: 'Ons vinden', loc_title: 'Ons vinden', loc_subtitle: 'Bezoek ons in het hart van Brussel.',
    loc_text: 'DownTown Brussels is ideaal gelegen op slechts enkele stappen van de Beurs en de Grote Markt. Gemakkelijk bereikbaar en de perfecte plek om te genieten van kwaliteitsdranken, een levendige sfeer en live sportuitzendingen.',
    loc_addr: 'Henri Mausstraat 15, 1000 Brussel (Beursplein)', loc_cta: 'Open in Google Maps',
    faq_tag: 'Veelgestelde Vragen', faq_title: 'FAQ',
    gallery_tag: 'In het stadscentrum', gallery_title: 'Galerij',
    gallery_subtitle: 'Stap in de gloed van Downtown met signature cocktails, verfijnde bardetails en een nachtelijke sfeer waarin elke ronde filmisch aanvoelt.',
    faq_subtitle: 'Alles wat je vooraf wilt weten voor je volgende avond bij DownTown.',
    faq: [
      {
        question: 'Is het nodig om een tafel te reserveren?',
        answer: 'Reserveren is niet verplicht, maar sterk aanbevolen, vooral ’s avonds en op wedstrijddagen. Onze locatie vlak bij de Place de la Bourse is erg populair.'
      },
      {
        question: 'Kunnen we reserveren voor een grote groep?',
        answer: 'Ja, absoluut! Of het nu gaat om een verjaardag, afterwork of een spelletjesavond met vrienden en een Belgian beer, groepen zijn van harte welkom.'
      },
      {
        question: 'Is het mogelijk om een ruimte te privatiseren?',
        answer: 'Ja! Wij bieden privatiseringsmogelijkheden voor privé- en bedrijfsevenementen in het centrum van Brussel, vlak bij de Place de la Bourse.'
      },
      {
        question: 'Wat is de specialiteit van jullie brasserie?',
        answer: 'Onze specialiteit is Belgian beer! We bieden een exclusieve selectie Belgische bieren aan. Ons team helpt je graag bij je keuze.'
      },
      {
        question: 'Welke sporten en wedstrijden zenden jullie uit?',
        answer: 'We zenden voornamelijk voetbal uit (Champions League, Belgische Pro League, Premier League, nationale ploeg…), maar ook rugby en tennis. Perfect met een Belgian beer.'
      },
      {
        question: 'Hoe bereik je DownTown Brussels?',
        answer: 'We bevinden ons in het centrum van Brussel, vlak bij de Place de la Bourse, en zijn gemakkelijk bereikbaar met het openbaar vervoer.'
      },
      {
        question: 'Kunnen we een specifieke wedstrijd aanvragen?',
        answer: 'Ja! Als je met een groep komt, kun je bij je reservering een specifieke wedstrijd aanvragen. Indien mogelijk, tonen we die graag terwijl je geniet van een Belgian beer.'
      }
    ]
  }
};

// =============================================
// 2. SPORTS EVENTS DATA
// =============================================
const allMatches = [
  // Belgian Pro League — Playoffs
  { competition: 'Belgian Pro League', stage: 'Playoffs', home: 'Club Brugge', away: 'Anderlecht', date: '2026-04-06', time: '18:30' },
  { competition: 'Belgian Pro League', stage: 'Playoffs', home: 'Anderlecht', away: 'Genk', date: '2026-04-13', time: '18:30' },
  { competition: 'Belgian Pro League', stage: 'Playoffs', home: 'Antwerp', away: 'Club Brugge', date: '2026-04-13', time: '13:30' },
  { competition: 'Belgian Pro League', stage: 'Playoffs', home: 'Club Brugge', away: 'Genk', date: '2026-04-20', time: '18:30' },
  { competition: 'Belgian Pro League', stage: 'Playoffs', home: 'Genk', away: 'Club Brugge', date: '2026-04-27', time: '18:30' },
  { competition: 'Belgian Pro League', stage: 'Playoffs', home: 'Anderlecht', away: 'Club Brugge', date: '2026-05-04', time: '18:30' },
  { competition: 'Belgian Pro League', stage: 'Playoffs', home: 'Genk', away: 'Anderlecht', date: '2026-05-11', time: '18:30' },

  // Belgian Pro League — Regular Season
  { competition: 'Belgian Pro League', stage: 'Regular Season', home: 'Anderlecht', away: 'Club Brugge', date: '2026-07-26', time: '18:30' },
  { competition: 'Belgian Pro League', stage: 'Regular Season', home: 'Club Brugge', away: 'Genk', date: '2026-08-09', time: '20:45' },
  { competition: 'Belgian Pro League', stage: 'Regular Season', home: 'Anderlecht', away: 'Antwerp', date: '2026-08-10', time: '18:30' },
  { competition: 'Belgian Pro League', stage: 'Regular Season', home: 'Genk', away: 'Anderlecht', date: '2026-08-23', time: '18:30' },
  { competition: 'Belgian Pro League', stage: 'Regular Season', home: 'Club Brugge', away: 'Antwerp', date: '2026-08-24', time: '13:30' },
  { competition: 'Belgian Pro League', stage: 'Regular Season', home: 'Antwerp', away: 'Club Brugge', date: '2026-09-13', time: '20:45' },
  { competition: 'Belgian Pro League', stage: 'Regular Season', home: 'Anderlecht', away: 'Genk', date: '2026-09-14', time: '18:30' },

  // UEFA Champions League
  { competition: 'UEFA Champions League 2026', stage: 'Quarter Finals - 1st leg', home: 'Real Madrid', away: 'Bayern München', date: '2026-04-08', time: '21:00' },
  { competition: 'UEFA Champions League 2026', stage: 'Quarter Finals - 1st leg', home: 'Sporting Cp', away: 'Arsenal', date: '2026-04-07', time: '21:00' },
  { competition: 'UEFA Champions League 2026', stage: 'Quarter Finals - 1st leg', home: 'Paris', away: 'Liverpool', date: '2026-04-08', time: '21:00' },
  { competition: 'UEFA Champions League 2026', stage: 'Quarter Finals - 1st leg', home: 'Barcelona', away: 'Atlético de Madrid', date: '2026-04-08', time: '21:00' },
  { competition: 'UEFA Champions League 2026', stage: 'Quarter Finals - 2nd leg', home: 'Atlético de Madrid', away: 'Barcelona', date: '2026-04-14', time: '21:00' },
  { competition: 'UEFA Champions League 2026', stage: 'Quarter Finals - 2nd leg', home: 'Liverpool', away: 'Paris', date: '2026-04-14', time: '21:00' },
  { competition: 'UEFA Champions League 2026', stage: 'Quarter Finals - 2nd leg', home: 'Arsenal', away: 'Sporting CP', date: '2026-04-15', time: '21:00' },
  { competition: 'UEFA Champions League 2026', stage: 'Quarter Finals - 2nd leg', home: 'Bayern München', away: 'Real Madrid', date: '2026-04-15', time: '21:00' },

  // Belgium National Team
  { competition: 'FIFA WC Qualifiers', stage: 'National Team Matches', home: 'Belgium', away: 'Scotland', date: '2026-04-18', time: '20:30' },
  { competition: 'International Friendly', stage: 'National Team Matches', home: 'Croatia', away: 'Belgium', date: '2026-06-02', time: '18:00' },
  { competition: 'FIFA WC Qualifiers', stage: 'National Team Matches', home: 'Belgium', away: 'Luxembourg', date: '2026-06-05', time: '20:15' },
  { competition: 'International Friendly', stage: 'National Team Matches', home: 'Belgium', away: 'Tunisia', date: '2026-06-06', time: '15:00' },
  { competition: 'FIFA WC Qualifiers', stage: 'National Team Matches', home: 'Luxembourg', away: 'Belgium', date: '2026-06-09', time: '00:00' },
  { competition: 'UEFA Nations League', stage: 'National Team Matches', home: 'Italy', away: 'Belgium', date: '2026-09-25', time: '20:45' },
  { competition: 'UEFA Nations League', stage: 'National Team Matches', home: 'Belgium', away: 'France', date: '2026-09-28', time: '20:45' },
  { competition: 'UEFA Nations League', stage: 'National Team Matches', home: 'Belgium', away: 'Turkey', date: '2026-10-02', time: '20:45' },
  { competition: 'UEFA Nations League', stage: 'National Team Matches', home: 'France', away: 'Belgium', date: '2026-10-05', time: '20:45' },
  { competition: 'UEFA Nations League', stage: 'National Team Matches', home: 'Turkey', away: 'Belgium', date: '2026-11-12', time: '18:00' },
  { competition: 'UEFA Nations League', stage: 'National Team Matches', home: 'Belgium', away: 'Italy', date: '2026-11-15', time: '20:45' },

  // FIFA World Cup 2026 — Group Stage
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Mexico', away: 'South Africa', date: '2026-06-11', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Canada', away: 'UEFA Playoff A Winner', date: '2026-06-12', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Qatar', away: 'Switzerland', date: '2026-06-13', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Brazil', away: 'Morocco', date: '2026-06-14', time: '00:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Germany', away: 'Curaçao', date: '2026-06-14', time: '19:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Netherlands', away: 'Japan', date: '2026-06-14', time: '22:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Spain', away: 'Cape Verde', date: '2026-06-15', time: '18:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Belgium', away: 'Egypt', date: '2026-06-15', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Saudi Arabia', away: 'Uruguay', date: '2026-06-16', time: '00:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'France', away: 'Senegal', date: '2026-06-16', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'X', away: 'Norway', date: '2026-06-17', time: '00:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Portugal', away: 'Uzbekistan', date: '2026-06-17', time: '19:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'England', away: 'Croatia', date: '2026-06-17', time: '22:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'South Africa', away: 'Mexico', date: '2026-06-18', time: '18:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Switzerland', away: 'UEFA Playoff A Winner', date: '2026-06-18', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Canada', away: 'Qatar', date: '2026-06-19', time: '00:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'United States', away: 'Australia', date: '2026-06-19', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Scotland', away: 'Morocco', date: '2026-06-20', time: '00:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Netherlands', away: 'UEFA Playoff B Winner', date: '2026-06-20', time: '19:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Germany', away: 'Ivory Coast', date: '2026-06-20', time: '22:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Spain', away: 'Saudi Arabia', date: '2026-06-21', time: '18:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Belgium', away: 'Iran', date: '2026-06-21', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Uruguay', away: 'Cape Verde', date: '2026-06-22', time: '00:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Argentina', away: 'Austria', date: '2026-06-22', time: '19:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'France', away: 'Norway', date: '2026-06-22', time: '23:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Portugal', away: 'Uzbekistan', date: '2026-06-23', time: '19:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'England', away: 'Ghana', date: '2026-06-23', time: '22:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Switzerland', away: 'Canada', date: '2026-06-24', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'X', away: 'Qatar', date: '2026-06-24', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Brazil', away: 'Scotland', date: '2026-06-25', time: '00:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Morocco', away: 'Haiti', date: '2026-06-25', time: '00:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Curaçao', away: 'Ivory Coast', date: '2026-06-25', time: '22:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Ecuador', away: 'Germany', date: '2026-06-25', time: '22:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Norway', away: 'France', date: '2026-06-26', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Senegal', away: 'X', date: '2026-06-26', time: '21:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Panama', away: 'England', date: '2026-06-27', time: '23:00' },
  { competition: 'FIFA World Cup 2026', stage: 'Group Stage', home: 'Croatia', away: 'Ghana', date: '2026-06-27', time: '23:00' },
];

const teamLogos = {
  // UCL
  'Real Madrid': 'https://crests.football-data.org/86.svg',
  'Bayern München': 'https://crests.football-data.org/5.svg',
  'Sporting Cp': 'https://crests.football-data.org/498.svg',
  'Sporting CP': 'https://crests.football-data.org/498.svg',
  'Arsenal': 'https://crests.football-data.org/57.svg',
  'Paris': 'https://crests.football-data.org/524.svg',
  'Liverpool': 'https://crests.football-data.org/64.svg',
  'Barcelona': 'https://crests.football-data.org/81.svg',
  'Atlético de Madrid': 'https://crests.football-data.org/78.svg',
  // BPL
  'Club Brugge': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Club_Brugge_Logo.png',
  'Anderlecht': 'images/fc/Logo_RSC_Anderlecht_2023.svg',
  'Antwerp': 'https://crests.football-data.org/576.svg',
  'Genk': 'images/fc/Logo_KRC_Genk.png',
  'Union SG': 'https://crests.football-data.org/583.svg',
  // National Flags
  'Belgium': 'https://flagcdn.com/be.svg',
  'France': 'https://flagcdn.com/fr.svg',
  'Croatia': 'https://flagcdn.com/hr.svg',
  'Scotland': 'https://flagcdn.com/gb-sct.svg',
  'Luxembourg': 'https://flagcdn.com/lu.svg',
  'Tunisia': 'https://flagcdn.com/tn.svg',
  'Egypt': 'https://flagcdn.com/eg.svg',
  'Iran': 'https://flagcdn.com/ir.svg',
  'Italy': 'https://flagcdn.com/it.svg',
  'Turkey': 'https://flagcdn.com/tr.svg',
  // World Cup Teams
  'Mexico': 'https://flagcdn.com/mx.svg',
  'South Africa': 'https://flagcdn.com/za.svg',
  'Canada': 'https://flagcdn.com/ca.svg',
  'Qatar': 'https://flagcdn.com/qa.svg',
  'Switzerland': 'https://flagcdn.com/ch.svg',
  'Brazil': 'https://flagcdn.com/br.svg',
  'Morocco': 'https://flagcdn.com/ma.svg',
  'Germany': 'https://flagcdn.com/de.svg',
  'Curaçao': 'https://flagcdn.com/cw.svg',
  'Netherlands': 'https://flagcdn.com/nl.svg',
  'Japan': 'https://flagcdn.com/jp.svg',
  'Spain': 'https://flagcdn.com/es.svg',
  'Cape Verde': 'https://flagcdn.com/cv.svg',
  'Saudi Arabia': 'https://flagcdn.com/sa.svg',
  'Uruguay': 'https://flagcdn.com/uy.svg',
  'Senegal': 'https://flagcdn.com/sn.svg',
  'Norway': 'https://flagcdn.com/no.svg',
  'Portugal': 'https://flagcdn.com/pt.svg',
  'England': 'https://flagcdn.com/gb-eng.svg',
  'Australia': 'https://flagcdn.com/au.svg',
  'Ivory Coast': 'https://flagcdn.com/ci.svg',
  'United States': 'https://flagcdn.com/us.svg',
  'Argentina': 'https://flagcdn.com/ar.svg',
  'Austria': 'https://flagcdn.com/at.svg',
  'Uzbekistan': 'https://flagcdn.com/uz.svg',
  'Ghana': 'https://flagcdn.com/gh.svg',
  'Haiti': 'https://flagcdn.com/ht.svg',
  'Ecuador': 'https://flagcdn.com/ec.svg',
  'Panama': 'https://flagcdn.com/pa.svg',
  'UEFA Playoff A Winner': 'https://flagcdn.com/un.svg',
  'UEFA Playoff B Winner': 'https://flagcdn.com/un.svg',
  'X': 'https://flagcdn.com/un.svg'
};

function getLogo(teamName) {
  return teamLogos[teamName] || '';
}

// =============================================
// 3. STATE
// =============================================
let currentLang = 'en';
let bodyScrollLocks = 0;
let activeFaqIndex = 0;
let selectedMatchDate = '';
let nextUpdateTimeout = null;
const locationMapEmbedByLang = {
  en: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d353.4505665363378!2d4.349797889180206!3d50.84766077609295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c53bbe38d92f%3A0x16e3ba0bfac7711a!2sDowntown%20Brussels!5e0!3m2!1sen!2sen!4v1776081560829!5m2!1sen!2sen',
  fr: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d353.4505665363378!2d4.349797889180206!3d50.84766077609295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c53bbe38d92f%3A0x16e3ba0bfac7711a!2sDowntown%20Brussels!5e0!3m2!1sfr!2sfr!4v1776081560829!5m2!1sfr!2sfr',
  nl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d353.4505665363378!2d4.349797889180206!3d50.84766077609295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c53bbe38d92f%3A0x16e3ba0bfac7711a!2sDowntown%20Brussels!5e0!3m2!1snl!2snl!4v1776081560829!5m2!1snl!2snl'
};

// =============================================
// 4. LANGUAGE SWITCHING
// =============================================
function applyTranslations(lang) {
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
  });
  document.documentElement.lang = lang;
}

function updateLocationMapLanguage(lang) {
  const iframe = document.getElementById('location-map-embed');
  if (!iframe) return;
  const src = locationMapEmbedByLang[lang] || locationMapEmbedByLang.en;
  iframe.setAttribute('src', src);
}

function lockBodyScroll() {
  bodyScrollLocks += 1;
  document.body.classList.add('modal-open');
}

function unlockBodyScroll() {
  bodyScrollLocks = Math.max(0, bodyScrollLocks - 1);
  if (bodyScrollLocks === 0) document.body.classList.remove('modal-open');
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  applyTranslations(lang);
  updateLocationMapLanguage(lang);
  renderFAQ();
  renderEvents();
  renderLiveGames();
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// =============================================
// 5. NAVBAR — SCROLL + MOBILE DRAWER
// =============================================
function renderFAQ() {
  const faqList = document.getElementById('faq-list');
  const items = translations[currentLang]?.faq || translations.en.faq;
  if (!faqList || !Array.isArray(items)) return;

  if (activeFaqIndex >= items.length) activeFaqIndex = 0;

  faqList.innerHTML = items.map((item, index) => `
    <article class="faq-item ${index === activeFaqIndex ? 'is-open' : ''}">
      <button class="faq-question" type="button" aria-expanded="${index === activeFaqIndex ? 'true' : 'false'}" data-index="${index}">
        <span class="faq-question-text">${item.question}</span>
        <span class="faq-icon" aria-hidden="true"></span>
      </button>
      <div class="faq-answer-wrap">
        <div class="faq-answer">
          <div class="faq-answer-inner">${item.answer}</div>
        </div>
      </div>
    </article>
  `).join('');
}

function syncFAQState() {
  document.querySelectorAll('.faq-item').forEach((item, index) => {
    const isOpen = index === activeFaqIndex;
    item.classList.toggle('is-open', isOpen);
    const trigger = item.querySelector('.faq-question');
    if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

function initFAQ() {
  const faqList = document.getElementById('faq-list');
  if (!faqList || faqList.dataset.bound === 'true') return;
  faqList.dataset.bound = 'true';

  faqList.addEventListener('click', e => {
    const trigger = e.target.closest('.faq-question');
    if (!trigger) return;

    const nextIndex = Number(trigger.dataset.index);
    activeFaqIndex = activeFaqIndex === nextIndex ? -1 : nextIndex;
    syncFAQState();
  });
}

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-menu');
const backdrop = document.getElementById('nav-backdrop');
const drawerCloseBtn = document.getElementById('drawer-close');

function openDrawer() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  backdrop.classList.add('show');
  lockBodyScroll();
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  backdrop.classList.remove('show');
  unlockBodyScroll();
}

hamburger.addEventListener('click', () => {
  if (drawer.classList.contains('open')) closeDrawer();
  else openDrawer();
});

if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);

// Close drawer when any drawer link or CTA is clicked
document.querySelectorAll('.drawer-link, .drawer-cta').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// Close drawer on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Back to top
  const btt = document.getElementById('back-to-top');
  if (btt) btt.classList.toggle('show', window.scrollY > 400);
  // Active nav link
  highlightNavLink();
});

// =============================================
// 6. ACTIVE NAV LINK ON SCROLL
// =============================================
function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  // Match by data-section attribute OR href
  document.querySelectorAll('.nav-link').forEach(a => {
    const sec = a.dataset.section || '';
    const href = a.getAttribute('href') || '';
    const isActive = sec === current || href === '#' + current;
    a.classList.toggle('active', isActive);
  });
}

// =============================================
// 7. BACK TO TOP
// =============================================
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
// 8. EVENTS / MATCHES LOGIC
// =============================================
/**
 * Timezone Standardization: All logic strictly uses Europe/Brussels.
 */
function getBelgiumNow() {
  // Returns a Date object representing the current time in Belgium.
  const s = new Date().toLocaleString("en-US", { timeZone: "Europe/Brussels" });
  return new Date(s);
}

function getTodayStr() {
  const now = getBelgiumNow();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Converts match date/time strings into a Belgium-referenced Date object.
 * Used for consistent comparison regardless of browser timezone.
 */
function getMatchDateTime(ev) {
  return new Date(
    new Date(`${ev.date}T${ev.time}:00`).toLocaleString("en-US", {
      timeZone: "Europe/Brussels"
    })
  );
}

function getMatchStatus(event) {
  const now = getBelgiumNow();
  const matchStart = getMatchDateTime(event);
  const matchEnd = new Date(matchStart.getTime() + 120 * 60 * 1000); // 2h duration

  if (now >= matchStart && now <= matchEnd) return 'live';
  if (now > matchEnd) return 'past';
  return 'upcoming';
}

/**
 * Returns a flag image HTML string for a given country name.
 * Uses a mapping to convert names to ISO codes for reliability.
 * @param {string} countryName e.g. "Sweden", "Italy"
 */
// getFlag function was removed as it is replaced by getLogo for club matches.

function renderMatchCard(event, compact = false) {
  const status = getMatchStatus(event);
  const statusLabels = { live: 'LIVE', upcoming: 'UPCOMING', past: 'FINISHED' };
  const statusClasses = { live: 'status-live', upcoming: 'status-upcoming', past: 'status-upcoming' };

  const logoA = getLogo(event.home);
  const logoB = getLogo(event.away);

  if (compact) {
    return `
      <div class="mini-match ${status === 'live' ? 'live-match' : ''}">
        <span class="mini-teams">
          <img src="${logoA}" class="team-flag" alt="${event.home} logo"> 
          ${event.home} vs 
          <img src="${logoB}" class="team-flag" alt="${event.away} logo">
          ${event.away}
        </span>
        <span class="mini-time">${event.time}</span>
        <span class="match-status ${statusClasses[status]}">${statusLabels[status]}</span>
      </div>`;
  }

  return `
    <div class="match-card ${status === 'live' ? 'live-match' : ''}">
      <div class="match-teams">
        <span class="team-lockup">
          <img src="${logoA}" class="team-flag" alt="${event.home} logo">
          <span>${event.home}</span>
        </span>
        <span class="match-vs">vs</span>
        <span class="team-lockup">
          <img src="${logoB}" class="team-flag" alt="${event.away} logo">
          <span>${event.away}</span>
        </span>
      </div>
      <div class="match-meta-info" style="display: flex; align-items: center; gap: 15px;">
        <div class="match-stage" style="font-size:0.85rem; color:var(--white-70); text-transform: uppercase; letter-spacing: 0.05em;">${event.stage}</div>
        <div class="match-time">${event.time}</div>
      </div>
      <div class="match-status ${statusClasses[status]}">${statusLabels[status]}</div>
    </div>`;
}

function renderEvents() {
  const matchesGrid = document.getElementById('matches-grid');
  const liveBanner = document.getElementById('live-banner');
  const competitionHeader = document.getElementById('events-competition-header');
  const activeDateLabel = document.getElementById('active-date-label');
  if (!matchesGrid) return;

  const today = getTodayStr();
  const dates = [...new Set(allMatches.map(ev => ev.date))].sort((a, b) => new Date(a) - new Date(b));

  // Auto select date: Today if exists, else nearest upcoming
  selectedMatchDate = dates.includes(today) ? today : dates.find(d => d >= today) || dates[dates.length - 1];

  const filteredMatches = allMatches.filter(ev => ev.date === selectedMatchDate);
  let html = '';
  let hasLive = false;

  if (filteredMatches.length === 0) {
    html = '<div class="no-matches" style="text-align:center;color:var(--white-40);padding:40px;">No matches scheduled. Check back soon!</div>';
  } else {
    // Group matches by competition & stage
    const groups = {};
    filteredMatches.forEach(ev => {
      const key = `${ev.competition} – ${ev.stage}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    });

    const groupKeys = Object.keys(groups);

    // If only one group, we use the main header as before
    if (groupKeys.length === 1) {
      const key = groupKeys[0];
      if (competitionHeader) {
        competitionHeader.style.display = 'block';
        competitionHeader.textContent = key;
      }
      groups[key].forEach(ev => {
        const status = getMatchStatus(ev);
        if (status === 'live') hasLive = true;
        html += renderMatchCard(ev);
      });
    } else {
      // Multiple groups: hide main header and render headers inside grid
      if (competitionHeader) competitionHeader.style.display = 'none';

      groupKeys.forEach(key => {
        html += `<h3 class="events-subtitle group-header" style="grid-column: 1 / -1; margin: 30px 0 15px; text-align: center; border-bottom: 1px solid var(--border); padding-bottom: 10px;">${key}</h3>`;
        groups[key].forEach(ev => {
          const status = getMatchStatus(ev);
          if (status === 'live') hasLive = true;
          html += renderMatchCard(ev);
        });
      });
    }

    // Update Date Label
    if (activeDateLabel) {
      const dObj = new Date(`${selectedMatchDate}T12:00:00`);
      activeDateLabel.textContent = dObj.toLocaleDateString(currentLang, {
        day: 'numeric', month: 'long', year: 'numeric',
        timeZone: "Europe/Brussels"
      });
    }
  }

  matchesGrid.innerHTML = html;
  if (liveBanner) liveBanner.style.display = hasLive ? 'flex' : 'none';

  scheduleNextUpdate();
}

/**
 * Smart update: schedules the next renderEvents call based on the next match status change.
 */
function scheduleNextUpdate() {
  if (nextUpdateTimeout) clearTimeout(nextUpdateTimeout);

  const now = getBelgiumNow();
  let nextTime = Infinity;

  allMatches.forEach(ev => {
    const matchStart = getMatchDateTime(ev);
    const matchEnd = new Date(matchStart.getTime() + 120 * 60 * 1000); // Assume 2h duration

    if (matchStart > now && matchStart < nextTime) nextTime = matchStart;
    if (matchEnd > now && matchEnd < nextTime) nextTime = matchEnd;
  });

  if (nextTime !== Infinity) {
    const delay = Math.max(1000, nextTime - now + 1000); // Min 1s, add 1s buffer
    nextUpdateTimeout = setTimeout(() => {
      renderEvents();
      renderLiveGames();
    }, delay);
  }
}

function renderLiveGames() {
  const lmdEl = document.getElementById('live-match-display');
  const allResEl = document.getElementById('all-matches-res');
  if (!lmdEl) return;

  const today = getTodayStr();
  const activeMatches = allMatches.filter(ev => getMatchStatus(ev) !== 'past');
  activeMatches.sort((a, b) => getMatchDateTime(a) - getMatchDateTime(b));

  // Priority selection for featured: LIVE -> Today's -> Nearest Upcoming
  let featured = activeMatches.find(e => getMatchStatus(e) === 'live')
    || activeMatches.find(e => e.date === today)
    || activeMatches[0];

  if (!featured && allMatches.length > 0) {
    featured = allMatches[allMatches.length - 1]; // Fallback if none active
  }

  if (featured) {
    const status = getMatchStatus(featured);
    const isToday = featured.date === getTodayStr();
    const statusLabel = status === 'live' ? 'Live Now' : isToday ? 'On Tonight' : 'Coming Up';

    const logoA = getLogo(featured.home);
    const logoB = getLogo(featured.away);

    lmdEl.innerHTML = `
        <div class="lmd-label">${statusLabel}</div>
        <div class="lmd-teams">
          <img src="${logoA}" class="team-flag" style="width:24px;" alt="${featured.home} logo">
          ${featured.home} vs 
          <img src="${logoB}" class="team-flag" style="width:24px;" alt="${featured.away} logo">
          ${featured.away}
        </div>
        <div class="lmd-time">Time ${featured.time} (Belgium) • ${new Date(`${featured.date}T12:00:00`).toLocaleDateString(currentLang, { day: 'numeric', month: 'short', timeZone: "Europe/Brussels" })}</div>
      `;
  }

  let html = '';
  activeMatches.forEach(ev => { html += renderMatchCard(ev, true); });
  if (allResEl) allResEl.innerHTML = html;
}

// 9. (Logic removed for grid menu)


// =============================================
// 10. RESERVATION MODAL + FORM
// =============================================
const reservationModal = document.getElementById('reservation-modal');
const reservationModalDialog = reservationModal ? reservationModal.querySelector('.reservation-modal__dialog') : null;
const reservationModalClose = document.getElementById('reservation-modal-close');
const reservationTriggers = document.querySelectorAll('a[href="#reservations"]');
const galleryLightbox = document.getElementById('gallery-lightbox');
const galleryLightboxDialog = galleryLightbox ? galleryLightbox.querySelector('.gallery-lightbox__dialog') : null;
const galleryLightboxImage = document.getElementById('gallery-lightbox-image');
const galleryLightboxTitle = document.getElementById('gallery-lightbox-title');
const galleryLightboxCounter = document.getElementById('gallery-lightbox-counter');
const galleryLightboxClose = document.getElementById('gallery-lightbox-close');
const galleryLightboxPrev = document.getElementById('gallery-lightbox-prev');
const galleryLightboxNext = document.getElementById('gallery-lightbox-next');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let activeGalleryIndex = 0;

function openReservationModal() {
  if (!reservationModal || reservationModal.classList.contains('is-open')) return;
  reservationModal.classList.add('is-open');
  reservationModal.setAttribute('aria-hidden', 'false');
  lockBodyScroll();
  armReservationFormSession();

  const whenInput = document.getElementById('res-when');
  if (whenInput) {
    setReservationMinDateTime(whenInput, { setSuggestedValue: !whenInput.value });
  }

  window.setTimeout(() => {
    const firstField = document.getElementById('res-name');
    if (firstField) firstField.focus();
  }, 140);
}

function closeReservationModal() {
  if (!reservationModal || !reservationModal.classList.contains('is-open')) return;
  reservationModal.classList.remove('is-open');
  reservationModal.setAttribute('aria-hidden', 'true');
  unlockBodyScroll();
}

reservationTriggers.forEach(trigger => {
  trigger.addEventListener('click', e => {
    e.preventDefault();
    if (drawer.classList.contains('open')) closeDrawer();
    openReservationModal();
  });
});

if (reservationModal) {
  reservationModal.addEventListener('click', e => {
    if (e.target.hasAttribute('data-modal-close') || (!reservationModalDialog.contains(e.target) && e.target === reservationModal)) {
      closeReservationModal();
    }
  });
}

if (reservationModalClose) {
  reservationModalClose.addEventListener('click', closeReservationModal);
}

function syncGalleryLightbox(index) {
  if (!galleryItems.length || !galleryLightboxImage) return;

  const normalizedIndex = (index + galleryItems.length) % galleryItems.length;
  const activeItem = galleryItems[normalizedIndex];
  const activeImage = activeItem.querySelector('img');
  if (!activeImage) return;

  activeGalleryIndex = normalizedIndex;
  galleryLightboxImage.src = activeImage.currentSrc || activeImage.src;
  galleryLightboxImage.alt = activeImage.alt;
  if (galleryLightboxTitle) galleryLightboxTitle.textContent = activeImage.alt;
  if (galleryLightboxCounter) galleryLightboxCounter.textContent = `${normalizedIndex + 1} / ${galleryItems.length}`;
}

function openGalleryLightbox(index) {
  if (!galleryLightbox || !galleryItems.length) return;
  syncGalleryLightbox(index);
  galleryLightbox.classList.add('is-open');
  galleryLightbox.setAttribute('aria-hidden', 'false');
  lockBodyScroll();

  window.setTimeout(() => {
    if (galleryLightboxClose) galleryLightboxClose.focus();
  }, 120);
}

function closeGalleryLightbox() {
  if (!galleryLightbox || !galleryLightbox.classList.contains('is-open')) return;
  galleryLightbox.classList.remove('is-open');
  galleryLightbox.setAttribute('aria-hidden', 'true');
  unlockBodyScroll();
}

function stepGallery(direction) {
  syncGalleryLightbox(activeGalleryIndex + direction);
}

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openGalleryLightbox(index));
});

let touchStartX = 0;
let touchEndX = 0;

if (galleryLightbox) {
  galleryLightbox.addEventListener('click', e => {
    if (e.target.hasAttribute('data-gallery-close') || (galleryLightboxDialog && !galleryLightboxDialog.contains(e.target) && e.target === galleryLightbox)) {
      closeGalleryLightbox();
    }
  });

  // Swipe support
  galleryLightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  galleryLightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left -> Next
    stepGallery(1);
  } else if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right -> Prev
    stepGallery(-1);
  }
}

if (galleryLightboxClose) galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
if (galleryLightboxPrev) galleryLightboxPrev.addEventListener('click', () => stepGallery(-1));
if (galleryLightboxNext) galleryLightboxNext.addEventListener('click', () => stepGallery(1));

document.addEventListener('keydown', e => {
  if (galleryLightbox && galleryLightbox.classList.contains('is-open')) {
    if (e.key === 'Escape') {
      closeGalleryLightbox();
      return;
    }

    if (e.key === 'ArrowLeft') {
      stepGallery(-1);
      return;
    }

    if (e.key === 'ArrowRight') {
      stepGallery(1);
      return;
    }
  }

  if (e.key === 'Escape' && reservationModal && reservationModal.classList.contains('is-open')) {
    closeReservationModal();
  }
});

const resForm = document.getElementById('res-form');

function getReservationUiText(key) {
  return RESERVATION_UI_TEXT[key] || '';
}

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatReservationDateTimeForDisplay(value) {
  const normalized = normalizeReservationDateTime(value);
  if (!normalized) return RESERVATION_DATE_PLACEHOLDER;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(normalized.raw).replace(',', '');
}

function updateReservationDateTimeDisplay() {
  const whenInput = document.getElementById('res-when');
  const display = document.getElementById('res-when-display');
  if (!whenInput || !display) return;

  if (!whenInput.value) {
    display.textContent = RESERVATION_DATE_PLACEHOLDER;
    display.classList.add('reservation-datetime-value--placeholder');
    return;
  }

  display.textContent = formatReservationDateTimeForDisplay(whenInput.value);
  display.classList.remove('reservation-datetime-value--placeholder');
}

function openReservationDateTimePicker() {
  const whenInput = document.getElementById('res-when');
  const trigger = document.getElementById('res-when-trigger');
  if (!whenInput) return;

  setReservationMinDateTime(whenInput);
  if (trigger) trigger.classList.add('is-active');

  if (typeof whenInput.showPicker === 'function') {
    whenInput.showPicker();
  } else {
    whenInput.focus();
    whenInput.click();
  }

  window.setTimeout(() => {
    if (trigger) trigger.classList.remove('is-active');
  }, 180);
}

function getReservationMinDateTimeValue() {
  const minDate = new Date();
  minDate.setSeconds(0, 0);
  return formatDateTimeLocal(minDate);
}

function setReservationMinDateTime(input, options = {}) {
  if (!input) return;
  const { setSuggestedValue = false } = options;
  const minValue = getReservationMinDateTimeValue();
  input.min = minValue;
  input.setAttribute('lang', 'en-GB');

  if (setSuggestedValue && !input.value) {
    const suggestedDate = new Date();
    suggestedDate.setMinutes(suggestedDate.getMinutes() + 60, 0, 0);
    input.value = formatDateTimeLocal(suggestedDate);
    updateReservationDateTimeDisplay();
    return;
  }

  if (input.value && new Date(input.value) < new Date(minValue)) {
    input.value = minValue;
  }

  updateReservationDateTimeDisplay();
}

function hideReservationFeedback() {
  const feedback = document.getElementById('form-success');
  if (!feedback) return;
  feedback.hidden = true;
  feedback.classList.remove('is-error');
}

function showReservationFeedback(message, type = 'success') {
  const feedback = document.getElementById('form-success');
  if (!feedback) return;
  feedback.hidden = false;
  feedback.textContent = message;
  feedback.classList.toggle('is-error', type === 'error');
}

function setReservationFieldInvalid(field, isInvalid) {
  if (!field) return;
  const group = field.closest('.form-group');
  if (group) group.classList.toggle('is-invalid', isInvalid);
  if (isInvalid) {
    field.setAttribute('aria-invalid', 'true');
  } else {
    field.removeAttribute('aria-invalid');
  }
}

function resetReservationFieldState(field) {
  setReservationFieldInvalid(field, false);
}

function armReservationFormSession() {
  if (!resForm) return;
  resForm.dataset.startedAt = String(Date.now());
  hideReservationFeedback();

  resForm.querySelectorAll('input, select, textarea').forEach(field => {
    resetReservationFieldState(field);
  });
}

function isValidReservationPhone(phone) {
  if (!/^[\d+\s().-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, '');
  const plusSigns = (phone.match(/\+/g) || []).length;
  return digits.length >= 7 && digits.length <= 15 && plusSigns <= 1 && (plusSigns === 0 || phone.trim().startsWith('+'));
}

function isValidReservationEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeReservationDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;

  const normalizedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const normalizedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  return {
    raw: date,
    date: normalizedDate,
    time: normalizedTime
  };
}

function getReservationCooldownRemaining() {
  try {
    const lastSubmit = Number(window.localStorage.getItem(RESERVATION_CONFIG.antiSpam.storageKey) || 0);
    if (!lastSubmit) return 0;
    return Math.max(0, RESERVATION_CONFIG.antiSpam.cooldownMs - (Date.now() - lastSubmit));
  } catch {
    return 0;
  }
}

function setReservationCooldown() {
  try {
    window.localStorage.setItem(RESERVATION_CONFIG.antiSpam.storageKey, String(Date.now()));
  } catch {
    // Ignore storage errors and keep the request flow working.
  }
}

function isReservationConfigReady() {
  const emailKey = RESERVATION_CONFIG.email?.accessKey || '';
  const botToken = RESERVATION_CONFIG.telegram?.botToken || '';
  const chatId = RESERVATION_CONFIG.telegram?.chatId || '';

  return (
    emailKey &&
    botToken &&
    chatId &&
    !emailKey.startsWith('PASTE_') &&
    !botToken.startsWith('PASTE_') &&
    !chatId.startsWith('PASTE_')
  );
}

function getReservationPayload() {
  const nameField = document.getElementById('res-name');
  const emailField = document.getElementById('res-email');
  const phoneField = document.getElementById('res-phone');
  const whenField = document.getElementById('res-when');
  const typeField = document.getElementById('res-occasion');
  const guestsField = document.getElementById('res-guests');
  const commentField = document.getElementById('res-notes');
  const honeypotField = document.getElementById('res-company');

  const invalidFields = [];
  const name = nameField ? nameField.value.trim() : '';
  const email = emailField ? emailField.value.trim() : '';
  const phone = phoneField ? phoneField.value.trim() : '';
  const whenValue = whenField ? whenField.value : '';
  const guestsValue = guestsField ? guestsField.value.trim() : '';
  const comment = commentField ? commentField.value.trim() : '';
  const reservationType = typeField ? typeField.value.trim() : '';
  const reservationKind = typeField && typeField.selectedOptions[0] ? (typeField.selectedOptions[0].dataset.reservationKind || '') : '';
  const normalizedDateTime = normalizeReservationDateTime(whenValue);

  if (!name) invalidFields.push({ field: nameField, message: getReservationUiText('required') });

  if (!phone) {
    invalidFields.push({ field: phoneField, message: getReservationUiText('required') });
  } else if (!isValidReservationPhone(phone)) {
    invalidFields.push({ field: phoneField, message: getReservationUiText('phone') });
  }

  if (email && !isValidReservationEmail(email)) {
    invalidFields.push({ field: emailField, message: getReservationUiText('email') });
  }

  if (!whenValue || !normalizedDateTime || normalizedDateTime.raw < new Date()) {
    invalidFields.push({ field: whenField, message: getReservationUiText('datetime') });
  }

  if (!reservationType) invalidFields.push({ field: typeField, message: getReservationUiText('required') });

  const guestsNumber = Number(guestsValue);
  if (!guestsValue) {
    invalidFields.push({ field: guestsField, message: getReservationUiText('required') });
  } else if (!Number.isFinite(guestsNumber) || guestsNumber <= 0) {
    invalidFields.push({ field: guestsField, message: getReservationUiText('guests') });
  }

  [nameField, emailField, phoneField, whenField, typeField, guestsField, commentField].forEach(field => {
    if (field) resetReservationFieldState(field);
  });

  if (invalidFields.length) {
    invalidFields.forEach(item => setReservationFieldInvalid(item.field, true));
    return {
      error: invalidFields[0].message,
      honeypotValue: honeypotField ? honeypotField.value.trim() : '',
      payload: null
    };
  }

  return {
    error: '',
    honeypotValue: honeypotField ? honeypotField.value.trim() : '',
    payload: {
      name,
      email,
      phone,
      date: normalizedDateTime.date,
      time: normalizedDateTime.time,
      reservation_type: reservationType,
      reservation_kind: reservationKind,
      guests: String(Math.trunc(guestsNumber)),
      comment
    }
  };
}

function buildReservationNotification(payload) {
  const safeEmail = payload.email || '-';
  const safeComment = payload.comment || '-';

  return [
    'New Reservation',
    '',
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${safeEmail}`,
    `Type: ${payload.reservation_type}`,
    `Date: ${payload.date}`,
    `Time: ${payload.time}`,
    `Guests: ${payload.guests}`,
    `Comment: ${safeComment}`
  ].join('\n');
}

async function fetchReservationJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), RESERVATION_CONFIG.requestTimeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    const contentType = response.headers.get('content-type') || '';
    const raw = await response.text();
    let data = {};

    if (raw) {
      try {
        data = contentType.includes('application/json') ? JSON.parse(raw) : { text: raw };
      } catch {
        data = { text: raw };
      }
    }

    if (!response.ok) {
      throw new Error(data.message || data.text || `Request failed with status ${response.status}`);
    }

    return data;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function sendReservationEmail(payload, honeypotValue) {
  const data = await fetchReservationJson(RESERVATION_CONFIG.email.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      access_key: RESERVATION_CONFIG.email.accessKey,
      subject: `New reservation for ${payload.date} at ${payload.time}`,
      from_name: 'DownTown Reservation Form',
      name: payload.name,
      email: payload.email || RESERVATION_CONFIG.restaurantEmail,
      replyto: payload.email || RESERVATION_CONFIG.restaurantEmail,
      message: buildReservationNotification(payload),
      botcheck: honeypotValue || '',
      reservation_type: payload.reservation_type,
      reservation_kind: payload.reservation_kind,
      phone: payload.phone,
      date: payload.date,
      time: payload.time,
      guests: payload.guests,
      comment: payload.comment || '-'
    })
  });

  if (data.success === false) {
    throw new Error(data.message || 'Email delivery failed');
  }
}

async function sendReservationTelegram(payload) {
  const url = `https://api.telegram.org/bot${RESERVATION_CONFIG.telegram.botToken}/sendMessage`;
  const data = await fetchReservationJson(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: RESERVATION_CONFIG.telegram.chatId,
      text: buildReservationNotification(payload)
    })
  });

  if (data.ok === false) {
    throw new Error(data.description || 'Telegram delivery failed');
  }
}

if (resForm) {
  const whenInput = document.getElementById('res-when');
  if (whenInput) {
    setReservationMinDateTime(whenInput, { setSuggestedValue: true });
    whenInput.addEventListener('focus', () => setReservationMinDateTime(whenInput));
    whenInput.addEventListener('change', () => setReservationMinDateTime(whenInput));
    whenInput.addEventListener('input', updateReservationDateTimeDisplay);
    updateReservationDateTimeDisplay();
  }

  const whenTrigger = document.getElementById('res-when-trigger');
  if (whenTrigger) {
    whenTrigger.addEventListener('click', openReservationDateTimePicker);
  }

  resForm.querySelectorAll('input, select, textarea').forEach(field => {
    const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(eventName, () => {
      resetReservationFieldState(field);
      hideReservationFeedback();
    });
  });

  armReservationFormSession();

  resForm.addEventListener('submit', async e => {
    e.preventDefault();
    const cooldownRemaining = getReservationCooldownRemaining();
    if (cooldownRemaining > 0) {
      showReservationFeedback(getReservationUiText('spam'), 'error');
      return;
    }

    const submitBtn = resForm.querySelector('[type="submit"]');
    const startedAt = Number(resForm.dataset.startedAt || 0);
    const sessionAge = startedAt ? (Date.now() - startedAt) : 0;
    const { error, honeypotValue, payload } = getReservationPayload();

    if (honeypotValue) return;

    if (error) {
      showReservationFeedback(error, 'error');
      return;
    }

    if (sessionAge < RESERVATION_CONFIG.antiSpam.minimumFillTimeMs) {
      showReservationFeedback(getReservationUiText('spam'), 'error');
      return;
    }

    if (!isReservationConfigReady()) {
      showReservationFeedback(getReservationUiText('configError'), 'error');
      return;
    }

    submitBtn.textContent = translations[currentLang].form_sending || translations.en.form_sending;
    submitBtn.disabled = true;

    try {
      await Promise.all([
        sendReservationEmail(payload, honeypotValue),
        sendReservationTelegram(payload)
      ]);

      setReservationCooldown();
      resForm.reset();
      setReservationMinDateTime(document.getElementById('res-when'), { setSuggestedValue: true });
      const successMessage = translations[currentLang]?.form_success || translations.en.form_success;
      showReservationFeedback(successMessage, 'success');

      window.setTimeout(() => {
        hideReservationFeedback();
        submitBtn.textContent = translations[currentLang].form_submit_modal || translations.en.form_submit_modal;
        submitBtn.disabled = false;
        closeReservationModal();
        armReservationFormSession();
      }, 2200);
    } catch (errorInfo) {
      console.error('Reservation submit failed:', errorInfo);
      showReservationFeedback(getReservationUiText('sendingError'), 'error');
      submitBtn.textContent = translations[currentLang].form_submit_modal || translations.en.form_submit_modal;
      submitBtn.disabled = false;
    }
  });
}

// =============================================
// 10.5 MENU ACCORDION (BEERS / COCKTAILS / SPIRITS / SHOTS)
// =============================================
function initMenuAccordion() {
  const accordionRow = document.querySelector('.menu-row-top--accordion');
  const triggers = accordionRow ? Array.from(accordionRow.querySelectorAll('.menu-accordion-trigger')) : [];
  if (!accordionRow || !triggers.length) return;

  const displayWrap = document.createElement('div');
  displayWrap.className = 'menu-accordion-display';
  displayWrap.hidden = true;

  const displayCard = document.createElement('div');
  displayCard.className = 'menu-v4-card menu-accordion-display-card';
  displayWrap.appendChild(displayCard);
  accordionRow.insertAdjacentElement('afterend', displayWrap);

  const panelForTrigger = (trigger) => {
    const panelId = trigger.getAttribute('aria-controls');
    return panelId ? document.getElementById(panelId) : null;
  };

  const itemForTrigger = (trigger) => trigger.closest('.menu-accordion-item');
  const isInlineMode = () => window.matchMedia('(max-width: 768px)').matches;

  const closeAll = () => {
    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      const panel = panelForTrigger(trigger);
      const item = itemForTrigger(trigger);
      if (panel) panel.hidden = true;
      if (item) item.classList.remove('is-inline-open');
    });
    displayWrap.hidden = true;
    displayCard.innerHTML = '';
  };

  const openTrigger = (trigger) => {
    const panel = panelForTrigger(trigger);
    if (!panel) return;

    const inlineMode = isInlineMode();

    triggers.forEach(itemTrigger => {
      const isActive = itemTrigger === trigger;
      const itemPanel = panelForTrigger(itemTrigger);
      const item = itemForTrigger(itemTrigger);

      itemTrigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      if (itemPanel) itemPanel.hidden = inlineMode ? !isActive : true;
      if (item) item.classList.toggle('is-inline-open', inlineMode && isActive);
    });

    if (inlineMode) {
      displayWrap.hidden = true;
      displayCard.innerHTML = '';
      panel.hidden = false;
      return;
    }

    displayCard.innerHTML = panel.innerHTML;
    compactOpenedMenu(displayCard);
    displayWrap.hidden = false;
  };

  const refreshOpenedPanel = () => {
    const active = triggers.find(trigger => trigger.getAttribute('aria-expanded') === 'true');
    if (!active) {
      closeAll();
      return;
    }
    openTrigger(active);
  };

  triggers.forEach((trigger) => {
    const panel = panelForTrigger(trigger);
    if (panel) panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeAll();
        return;
      }

      openTrigger(trigger);
    });
  });

  // Keep opened panel text in sync after language switches.
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.setTimeout(refreshOpenedPanel, 0);
    });
  });

  window.addEventListener('resize', () => {
    window.setTimeout(refreshOpenedPanel, 0);
  });
}

function initInlineMenuAccordions() {
  const accordions = Array.from(document.querySelectorAll('.menu-inline-accordion'));
  if (!accordions.length) return;

  accordions.forEach((accordion) => {
    const trigger = accordion.querySelector('.menu-accordion-trigger--inline');
    if (!trigger) return;

    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const syncState = (isOpen) => {
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      panel.hidden = !isOpen;
    };

    syncState(trigger.getAttribute('aria-expanded') === 'true');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      syncState(!isOpen);
    });
  });
}

function isVolumeMetaText(text) {
  return /\b\d+\s*cl\b/i.test(String(text || ''));
}

function normalizeVolumeRows(root = document) {
  const lists = Array.from(root.querySelectorAll('.menu-v4-list'));
  if (!lists.length) return;

  lists.forEach((listEl) => {
    if (listEl.classList.contains('menu-v4-list--abv')) return;

    const rows = Array.from(listEl.querySelectorAll(':scope > li'));
    rows.forEach((li) => {
      li.classList.remove('menu-v4-list__row-compact-triplet');

      const metaEl = li.querySelector(':scope > .item-meta');
      const priceEl = li.querySelector(':scope > .price');
      if (!metaEl || !priceEl) return;
      if (!isVolumeMetaText(metaEl.textContent)) return;

      li.classList.add('menu-v4-list__row-compact-triplet');
    });
  });
}

function compactOpenedMenu(container) {
  if (!container) return;
  const sectionTitles = Array.from(container.querySelectorAll('.cocktail-sub-title'));
  if (!sectionTitles.length) return;

  sectionTitles.forEach((titleEl, index) => {
    const listEl = titleEl.nextElementSibling;
    if (!listEl || !listEl.classList.contains('menu-v4-list')) return;

    const details = document.createElement('details');
    details.className = 'menu-subgroup';
    details.open = false;

    const summary = document.createElement('summary');
    summary.className = 'menu-subgroup__summary';

    const titleText = document.createElement('span');
    titleText.className = 'menu-subgroup__title';
    titleText.textContent = titleEl.textContent.trim();

    const toggleMark = document.createElement('span');
    toggleMark.className = 'menu-subgroup__count';
    toggleMark.textContent = details.open ? '-' : '+';

    summary.append(titleText, toggleMark);

    const body = document.createElement('div');
    body.className = 'menu-subgroup__body';

    // Normalize only volume rows (e.g. 70cl / 80cl) for strict column alignment.
    normalizeVolumeRows(listEl);

    body.appendChild(listEl);

    details.append(summary, body);
    details.addEventListener('toggle', () => {
      // Keep subgroup behavior consistent: open one section at a time.
      if (details.open) {
        container.querySelectorAll('.menu-subgroup').forEach((other) => {
          if (other !== details) other.open = false;
        });
      }

      toggleMark.textContent = details.open ? '-' : '+';
    });
    titleEl.replaceWith(details);
  });
}

// =============================================
// 11. SCROLL REVEAL ANIMATION
// =============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function initReveal() {
  document.querySelectorAll(
    '.glass-card, .glass-card-ref, .section-header, .menu-intro-text, .events-intro-text, .tasting-card, .feature-card, .feat-v2-card, .features-v2-product, .why-item, .about-feat, .dual-card, .drink-icon-card, .match-card, .mini-match, .sel-card, .location-content, .location-map-wrap, .menu-v4-card, .wine-banner, .gallery-item'
  ).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

// =============================================
// 12. HERO PARTICLES
// =============================================
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const isGold = Math.random() > 0.6;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${isGold ? 'rgba(201,168,76,0.7)' : 'rgba(0,180,255,0.7)'};
      box-shadow: 0 0 ${size * 3}px ${isGold ? 'rgba(201,168,76,0.4)' : 'rgba(0,180,255,0.4)'};
      animation-duration: ${Math.random() * 10 + 12}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

// =============================================
// 13. SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    if (a.getAttribute('href') === '#reservations') return;
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// =============================================
// 14. INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations('en');
  updateLocationMapLanguage('en');
  normalizeVolumeRows(document);
  renderFAQ();
  initFAQ();
  renderEvents();
  renderLiveGames();
  initMenuAccordion();
  initInlineMenuAccordions();
  createParticles();
  initReveal();
});

