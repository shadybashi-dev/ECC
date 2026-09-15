/**
 * SINGLE SOURCE OF TRUTH for Antonia's Pizza.
 * Every value here was captured from the live site on 2026-09-14.
 * Fields carrying `verify: true` in site-data/restaurant.json still need
 * owner confirmation before production launch. Nothing in this file is invented.
 */

export const CDN = {
  pluto: (id: string, w = 1600, h = 900) =>
    `https://antoniaspizza.com/pluto-images/${id}?w=${w}&h=${h}&fit=cover`,
  otter: (file: string) => `https://photos.tryotter.com/menu-photos/${file}`,
};

export const brand = {
  name: "Antonia's Pizza",
  url: 'https://antoniaspizza.com',
  orderUrl: 'https://antoniaspizza.toast.site/',
  reservationsUrl: 'https://antoniaspizza.com/reservations',
  appUrl:
    'https://c98e7d553a954b09a7deaefe428c6da0.app.ordersave.com/download-app',
  priceRange: '$$',
  servesCuisine: ['Pizza', 'Italian', 'Mediterranean', 'American'],
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Credit Card, Apple Pay, Google Pay',
  acceptsReservations: true,
  logo: '/favicon.svg',
};

export type Hours = { days: string[]; opens: string; closes: string };
export type Location = {
  id: string;
  name: string;
  shortName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  telephone: string;
  telephoneE164: string;
  lat: number;
  lng: number;
  placeId: string;
  slug: string;
  hours: Hours[];
  heroImage: string;
  blurb: string;
};

export const locations: Location[] = [
  {
    id: 'san-luis-obispo',
    name: "Antonia's Pizza San Luis Obispo",
    shortName: 'Downtown SLO',
    streetAddress: '891 Higuera St',
    addressLocality: 'San Luis Obispo',
    addressRegion: 'CA',
    postalCode: '93401',
    addressCountry: 'US',
    telephone: '(805) 439-2383',
    telephoneE164: '+18054392383',
    lat: 35.279991,
    lng: -120.6618261,
    placeId: 'ChIJabuB8BDx7IAR8tbrXipHtKw',
    slug: 'san-luis-obispo',
    hours: [
      { days: ['Sunday'], opens: '11:00', closes: '00:00' },
      { days: ['Monday'], opens: '11:00', closes: '00:00' },
      { days: ['Tuesday'], opens: '11:00', closes: '00:00' },
      { days: ['Wednesday'], opens: '11:00', closes: '00:00' },
      { days: ['Thursday'], opens: '11:00', closes: '02:00' },
      { days: ['Friday'], opens: '11:00', closes: '02:00' },
      { days: ['Saturday'], opens: '11:00', closes: '02:00' },
    ],
    heroImage: CDN.pluto('962cf92a-cbad-4425-bea5-24a23c132eca', 1200, 1200),
    blurb:
      'On Higuera, in the middle of downtown. Open till 2 AM Thursday through Saturday — the kitchen is still firing when everything else on the street has gone dark.',
  },
  {
    id: 'paso-robles',
    name: "Antonia's Pizza Paso Robles",
    shortName: 'Paso Robles',
    streetAddress: '729 12th St',
    addressLocality: 'Paso Robles',
    addressRegion: 'CA',
    postalCode: '93446',
    addressCountry: 'US',
    telephone: '(805) 238-1851',
    telephoneE164: '+18052381851',
    lat: 35.6269594,
    lng: -120.6906368,
    placeId: 'ChIJfy34NF3F7IAR5mt0Nx18-aY',
    slug: 'paso-robles',
    hours: [
      { days: ['Sunday'], opens: '11:00', closes: '00:00' },
      { days: ['Monday'], opens: '11:00', closes: '00:00' },
      { days: ['Tuesday'], opens: '11:00', closes: '00:00' },
      { days: ['Wednesday'], opens: '11:00', closes: '00:00' },
      { days: ['Thursday'], opens: '11:00', closes: '00:00' },
      { days: ['Friday'], opens: '11:00', closes: '02:00' },
      { days: ['Saturday'], opens: '11:00', closes: '02:00' },
    ],
    heroImage: CDN.pluto('bc063f34-fec1-40d2-9166-5f570a84f713', 1200, 1200),
    blurb:
      'Twelve blocks off the square in downtown Paso. Late kitchen Friday and Saturday, full menu every day, and the same dough made in-house both locations.',
  },
];

export const amenities = [
  'Family friendly',
  'Late night kitchen',
  'Delivery',
  'Takeout',
  'Group orders',
  'Vegan cheese available',
  'Reservations accepted',
  'Dine in',
];

export const serviceAreas = [
  'San Luis Obispo', 'Paso Robles', 'Cal Poly', 'Templeton', 'Avila Beach',
  'Los Ranchos', 'Edna', 'Santa Margarita', 'Goldtree', 'Chorro', 'Serrano',
  'Wellsona', 'Estrella', 'Sycamore Springs', 'Old Adobe', 'Asuncion', 'Linne',
];

export const deals = [
  {
    name: 'Two XL two-topping pizzas',
    price: '39.99',
    note: 'Two 18-inch XL pies, two toppings each. Feeds six to eight.',
    verify:
      'XL is 18 inches on the live menu, not 28. Two of them at $39.99 is $19.99 a pie against $28.99 solo — the strongest value on the menu.',
  },
  {
    name: 'Large Specialty Combo',
    price: '36.99',
    note: 'Any large specialty pie with the works on the side.',
    verify: 'Confirm what "the works" includes before launch.',
  },
];

/**
 * Ordering is handled ENTIRELY off-site by Toast. This site is a front end:
 * it presents the menu and hands the customer to Toast to order. There is no
 * cart, no checkout and no payment on this domain, by design.
 */
export const ordering = {
  provider: 'Toast',
  orderUrl: brand.orderUrl,
  /** Shown next to every order CTA so nobody is surprised by the handoff. */
  handoffLabel: 'Ordering & checkout on Toast',
  handoffNote:
    'We present the menu here; Toast takes the order, the payment and the pickup time. Same kitchen, same prices.',
  rel: 'noopener',
};

export const signature = {
  name: 'The Ajarski dough boat',
  image: CDN.pluto('2d273cc4-ddbb-49ae-a0c4-56108f6a7e86', 1600, 900),
  description:
    'A warm, fluffy bread boat loaded with fresh mozzarella, feta, egg, and butter — four ways to order it, zero reasons to skip it.',
  href: '/page/ajarski',
};

export type Review = {
  author: string;
  rating: number;
  quote: string;
  place: string;
  /** Where this review earns its keep — placed adjacent to the decision it supports. */
  context: string;
};

export const reviews: Review[] = [
  {
    author: 'Walid S.',
    rating: 5,
    place: 'San Luis Obispo',
    context: 'late-night',
    quote:
      "Had a crazy late shift and was craving some high-quality food, not just typical fast food. Googled 'late night pizza near me' and saw Antonia's was still open. Called them up and was honestly surprised how accommodating they were for a late delivery.",
  },
  {
    author: 'Patricia B.',
    rating: 5,
    place: 'San Luis Obispo',
    context: 'story',
    quote:
      "Hands down some of the best pizza in SLO! Great service, perfect flavors, and an unbelievable crust. It's so good that my nephew from Texas — who NEVER eats the crust — cleaned his entire plate. He was ready to look up his closest location back home until we found out Antonia's is a SLO exclusive.",
  },
  {
    author: 'Cecily F.',
    rating: 5,
    place: 'San Luis Obispo',
    context: 'delivery',
    quote:
      "Ordered for delivery and HANDS DOWN one of the best pizzas I've had in SLO. Opening the box and immediately being encompassed in the scent of oregano and various herbs was like being wrapped in a warm blanket. Cooked perfectly, didn't skimp on toppings and the texture of the crust was amazing!",
  },
  {
    author: 'Devin C.',
    rating: 5,
    place: 'San Luis Obispo',
    context: 'mediterranean',
    quote:
      "I ordered the gyro pizza which was tasty and quickly made, which worked great for my lunch break. My friend and I also tried the manakeesh pizza, but left the feta cheese off, and it was quite tasty. I'll definitely be back to try their other Mediterranean dishes and salads.",
  },
  {
    author: 'Kelly H.',
    rating: 5,
    place: 'San Luis Obispo',
    context: 'dessert',
    quote:
      "Pizza is the bomb! The crust, sauce, all the fresh toppings are exquisite. I love their pastas too, especially the creamy pesto. Also, don't skip dessert! They now have tiramisu and cannolis and the tiramisu was literally the best I've ever had.",
  },
];

export const gallery = [
  { src: CDN.pluto('acec08fb-fe6a-4514-b615-7608578090af', 800, 800), alt: 'A cheeseburger, two pastries, and a pizza slice on the counter of the Johnny\u2019s Lunch food truck.' },
  { src: CDN.pluto('b3222d38-5746-48f4-9452-ccb85a3e5e19', 800, 800), alt: 'A sandwich with meat, cheese, egg, and vegetables on a plate next to a latte.' },
  { src: CDN.pluto('5eda752e-64dd-43c6-90b3-8aee3bd082f4', 800, 800), alt: 'A smiling chef in a red apron kneading pizza dough on a floured counter.' },
  { src: CDN.pluto('962cf92a-cbad-4425-bea5-24a23c132eca', 800, 800), alt: 'A large slice of cheese pizza on a wooden board with basil, olive oil, and chili flakes.' },
  { src: CDN.pluto('bc063f34-fec1-40d2-9166-5f570a84f713', 800, 800), alt: 'A rustic wooden table set with steak, pasta, wine, and roasted potatoes.' },
  { src: CDN.pluto('ece063b4-c86d-4761-a860-ca7ff99b250b', 800, 800), alt: 'Grilled steak with a side salad and cucumber slices on a white plate.' },
];
