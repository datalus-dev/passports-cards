<script>
	import { fontFamily } from '../font.js';
	import { beaconCategory } from '../data/beacon-categories.js';

	/**
	 * @type {{
	 *   venue?: string,
	 *   venueHref?: string | null,
	 *   category?: string | null,
	 *   rating?: number | null,
	 *   shout?: string | null,
	 *   date?: string | null,
	 *   link?: string | null,
	 *   linkLabel?: string,
	 *   tabler?: boolean,
	 *   width?: string,
	 *   controls?: import('svelte').Snippet,
	 *   strip?: import('svelte').Snippet,
	 *   font?: string,
	 *   variant?: 'full' | 'simplified'
	 * }}
	 *   `category` picks the accent color and icon (see `BEACON_CATEGORIES`). `tabler` draws the
	 *   Tabler icon font's glyph, which the host must load; without it a pin is drawn. `link` is
	 *   the corner link. `controls` renders first in the card (the host's select button) and
	 *   `strip` after the date (the host's inline visibility row).
	 */
	let {
		venue = '',
		venueHref = null,
		category = null,
		rating = null,
		shout = null,
		date = null,
		link = null,
		linkLabel = 'Open in Beacon Bits',
		tabler = false,
		width,
		controls,
		strip,
		font = 'mono',
		variant = 'full'
	} = $props();

	const simple = $derived(variant === 'simplified');
	const cfg = $derived(beaconCategory(category));
</script>

<div class="beacon-card" style="--accent: {cfg.color}; position: relative;" style:width style:font-family={fontFamily(font)}>
	{#if !simple}{@render controls?.()}{/if}
	<div class="venue-header">
		{#if tabler}
			<i class="ti {cfg.icon} venue-icon" aria-hidden="true"></i>
		{:else}
			<svg class="venue-icon venue-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
				<circle cx="12" cy="10" r="2.5" />
			</svg>
		{/if}
		<span class="venue-name">{#if venueHref}<a href={venueHref}>{venue}</a>{:else}{venue}{/if}</span>
	</div>
	{#if !simple}
		<div class="venue-meta">
			<span class="venue-category">{category ?? ''}</span>
		</div>
		<div class="rating" aria-label={rating ? `${rating} out of 5` : 'no rating'}>
			{#each Array.from({ length: 5 }) as _, i}
				<span class="dot" class:dot--filled={rating != null && i < rating}></span>
			{/each}
		</div>
	{/if}
	{#if shout}
		<p class="shout">{shout}</p>
	{/if}
	{#if date}
		<p class="date">{date}</p>
	{/if}
	{#if !simple}{@render strip?.()}{/if}
	{#if link && !simple}
		<a href={link} target="_blank" rel="noopener noreferrer" class="checkin-link" aria-label={linkLabel}>
			<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
		</a>
	{/if}
</div>

<style>
	.beacon-card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.75rem;
		border-radius: 0;
		color: var(--color-base-content, #2f3948);
		background: var(--color-base-100, #ffffff);
		border: 1px solid color-mix(in oklch, var(--color-base-content, #2f3948) 10%, transparent);
		border-left: 3px solid var(--accent);
		font-size: 0.8rem;
		min-width: 9rem;
	}

	.venue-header {
		display: flex;
		align-items: flex-start;
		gap: 0.3rem;
	}

	.venue-icon {
		flex-shrink: 0;
		font-size: 0.9rem;
		color: var(--accent);
		margin-top: 0.05rem;
	}

	.venue-pin {
		width: 0.9rem;
		height: 0.9rem;
	}

	.venue-name {
		font-weight: 600;
		line-height: 1.3;
		min-height: calc(1.3em * 2);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.venue-name a {
		color: inherit;
		text-decoration: underline;
	}

	.venue-meta {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		opacity: 0.6;
	}

	.venue-category {
		text-transform: capitalize;
		font-size: 0.72rem;
	}

	.rating {
		display: flex;
		align-items: center;
		gap: 0.2rem;
		height: 0.875rem;
	}

	.dot {
		display: inline-block;
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 50%;
		background: transparent;
	}

	.dot--filled {
		background: var(--accent);
	}

	.shout {
		font-style: italic;
		opacity: 0.75;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0;
	}

	.date {
		opacity: 0.5;
		font-size: 0.72rem;
		margin: auto 0 0;
	}

	.checkin-link {
		position: absolute;
		bottom: 0.4rem;
		right: 0.4rem;
		opacity: 0.35;
		color: inherit;
		line-height: 0;
	}

	.checkin-link:hover {
		opacity: 0.8;
	}
</style>
