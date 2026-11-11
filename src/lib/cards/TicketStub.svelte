<script>
	import { fontFamily } from '../font.js';

	/**
	 * @type {{
	 *   color?: string,
	 *   art?: string,
	 *   title?: string,
	 *   venue?: string,
	 *   venueHref?: string | null,
	 *   genres?: string,
	 *   badge?: string,
	 *   date?: string,
	 *   imageUrl?: string | null,
	 *   showImage?: boolean,
	 *   punch?: boolean,
	 *   onToggleImage?: () => void,
	 *   onOpenImage?: () => void,
	 *   reserveTitle?: boolean,
	 *   showInfoLabel?: string,
	 *   showImageLabel?: string,
	 *   badgeSlot?: import('svelte').Snippet,
	 *   overlay?: import('svelte').Snippet,
	 *   controls?: import('svelte').Snippet,
	 *   strip?: import('svelte').Snippet,
	 *   font?: string,
	 *   variant?: 'full' | 'simplified'
	 * }}
	 *   `art` is the emoji shown when there is no image. `imageUrl` + `showImage` show the photo in
	 *   the art area; `onOpenImage` fires when it is clicked and `onToggleImage` flips between photo
	 *   and ticket (the toggle button stays, hidden, when there is no image so the footer height does
	 *   not change). `punch` draws the top punch hole (hosts turn it off while a control sits there).
	 *   `art` also marks the toggle while the photo shows. `reserveTitle` keeps two lines of height for
	 *   the title; `showInfoLabel`/`showImageLabel` are the toggle's accessible names. `badgeSlot`
	 *   replaces the badge (the host puts an editable category there) and `overlay` renders after the
	 *   bottom punch hole (a corner link). `controls` renders first inside the ticket (the host's select/delete button); `strip` renders
	 *   last inside it (the host's visibility row).
	 */
	let {
		color = 'oklch(40% 0.12 200)',
		art = '🎟',
		title = '',
		venue = '',
		venueHref = null,
		genres = '',
		badge = '',
		date = '',
		imageUrl = null,
		showImage = false,
		punch = true,
		onToggleImage,
		onOpenImage,
		reserveTitle = false,
		showInfoLabel = 'Show ticket info',
		showImageLabel = 'Show stub photo',
		badgeSlot,
		overlay,
		controls,
		strip,
		font = 'mono',
		variant = 'full'
	} = $props();

	const simple = $derived(variant === 'simplified');
	const canToggle = $derived(!!imageUrl);
</script>

<div class="ticket-wrap" style:font-family={fontFamily(font)}>
	<div class="ticket" style="--entry-color: {color}; --entry-ctl-top: 0.375rem">
		{#if punch}<div class="punch punch--top"></div>{/if}

		{#if !simple}{@render controls?.()}{/if}

		<div class="ticket-header"></div>

		<div class="ticket-art">
			{#if showImage && imageUrl}
				{#if simple}
					<img src={imageUrl} alt={title} loading="lazy" />
				{:else}
					<button class="art-btn" type="button" onclick={() => onOpenImage?.()} aria-label="View {title}">
						<img src={imageUrl} alt={title} loading="lazy" />
					</button>
				{/if}
			{:else}
				<div class="ticket-placeholder">
					<span class="placeholder-emoji">{art}</span>
				</div>
			{/if}
		</div>

		<div class="ticket-divider">
			<div class="notch notch--left"></div>
			<div class="tear-line"></div>
			<div class="notch notch--right"></div>
		</div>

		<div class="ticket-info">
			<p class="ticket-title" class:ticket-title--two={reserveTitle}>{title}</p>
			{#if venue}<p class="ticket-venue">{#if venueHref}<a href={venueHref}>{venue}</a>{:else}{venue}{/if}</p>{/if}
			{#if genres}<p class="ticket-genres">{genres}</p>{/if}
			<div class="ticket-foot">
				<div class="ticket-foot-left">
					{#if badgeSlot}{@render badgeSlot()}{:else if badge}<span class="category-badge">{badge}</span>{/if}
					{#if date}<span class="ticket-date">{date}</span>{/if}
				</div>
				{#if !simple}<button
					class="toggle-btn"
					class:invisible={!canToggle}
					type="button"
					onclick={() => {
						if (canToggle) onToggleImage?.();
					}}
					aria-label={showImage ? showInfoLabel : showImageLabel}
					>{showImage ? art : '🖼'}</button
				>{/if}
			</div>
		</div>

		<div class="punch punch--bottom"></div>

		{@render overlay?.()}

		{#if !simple}{@render strip?.()}{/if}
	</div>
</div>

<style>
	.ticket-wrap {
		color-scheme: light;
		filter: drop-shadow(0 0 0.75px oklch(68% 0.01 85)) drop-shadow(0 4px 10px oklch(0% 0 0 / 0.18))
			drop-shadow(0 12px 28px oklch(0% 0 0 / 0.13));
		width: 9.5rem;
		justify-self: center;
	}

	.ticket {
		position: relative;
		width: 100%;
		background: oklch(97% 0.01 85);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.punch {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		background: oklch(15% 0.02 260);
		z-index: 2;
	}

	.punch--top {
		top: -0.375rem;
	}
	.punch--bottom {
		bottom: -0.375rem;
	}

	.ticket-header {
		height: 2rem;
		background: var(--entry-color);
	}

	.ticket-art {
		width: 100%;
		height: 8rem;
		overflow: hidden;
		background: oklch(93% 0.01 85);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.art-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: block;
		width: 100%;
		height: 100%;
	}

	.art-btn:hover img {
		opacity: 0.9;
	}

	.ticket-art img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
		transition: opacity 0.15s;
	}

	.ticket-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder-emoji {
		font-size: 3rem;
		line-height: 1;
		opacity: 0.2;
	}

	.ticket-divider {
		position: relative;
		height: 1rem;
		display: flex;
		align-items: center;
	}

	.notch {
		position: absolute;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: oklch(15% 0.02 260);
		z-index: 2;
	}

	.notch--left {
		left: -0.5rem;
	}
	.notch--right {
		right: -0.5rem;
	}

	.tear-line {
		position: absolute;
		left: 0.5rem;
		right: 0.5rem;
		border-top: 1.5px dashed oklch(82% 0.01 85);
	}

	.ticket-info {
		padding: 0 0.75rem 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.ticket-title {
		font-size: 0.78rem;
		font-weight: 700;
		color: oklch(18% 0.01 85);
		line-height: 1.2;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		margin: 0;
	}

	.ticket-title--two {
		min-height: calc(0.78rem * 1.2 * 2);
	}

	.ticket-venue {
		font-size: 0.56rem;
		color: oklch(50% 0.01 85);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}

	.ticket-venue a {
		color: inherit;
		text-decoration: underline;
	}

	.ticket-genres {
		font-size: 0.54rem;
		color: oklch(55% 0.01 85);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
		font-style: italic;
	}

	.ticket-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.25rem;
		margin-top: 0.15rem;
	}

	.ticket-foot-left {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.category-badge {
		font-size: 0.42rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--entry-color);
		border: 1px solid oklch(from var(--entry-color) l c h / 0.35);
		background: oklch(from var(--entry-color) l c h / 0.08);
		padding: 0.1rem 0.3rem;
		border-radius: 0.2rem;
		white-space: nowrap;
		max-width: 6rem;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
	}

	.ticket-date {
		font-size: 0.46rem;
		color: oklch(55% 0.01 85);
		font-variant-numeric: tabular-nums;
	}

	.toggle-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: 0.85rem;
		line-height: 1;
		flex-shrink: 0;
		opacity: 0.6;
		transition: opacity 0.1s;
		align-self: center;
	}

	.toggle-btn:hover {
		opacity: 1;
	}
	.invisible {
		visibility: hidden;
	}
</style>
