import { brand, locations, amenities, reviews, signature, gallery, ordering, type Location } from '../data/restaurant';
import { menu } from '../data/menu';
import { CDN } from '../data/restaurant';

/**
 * JSON-LD generators — one @graph per page, entities cross-referenced by @id.
 * Implements .claude/skills/restaurant-web-blueprint/references/jsonld-stack.md
 *
 * HARD RULES baked in here:
 *  - aggregateRating is NEVER emitted: we do not have a verified Google rating
 *    or review count, and a fabricated one is a Google structured-data policy
 *    violation with manual-action risk. Individual Review nodes ARE emitted,
 *    because those quotes are real and visible on the page.
 *  - Menu JSON-LD is generated from the same data file that renders the HTML
 *    menu, so the two can never drift.
 *  - priceCurrency is always paired with price (ISO 4217).
 */

/**
 * Returns the JSON-LD as a plain string.
 *
 * It used to return `{ type, set, value }` and Base.astro rendered
 * `<script type={schema.type} set:html={schema.value} />`. With a DYNAMIC type
 * attribute Astro's compiler cannot tell the tag is not JavaScript, so it ran
 * the payload through its module-script escaping and shipped literal `\n` and
 * `\"` bytes — unparseable to Google and to every other consumer. The type is
 * now static in the template and the tag carries `is:inline`, which tells the
 * compiler to leave the contents exactly as written.
 */
const jsonLd = (data: unknown): string => JSON.stringify(data, null, 2);

const siteUrl = brand.url.replace(/\/$/, '');
const rid = (l: Location) => `${siteUrl}/locations/${l.slug}#restaurant`;
const mid = `${siteUrl}/menu#menu`;

const address = (l: Location) => ({
  '@type': 'PostalAddress',
  streetAddress: l.streetAddress,
  addressLocality: l.addressLocality,
  addressRegion: l.addressRegion,
  postalCode: l.postalCode,
  addressCountry: l.addressCountry,
});

const hours = (l: Location) =>
  l.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));

const amenityFeature = amenities.map((name) => ({
  '@type': 'LocationFeatureSpecification',
  name,
  value: true,
}));

const reviewNodes = reviews.map((r) => ({
  '@type': 'Review',
  author: { '@type': 'Person', name: r.author },
  reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
  reviewBody: r.quote,
}));

/** The Restaurant entity for one physical location. */
function restaurantNode(l: Location) {
  return {
    '@type': 'Restaurant',
    '@id': rid(l),
    name: l.name,
    url: `${siteUrl}/locations/${l.slug}`,
    description: l.blurb,
    telephone: l.telephoneE164,
    priceRange: brand.priceRange,
    servesCuisine: brand.servesCuisine,
    currenciesAccepted: brand.currenciesAccepted,
    paymentAccepted: brand.paymentAccepted,
    acceptsReservations: brand.acceptsReservations ? 'True' : 'False',
    // Google's image rich results want 1x1, 4x3 and 16x9 of the SAME subject.
    // These are the restaurant's real hosted photos. Replace with locally
    // optimised AVIF/JPG crops before launch (see food-photography-generation §4).
    image: [
      CDN.pluto('962cf92a-cbad-4425-bea5-24a23c132eca', 800, 800),
      CDN.pluto('2d273cc4-ddbb-49ae-a0c4-56108f6a7e86', 960, 720),
      signature.image,
    ],
    logo: `${siteUrl}${brand.logo}`,
    address: address(l),
    geo: { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${l.streetAddress}, ${l.addressLocality}, ${l.addressRegion} ${l.postalCode}`,
    )}&query_place_id=${l.placeId}`,
    openingHoursSpecification: hours(l),
    amenityFeature,
    hasMenu: { '@id': mid },
    review: reviewNodes,
    sameAs: [brand.orderUrl, brand.reservationsUrl],
    potentialAction: [
      // Ordering is completed OFF this domain by Toast. Marked up as such so
      // an assistant reading the page does not claim this site takes payment.
      {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: ordering.orderUrl,
          actionApplication: { '@type': 'WebApplication', name: ordering.provider },
        },
        deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModePickUp',
      },
      {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: ordering.orderUrl,
          actionApplication: { '@type': 'WebApplication', name: ordering.provider },
        },
        deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet',
      },
      {
        '@type': 'ReserveAction',
        target: { '@type': 'EntryPoint', urlTemplate: brand.reservationsUrl },
        result: { '@type': 'FoodEstablishmentReservation', name: 'Table reservation' },
      },
    ],
  };
}

const menuNode = {
  '@type': 'Menu',
  '@id': mid,
  name: `${brand.name} Menu`,
  description:
    'Six pizza sizes from the 10-inch small to the 28-inch King, plus slices, calzones, signature pasta, wings, salads, sandwiches, desserts and drinks. Hand-crafted dough and home-made tomato sauce at both locations. Orders are completed on Toast, off this site.',
  inLanguage: 'en',
  hasMenuSection: menu.map((s) => ({
    '@type': 'MenuSection',
    '@id': `${siteUrl}/menu#${s.id}`,
    name: s.name,
    description: s.tagline ?? undefined,
    hasMenuItem: s.items.map((i) => ({
      '@type': 'MenuItem',
      '@id': `${siteUrl}/menu#${i.id}`,
      name: i.name,
      description: i.description ?? undefined,
      image: i.image ? [i.image] : undefined,
      // Only assert a diet the DISH actually is. 'vegan-option' means vegan
      // cheese can be substituted — claiming VeganDiet for it would be a
      // false structured-data statement and an accessibility lie.
      suitableForDiet: (() => {
        const d = i.diets ?? [];
        const out: string[] = [];
        if (d.includes('vegetarian')) out.push('https://schema.org/VegetarianDiet');
        if (d.includes('vegan')) out.push('https://schema.org/VeganDiet');
        return out.length ? out : undefined;
      })(),
      offers: i.price
        ? {
            '@type': 'Offer',
            price: i.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          }
        : undefined,
    })),
  })),
};

const websiteNode = {
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: brand.name,
  inLanguage: 'en',
  publisher: { '@id': rid(locations[0]) },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/menu?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const breadcrumb = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, n) => ({
    '@type': 'ListItem',
    position: n + 1,
    name: t.name,
    item: `${siteUrl}${t.path}`,
  })),
});

const faqNode = (qa: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  '@id': `${siteUrl}/#faq`,
  mainEntity: qa.map((x) => ({
    '@type': 'Question',
    name: x.q,
    acceptedAnswer: { '@type': 'Answer', text: x.a },
  })),
});

const webPageNode = (o: { path: string; name: string; image?: string }) => ({
  '@type': 'WebPage',
  '@id': `${siteUrl}${o.path}#webpage`,
  url: `${siteUrl}${o.path}`,
  name: o.name,
  isPartOf: { '@id': `${siteUrl}/#website` },
  about: { '@id': rid(locations[0]) },
  inLanguage: 'en',
  primaryImageOfPage: o.image
    ? { '@type': 'ImageObject', url: o.image }
    : undefined,
});

/* -------------------------------------------------------------------------
   CANONICAL-ENTITY POLICY
   Every entity is DEFINED once, on the page that owns it, and REFERENCED
   elsewhere by @id:

     - the full Menu graph (20 sections, 101 items) lives on /menu only.
       Shipping it on four pages was ~55 KB of duplicated JSON per page and
       gave Google four copies of the same @id to reconcile.
     - each Restaurant is defined in full on its own /locations/<slug> page
       and on the home page (the hub). A location page carries the OTHER
       branch as a bare reference, not a second full definition.

   A bare `{ '@id': ... }` is valid JSON-LD and is how @graph is meant to be
   used; it is not a duplicate.
   ------------------------------------------------------------------------- */

/** Home page: WebSite + both Restaurant nodes + WebPage + FAQ. Menu by reference. */
export function homeSchema(faq: { q: string; a: string }[]) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode,
      ...locations.map(restaurantNode),
      webPageNode({ path: '/', name: `${brand.name} — Pizza in San Luis Obispo & Paso Robles, open till 2 AM` }),
      faqNode(faq),
      breadcrumb([{ name: 'Home', path: '/' }]),
    ],
  });
}

/**
 * Location page: THIS branch defined in full, the sibling branch by reference,
 * the menu by reference. Plus WebPage + breadcrumbs.
 */
export function locationSchema(l: Location) {
  const sibling = locations.find((x) => x.id !== l.id);
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode,
      restaurantNode(l),
      // The other branch is a real place a customer may want, but its full
      // definition is canonical on its own page — reference it, do not restate it.
      ...(sibling ? [{ '@id': rid(sibling) }] : []),
      webPageNode({ path: `/locations/${l.slug}`, name: `${l.name} — ${l.streetAddress}`, image: l.heroImage }),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Locations', path: '/locations' },
        { name: l.addressLocality, path: `/locations/${l.slug}` },
      ]),
    ],
  });
}

/** Menu page: the ONLY page that defines the full Menu graph. */
export function menuSchema() {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      menuNode,
      ...locations.map(restaurantNode),
      webPageNode({ path: '/menu', name: `${brand.name} Menu — Pizza, Pasta, Wings & More` }),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
      ]),
    ],
  });
}

export function pageSchema(o: { path: string; name: string; image?: string }) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      ...locations.map(restaurantNode),
      webPageNode(o),
      breadcrumb([{ name: 'Home', path: '/' }, { name: o.name, path: o.path }]),
    ],
  });
}

/** Serialise the hours into plain declarative sentences for AI answer engines. */
export function hoursAsProse(l: Location): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 && h !== 24 ? 'PM' : 'AM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${hh} ${ampm}` : `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
  };
  return l.hours
    .map((h) => `${h.days.join(' and ')}: ${fmt(h.opens)} to ${fmt(h.closes)}`)
    .join('. ') + '.';
}
