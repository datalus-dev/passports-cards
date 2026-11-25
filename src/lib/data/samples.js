/**
 * One sample card for each passport, as a fan or a grid takes them: the props of the card, plus the `passport` slug
 * (`sampleCards` turns it into the fan's `href`), a `label` for
 * people who can't see the card, and a few fan options. Every site that shows samples (the home page of the app,
 * the sites that link to it, this package's demo page) takes them from here instead of keeping its own copy.
 * @type {import('../types.js').FanCard[]}
 */
export const SAMPLE_CARDS = [
	{ type: 'travel-tag', passport: 'travel', label: 'Travel passport sample: walking from Oviedo to Santiago de Compostela', mode: 'Walking', city: 'Santiago de Compostela', code: 'SCQ', origin: 'OVD', date: '15 Jul 2025' },
	{ type: 'ticket-stub', passport: 'tickets', label: 'Tickets passport sample: Arc de Triomphe stub', overlap: 2.4, color: 'oklch(52% 0.14 200)', art: '🎟', title: 'Arc de Triomphe', venue: 'Arc de Triomphe, Paris', badge: 'MUSEUM/EXHIBITION' },
	{ type: 'state-stamp', passport: 'united_states', label: 'United States passport sample: Hawaii stamp, Honolulu', overlap: 2.8, code: 'US-HI', city: 'Honolulu', date: '26 Mar 2025' },
	{ type: 'boarding-pass', passport: 'travel', label: 'Travel passport sample: boarding pass from EWR to CDG', overlap: 1.6, kind: 'Flight', from: 'EWR', to: 'CDG', to_city: 'Paris', date: '21 Jul 2014' },
	{ type: 'ticket-stub', passport: 'raver', label: 'Raver passport sample: Honey Dijon at Knockdown Center', overlap: 1, color: 'oklch(52% 0.20 305)', art: '🧑‍🎤', title: 'Honey Dijon, Kilopatrah Jones', venue: 'Knockdown Center, Brooklyn', genres: 'house · disco', badge: 'RAVE' },
	{ type: 'beacon', passport: 'beacon_bits', label: 'Beacon Bits passport sample: AMS Nest check-in', overlap: 2.6, venue: 'AMS Nest', shout: '#ATmosphereConf!', date: '28 Mar 2026' },
	{ type: 'sello', passport: 'camino', label: 'Camino passport sample: Salas to Tineo on the Camino Primitivo', overlap: 2.6, route: 'Camino Primitivo', leg: 'Salas → Tineo', meta: '21.7 km', date: '17 Jul 2025', crosses: '✠✠✠✠', more: '+1' }
];

/**
 * The samples with each link filled in as `origin + base + '/' + passport`. The defaults give the app's own public
 * examples (`/explore/travel`); another site passes its origin, and `base` to point at a profile instead, e.g.
 * `sampleCards({ origin: 'https://passports.social', base: '/profile/teonbrooks.com/passports' })`. Returns copies,
 * so a caller can change them.
 * @param {{ origin?: string, base?: string }} [options]
 * @returns {import('../types.js').FanCard[]}
 */
export function sampleCards({ origin = '', base = '/explore' } = {}) {
	return SAMPLE_CARDS.map(({ passport, ...card }) => ({ ...card, href: `${origin}${base}/${passport}` }));
}
