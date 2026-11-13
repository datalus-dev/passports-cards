<script>
	import TravelTag from './cards/TravelTag.svelte';
	import TicketStub from './cards/TicketStub.svelte';
	import StateStamp from './cards/StateStamp.svelte';
	import BoardingPass from './cards/BoardingPass.svelte';
	import BeaconCard from './cards/BeaconCard.svelte';
	import SelloCard from './cards/SelloCard.svelte';
	import { STATE_PATHS } from './data/state-paths.js';
	import { onMount } from 'svelte';

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
	 * @type {{ cards?: FanCard[], label?: string, overlap?: number, font?: 'mono' | 'inherit', variant?: 'full' | 'simplified', mode?: 'flat' | 'curved', step?: number, radius?: number, breathe?: boolean, level?: boolean, align?: 'bottom' | 'center' }}
	 *   `font`: 'mono' (default) is DM Mono, overridable with --ps-font; 'inherit' uses the host page's font.
	 *   `variant` is the default rendering for every card ('simplified' is compact and presentation-only,
	 *   'full' is the real ps-app card); a card's own `variant` overrides it.
	 *   `overlap` is the default rem each card tucks under its left neighbour (flat mode).
	 *   `mode`: 'flat' (default) is a row of overlapping cards that tilt a little; 'curved' turns every card
	 *   about one pivot below the fan, like a hand of cards. A curved fan shrinks to fit a narrow container.
	 *   `step` is the degrees between neighbours and `radius` the rem from the cards' bottom edge to the
	 *   pivot (curved mode); a small radius fans the tops out sharply, a large one makes a shallow arc.
	 *   `breathe` lets a curved fan open and close slowly.
	 *   `level` lifts each card of a curved fan so every card's highest point sits at the same height,
	 *   instead of the outer cards dropping with the curve (useful when the fan peeks over an edge).
	 *   `align`: 'bottom' (default) stands every card on one baseline; 'center' puts every card's center
	 *   on one arc, so tall and short cards share the curve (`radius` is then from the centers; `level`
	 *   does not apply).
	 *   In both modes a card lifts on hover or focus and, with an `href`, links to its passport.
	 */
	let {
		cards = [],
		label = 'Sample passport cards',
		overlap = 2.2,
		font = 'mono',
		variant = 'simplified',
		mode = 'flat',
		step = 14,
		radius = 22,
		breathe = false,
		level = false,
		align = 'bottom'
	} = $props();

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
				style: `--z:${i + 1}; --y:${(0.12 * d * d).toFixed(2)}rem; --r:${(i - mid) * 2}deg; --a:${((i - mid) * step).toFixed(2)}deg; --ov:${i === 0 ? 0 : (cardOverlap ?? overlap)}rem`
			};
		});
	});

	// Curved mode: every card turns about one pivot `radius` below the cards' bottom edge. The
	// box is sized from the tallest and widest card (measured), so the fan keeps its own room.
	let rem = $state(16);
	onMount(() => {
		rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
	});
	/** @type {number[]} */
	let widths = $state([]);
	/** @type {number[]} */
	let heights = $state([]);
	let hostWidth = $state(0);

	const geo = $derived.by(() => {
		const n = items.length;
		const maxH = Math.max(0, ...heights.slice(0, n).map((h) => h || 0));
		const maxW = Math.max(0, ...widths.slice(0, n).map((w) => w || 0));
		const R = radius * rem;
		const amax = (Math.abs(((n - 1) / 2) * step) * Math.PI) / 180;
		const center = align === 'center';
		const reach = center
			? R * Math.sin(amax) + (maxW / 2) * Math.cos(amax) + (maxH / 2) * Math.sin(amax)
			: (R + maxH) * Math.sin(amax) + (maxW / 2) * Math.cos(amax);
		const drop = center
			? R * (1 - Math.cos(amax)) + (maxW / 2) * Math.sin(amax) + (maxH / 2) * Math.cos(amax)
			: R * (1 - Math.cos(amax)) + (maxW / 2) * Math.sin(amax);
		const W = Math.max(2 * reach, maxW);
		const H = center ? maxH / 2 + drop : maxH + drop;
		const k = hostWidth && W ? Math.min(1, hostWidth / W) : 1;
		return { R, W, H, drop, cy: maxH / 2, k };
	});

	// `level`: a rotated card's highest point is (R+h)cos a + (w/2)sin|a| above the pivot; lift each
	// card by how far it falls short of the highest one.
	const lifts = $derived.by(() => {
		const n = items.length;
		if (!level || align === 'center') return items.map(() => 0);
		const mid = (n - 1) / 2;
		const tops = items.map((_, i) => {
			const a = (Math.abs(i - mid) * step * Math.PI) / 180;
			return (geo.R + (heights[i] || 0)) * Math.cos(a) + ((widths[i] || 0) / 2) * Math.sin(a);
		});
		const best = Math.max(0, ...tops);
		return tops.map((t) => best - t);
	});
</script>

{#if mode === 'curved'}
	<div class="curved-host" bind:clientWidth={hostWidth}>
		<div class="curved-box" style="width: {geo.W * geo.k}px; height: {geo.H * geo.k}px">
			<ul
				class="fan curved"
				class:breathe
				class:center={align === 'center'}
				aria-label={label}
				style="--R: {geo.R}px; --drop: {geo.drop}px; --cy: {geo.cy}px; width: {geo.W}px; height: {geo.H}px; transform: scale({geo.k})"
			>
				{#each items as item, i (i)}
					<li style="{item.style}; --lift: {lifts[i]}px" bind:clientWidth={widths[i]} bind:clientHeight={heights[i]}>
							{#if item.href}
								<a href={item.href} aria-label={item.label}><item.Card {...item.props} {font} variant={item.cardVariant ?? variant} /></a>
							{:else}
								<item.Card {...item.props} {font} variant={item.cardVariant ?? variant} />
							{/if}
						</li>
				{/each}
			</ul>
		</div>
	</div>
{:else}
	<div class="scroll">
		<ul class="fan" aria-label={label}>
			{#each items as item, i (i)}
				<li style={item.style}>
						{#if item.href}
							<a href={item.href} aria-label={item.label}><item.Card {...item.props} {font} variant={item.cardVariant ?? variant} /></a>
						{:else}
							<item.Card {...item.props} {font} variant={item.cardVariant ?? variant} />
						{/if}
					</li>
			{/each}
		</ul>
	</div>
{/if}

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

	/* Curved mode: the cards sit on one baseline and turn about a shared pivot below it. */
	.curved-host {
		padding: 1.75rem 0.5rem 2.5rem;
	}

	.curved-box {
		position: relative;
		margin: 0 auto;
	}

	.fan.curved {
		position: relative;
		display: block;
		margin: 0;
		transform-origin: 0 0;
	}

	.fan.curved > li {
		position: absolute;
		left: 50%;
		bottom: var(--drop);
		margin: 0;
		width: max-content;
		transform-origin: 50% calc(100% + var(--R));
		transform: translateY(calc(var(--lift, 0px) * -1)) translateX(-50%) rotate(var(--a));
	}

	.fan.curved > li:hover,
	.fan.curved > li:focus-within {
		z-index: 20;
		animation: none;
		transform: translateY(calc(var(--lift, 0px) * -1)) translateX(-50%) rotate(var(--a)) translateY(-0.9rem) scale(1.04);
	}

	/* align="center": the card's own center is on the arc, and the pivot is below that center. */
	.fan.curved.center > li {
		top: var(--cy);
		bottom: auto;
		transform-origin: 50% calc(50% + var(--R));
		transform: translate(-50%, -50%) rotate(var(--a));
	}

	.fan.curved.center > li:hover,
	.fan.curved.center > li:focus-within {
		transform: translate(-50%, -50%) rotate(var(--a)) translateY(-0.9rem) scale(1.04);
	}

	.fan.curved.breathe > li {
		animation: breathe 5s ease-in-out infinite;
	}

	.fan.curved.center.breathe > li {
		animation-name: breathe-center;
	}

	@keyframes breathe-center {
		0%,
		100% {
			transform: translate(-50%, -50%) rotate(var(--a));
		}
		50% {
			transform: translate(-50%, -50%) rotate(calc(var(--a) * 1.16));
		}
	}

	@keyframes breathe {
		0%,
		100% {
			transform: translateY(calc(var(--lift, 0px) * -1)) translateX(-50%) rotate(var(--a));
		}
		50% {
			transform: translateY(calc(var(--lift, 0px) * -1)) translateX(-50%) rotate(calc(var(--a) * 1.16));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fan > li {
			transition: none;
		}

		.fan.curved.breathe > li {
			animation: none;
		}
	}
</style>
