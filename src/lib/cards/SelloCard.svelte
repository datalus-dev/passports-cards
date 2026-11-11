<script>
	import { fontFamily } from '../font.js';
	import { ROUTE_COLORS, DEFAULT_ROUTE_COLOR, SELLO_SWATCHES } from '../data/camino-routes.js';

	/**
	 * @type {{
	 *   route?: string,
	 *   routeColor?: string,
	 *   origin?: string | null,
	 *   destination?: string | null,
	 *   leg?: string,
	 *   meta?: string,
	 *   note?: string | null,
	 *   date?: string,
	 *   crosses?: string,
	 *   crossesTitle?: string,
	 *   photos?: string[],
	 *   photoCount?: number,
	 *   more?: string,
	 *   revealed?: boolean,
	 *   interactive?: boolean,
	 *   onToggle?: () => void,
	 *   onPile?: () => void,
	 *   width?: string,
	 *   controls?: import('svelte').Snippet,
	 *   strip?: import('svelte').Snippet,
	 *   font?: string,
	 *   variant?: 'full' | 'simplified'
	 * }}
	 *   `route` picks the color unless `routeColor` is given. `origin` and `destination` draw the leg
	 *   (`leg` is plain text for hosts without them). The pile shows up to three stamps from `photos`
	 *   (or `photoCount`) and a "+N" for the rest; collapsed they are colored swatches, `revealed`
	 *   shows the photos. `interactive` makes the shell a toggle (`onToggle`); `onPile` fires when a
	 *   stamp is clicked. `controls` renders first inside the card, `strip` last.
	 */
	let {
		route = '',
		routeColor,
		origin = null,
		destination = null,
		leg = '',
		meta = '',
		note = null,
		date = '',
		crosses = '',
		crossesTitle = '',
		photos,
		photoCount,
		more,
		revealed = false,
		interactive = false,
		onToggle,
		onPile,
		width,
		controls,
		strip,
		font = 'mono',
		variant = 'full'
	} = $props();

	const simple = $derived(variant === 'simplified');

	const MAX_VISIBLE = 3;
	// Fixed rotations per slot so the pile looks casual but stable across renders.
	const ROTATIONS = [-11, 7, -4, 9];

	const color = $derived(routeColor ?? ROUTE_COLORS[route] ?? DEFAULT_ROUTE_COLOR);
	const total = $derived(
		photos?.length ?? photoCount ?? (more ? MAX_VISIBLE + (parseInt(more.replace(/\D/g, ''), 10) || 0) : 0)
	);
	const visible = $derived(Math.min(total, MAX_VISIBLE));
	const overflow = $derived(Math.max(0, total - MAX_VISIBLE));
</script>

<div class="sello-wrap" style:width style:font-family={fontFamily(font)}>
	<div class="sello" style="--route-color: {color}; --entry-ctl-top: 0.85rem; --entry-ctl-right: 0.9rem">
		{#if !simple}{@render controls?.()}{/if}
		<div class="sello-inner">
			<div class="sello-head">
				<span class="route-badge">{route}</span>
				{#if interactive && !simple}
					<button
						class="shell shell-toggle"
						class:is-open={revealed}
						type="button"
						aria-label={revealed ? 'Hide sello photos' : 'Show sello photos'}
						aria-pressed={revealed}
						onclick={(e) => {
							e.stopPropagation();
							onToggle?.();
						}}>🐚</button
					>
				{:else}
					<span class="shell">🐚</span>
				{/if}
			</div>

			<div class="sello-body">
				<p class="leg">
					{#if origin}<span class="town">{origin}</span>{/if}
					{#if origin && destination}<span class="arrow">→</span>{/if}
					{#if destination}<span class="town">{destination}</span>{/if}
					{#if !origin && !destination && leg}<span class="town">{leg}</span>{/if}
				</p>
				{#if meta}<p class="meta">{meta}</p>{/if}
				{#if note && !simple}<p class="note">{note}</p>{/if}
			</div>

			{#if total > 0}
				<div class="pile">
					{#each Array.from({ length: visible }) as _, i (i)}
						<button
							class="stamp"
							type="button"
							disabled={simple}
							style="--rot: {ROTATIONS[i] ?? 0}deg; --i: {i}; z-index: {i};{revealed ? '' : ` background: ${SELLO_SWATCHES[i % SELLO_SWATCHES.length]};`}"
							onclick={(e) => {
								e.stopPropagation();
								onPile?.();
							}}
							aria-label={revealed ? `View sello photo ${i + 1}` : 'Reveal sello photos'}
						>
							{#if revealed && photos?.[i]}<img src={photos[i]} alt="Sello {i + 1}" loading="lazy" />{/if}
						</button>
					{/each}
					{#if overflow > 0}
						<button
							class="stamp stamp-overflow"
							type="button"
							disabled={simple}
							style="--rot: {ROTATIONS[Math.min(visible, ROTATIONS.length - 1)]}deg; --i: {visible};"
							onclick={(e) => {
								e.stopPropagation();
								onPile?.();
							}}
							aria-label={revealed ? 'View all sello photos' : 'Reveal sello photos'}>+{overflow}</button
						>
					{/if}
				</div>
			{/if}

			<div class="sello-foot">
				<span class="date">{date}</span>
				{#if crosses}
					<span class="stamps" title={crossesTitle}>{crosses}</span>
				{/if}
			</div>
		</div>
		{#if !simple}{@render strip?.()}{/if}
	</div>
</div>

<style>
	.pile {
		position: relative;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stamp {
		position: absolute;
		width: 2.6rem;
		height: 2.6rem;
		border-radius: 0.25rem;
		overflow: hidden;
		padding: 0;
		border: 2px solid oklch(97% 0.01 85);
		background: oklch(93% 0.01 85);
		cursor: pointer;
		box-shadow: 0 1px 3px oklch(0% 0 0 / 0.22);
		/* fan out from center: each slot shifts ~1rem and tilts */
		transform: translateX(calc((var(--i) - 1) * 1.05rem)) rotate(var(--rot));
		transition: transform 0.12s;
	}

	.stamp:disabled {
		cursor: default;
		pointer-events: none;
	}

	.stamp:hover {
		transform: translateX(calc((var(--i) - 1) * 1.05rem)) rotate(var(--rot)) scale(1.08);
		z-index: 20 !important;
	}

	.stamp img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.stamp-overflow {
		display: flex;
		align-items: center;
		justify-content: center;
		background: oklch(20% 0.02 260 / 0.82);
		color: oklch(97% 0.01 85);
		font-size: 0.7rem;
		font-weight: 600;
	}

	.sello-wrap {
		color-scheme: light;
		filter:
			drop-shadow(0 0 0.75px oklch(68% 0.01 85))
			drop-shadow(0 3px 8px oklch(0% 0 0 / 0.15));
		width: 100%;
		max-width: 11rem;
		justify-self: center;
	}

	.sello {
		position: relative;
		width: 100%;
		background: oklch(97% 0.01 85);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.sello-inner {
		margin: 0.45rem;
		border: 1.5px dashed oklch(from var(--route-color) l c h / 0.55);
		border-radius: 0.35rem;
		padding: 0.5rem 0.55rem 0.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-height: 7.25rem;
	}

	.sello-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.3rem;
	}

	.route-badge {
		font-size: 0.46rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--route-color);
		border: 1px solid oklch(from var(--route-color) l c h / 0.35);
		background: oklch(from var(--route-color) l c h / 0.08);
		padding: 0.12rem 0.3rem;
		border-radius: 0.2rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.shell {
		font-size: 0.85rem;
		line-height: 1;
		opacity: 0.75;
		flex-shrink: 0;
	}

	.shell-toggle {
		border: none;
		background: none;
		padding: 0.05rem;
		margin: -0.05rem;
		cursor: pointer;
		border-radius: 0.25rem;
		outline: 1.5px solid oklch(from var(--route-color) l c h / 0.4);
		outline-offset: 1px;
		transition: opacity 0.1s, transform 0.1s;
	}

	.shell-toggle:hover {
		opacity: 1;
	}
	.shell-toggle.is-open {
		outline-color: var(--route-color);
		transform: scale(1.05);
	}

	.sello-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.leg {
		margin: 0;
		font-size: 0.74rem;
		font-weight: 700;
		line-height: 1.25;
		color: oklch(18% 0.01 85);
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem;
	}

	.arrow {
		color: var(--route-color);
		font-weight: 700;
	}

	.meta {
		margin: 0;
		font-size: 0.56rem;
		color: oklch(50% 0.01 85);
		text-transform: capitalize;
	}

	.note {
		margin: 0;
		font-size: 0.54rem;
		font-style: italic;
		color: oklch(55% 0.01 85);
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.sello-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.25rem;
	}

	.date {
		font-size: 0.5rem;
		color: oklch(55% 0.01 85);
		font-variant-numeric: tabular-nums;
	}

	.stamps {
		font-size: 0.56rem;
		color: var(--route-color);
		letter-spacing: 0.1em;
	}
</style>
