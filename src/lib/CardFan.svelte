<script>
	import TravelTag from './cards/TravelTag.svelte';
	import TicketStub from './cards/TicketStub.svelte';
	import StateStamp from './cards/StateStamp.svelte';
	import BoardingPass from './cards/BoardingPass.svelte';
	import BeaconCard from './cards/BeaconCard.svelte';
	import SelloCard from './cards/SelloCard.svelte';
	import { STATE_PATHS } from './data/state-paths.js';

	/** @import { FanCard } from './types.js' */

	/** @type {Record<string, import('svelte').Component<any>>} */
	const REGISTRY = {
		'travel-tag': TravelTag,
		'ticket-stub': TicketStub,
		'state-stamp': StateStamp,
		'boarding-pass': BoardingPass,
		beacon: BeaconCard,
		sello: SelloCard
	};

	/**
	 * @type {{ cards?: FanCard[], label?: string, overlap?: number, font?: 'mono' | 'inherit', variant?: 'full' | 'simplified' }}
	 *   `font`: 'mono' (default) is DM Mono, overridable with --ps-font; 'inherit' uses the host page's font.
	 *   `variant` is the default rendering for every card ('simplified' is compact and presentation-only,
	 *   'full' is the real ps-app card); a card's own `variant` overrides it.
	 *   `overlap` is the default rem each card tucks under its left neighbour.
	 */
	let { cards = [], label = 'Sample passport cards', overlap = 2.2, font = 'mono', variant = 'simplified' } = $props();

	// Fan geometry is computed from position: cards tilt 2deg per step away from
	// the centre and sink a little more the further out they sit.
	const items = $derived.by(() => {
		const known = cards.filter((c) => c.type in REGISTRY);
		const mid = (known.length - 1) / 2;
		return known.map((c, i) => {
			const { type, href, label: cardLabel, overlap: cardOverlap, variant: cardVariant, ...props } = c;
			if (type === 'state-stamp' && !props.path) props.path = STATE_PATHS[props.code];
			if (type === 'beacon' && props.width == null) props.width = '9.5rem';
			if (type === 'sello' && props.width == null) props.width = '11rem';
			const d = Math.abs(i - mid);
			return {
				Card: REGISTRY[type],
				props,
				cardVariant,
				href,
				label: cardLabel,
				style: `--z:${i + 1}; --y:${(0.12 * d * d).toFixed(2)}rem; --r:${(i - mid) * 2}deg; --ov:${i === 0 ? 0 : (cardOverlap ?? overlap)}rem`
			};
		});
	});
</script>

<div class="scroll">
	<ul class="fan" aria-label={label}>
		{#each items as { Card, props, cardVariant, href, label: cardLabel, style }, i (i)}
			<li {style}>
				{#if href}
					<a {href} aria-label={cardLabel}><Card {...props} {font} variant={cardVariant ?? variant} /></a>
				{:else}
					<Card {...props} {font} variant={cardVariant ?? variant} />
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.scroll {
		overflow-x: auto;
		padding: 1.75rem 0.5rem 2.5rem;
	}

	.fan {
		display: flex;
		align-items: center;
		width: max-content;
		margin: 0 auto;
		padding: 0;
		list-style: none;
	}

	.fan > li {
		position: relative;
		z-index: var(--z);
		margin: 0 0 0 calc(-1 * var(--ov));
		transform: translateY(var(--y)) rotate(var(--r));
		transform-origin: 50% 100%;
		transition: transform 0.18s ease;
	}

	.fan > li:hover,
	.fan > li:focus-within {
		z-index: 20;
		transform: translateY(-0.9rem) rotate(0deg) scale(1.04);
	}

	a {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	a:focus-visible {
		border-radius: 0.75rem;
		outline-offset: 6px;
	}

	@media (prefers-reduced-motion: reduce) {
		.fan > li {
			transition: none;
		}
	}
</style>
