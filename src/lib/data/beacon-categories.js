/** Accent color and Tabler icon class for each beacon venue category. */
export const BEACON_CATEGORIES = {
	cafe: { color: '#1D9E75', icon: 'ti-coffee' },
	coffee: { color: '#1D9E75', icon: 'ti-coffee' },
	restaurant: { color: '#BA7517', icon: 'ti-soup' },
	food: { color: '#BA7517', icon: 'ti-soup' },
	bar: { color: '#7F77DD', icon: 'ti-beer' },
	nightlife: { color: '#7F77DD', icon: 'ti-beer' },
	club: { color: '#7F77DD', icon: 'ti-beer' },
	venue: { color: '#378ADD', icon: 'ti-music' },
	music: { color: '#378ADD', icon: 'ti-music' },
	arts: { color: '#D85A30', icon: 'ti-palette' },
	museum: { color: '#D85A30', icon: 'ti-building' },
	theatre: { color: '#D85A30', icon: 'ti-masks-theater' },
	theater: { color: '#D85A30', icon: 'ti-masks-theater' },
	shop: { color: '#D85A30', icon: 'ti-shopping-bag' },
	outdoors: { color: '#639922', icon: 'ti-trees' },
	park: { color: '#639922', icon: 'ti-trees' },
	beach: { color: '#1D9E75', icon: 'ti-wave-sine' },
	hotel: { color: '#378ADD', icon: 'ti-building' },
	gym: { color: '#639922', icon: 'ti-run' }
};

export const DEFAULT_BEACON_CATEGORY = { color: '#888780', icon: 'ti-map-pin' };

/** @param {string | null | undefined} category */
export function beaconCategory(category) {
	return BEACON_CATEGORIES[/** @type {keyof typeof BEACON_CATEGORIES} */ ((category ?? '').toLowerCase())] ?? DEFAULT_BEACON_CATEGORY;
}
