<script>
	import { fontFamily, codeFamily } from '../font.js';

	/**
	 * @type {{
	 *   mode?: string,
	 *   icon?: string,
	 *   city?: string,
	 *   code?: string,
	 *   origin?: string,
	 *   date?: string,
	 *   stack?: number,
	 *   clickable?: boolean,
	 *   reserveControl?: boolean,
	 *   controls?: import('svelte').Snippet,
	 *   font?: string,
	 *   variant?: 'full' | 'simplified',
	 * }}
	 *   `stack` > 1 draws ghost cards and a "N legs" pill. `controls` renders inside the card's
	 *   positioned box (the host puts its edit/select button there); `reserveControl` keeps the
	 *   middle of the transport row free for it.
	 */
	let {
		mode = '',
		icon = '',
		city = '',
		code = '',
		origin = '',
		date = '',
		stack = 1,
		clickable = false,
		reserveControl = false,
		controls,
		font = 'mono',
		variant = 'full'
	} = $props();

	const simple = $derived(variant === 'simplified');
</script>

<div class="entry-stack" class:simplified={simple} style:font-family={fontFamily(font)}>
	{#if stack > 1 && !simple}
		<div class="tag-ghost ghost-2"></div>
		<div class="tag-ghost ghost-1"></div>
	{/if}
	<div class="tag-outer" class:clickable={clickable && !simple} style="--entry-ctl-top: 2.8rem">
		<article class="tag-card">
			<div class="tag-header">
				<div class="tag-eyelet">
					<div class="tag-hole"></div>
				</div>
			</div>

			<div class="tag-body">
				{#if reserveControl}
					<div class="tag-transport-row">
						<span class="transport-label">{mode}</span>
						<span class="control-slot"></span>
						<span class="transport-icon" style="justify-self: end">{icon}</span>
					</div>
				{:else}
					<div class="tag-transport-row">
						<span class="transport-label">{mode}</span>
						<span class="transport-icon">{icon}</span>
						<span class="transport-end"></span>
					</div>
				{/if}
				<div class="tag-destination">
					<span class="dest-city">{city}</span>
					<span class="dest-code" style:font-family={codeFamily(font)}>{code}</span>
				</div>

				<div class="tear-line"></div>

				<div class="tag-footer">
					<span class="origin-code" style:font-family={codeFamily(font)}>{origin}</span>
					<div class="tag-footer-right">
						<span class="tag-date">{date}</span>
						{#if stack > 1 && !simple}<span class="tag-legs">{stack} legs</span>{/if}
					</div>
				</div>
			</div>
		</article>
		{#if !simple}{@render controls?.()}{/if}
	</div>
</div>

<style>
	.tag-transport-row {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		width: 100%;
	}

	.transport-label {
		font-size: 0.5rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: oklch(50% 0.01 85);
		justify-self: start;
	}

	.transport-end {
		justify-self: end;
		display: flex;
		align-items: center;
	}

	.control-slot {
		width: 0.9rem;
		height: 0.9rem;
	}

	.entry-stack {
		position: relative;
		width: 9rem;
		justify-self: center;
	}

	/* Ghost cards — match the tag-card shape exactly */
	.tag-ghost {
		position: absolute;
		inset: 0;
		border-radius: 1.6rem 1.6rem 0.5rem 0.5rem;
		background: oklch(93% 0.01 85);
		border: 1px solid oklch(86% 0.01 85);
	}

	.ghost-1 {
		transform: translate(-5px, -5px);
		z-index: -1;
	}

	.ghost-2 {
		transform: translate(-10px, -10px);
		background: oklch(90% 0.01 85);
		z-index: -2;
	}

	/* drop-shadow follows the card's alpha shape */
	.tag-outer {
		color-scheme: light;
		filter:
			drop-shadow(0 0 0.75px oklch(68% 0.01 85))
			drop-shadow(0 4px 10px oklch(0% 0 0 / 0.18))
			drop-shadow(0 12px 28px oklch(0% 0 0 / 0.13));
		transition: filter 0.15s ease, transform 0.15s ease;
	}

	.tag-outer.clickable:hover {
		filter:
			drop-shadow(0 0 0.75px oklch(68% 0.01 85))
			drop-shadow(0 6px 16px oklch(0% 0 0 / 0.22))
			drop-shadow(0 18px 40px oklch(0% 0 0 / 0.16));
		transform: translateY(-3px) rotate(-1deg);
	}

	/* Single unified card — very rounded top, slightly rounded bottom */
	.tag-card {
		width: 100%;
		background: oklch(97% 0.01 85);
		border-radius: 1.6rem 1.6rem 0.5rem 0.5rem;
		overflow: hidden;
	}

	/* Colored header section containing the hole */
	.tag-header {
		background: var(--entry-color, var(--color-brand, oklch(40% 0.12 200)));
		padding: 0.55rem 0.75rem 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
	}

	/* Metal eyelet ring */
	.tag-eyelet {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: oklch(97% 0.01 85 / 0.2);
		border: 1.5px solid oklch(97% 0.01 85 / 0.55);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 1px 2px oklch(0% 0 0 / 0.3);
	}

	/* Punched hole */
	.tag-hole {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--color-brand-dark, oklch(30% 0.1 200));
		box-shadow: inset 0 1px 3px oklch(0% 0 0 / 0.55);
	}

	.transport-icon {
		font-size: 0.9rem;
		line-height: 1;
	}

	/* Cream content area */
	.tag-body {
		padding: 0.75rem 0.85rem 0.7rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tag-destination {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.dest-city {
		font-size: 1.05rem;
		font-weight: 700;
		color: oklch(20% 0.01 85);
		line-height: 1.15;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.dest-code {
		font-size: 0.6rem;
		font-weight: 700;
		color: oklch(55% 0.01 85);
		letter-spacing: 0.06em;
	}

	.tear-line {
		border-top: 1.5px dashed oklch(88% 0.01 85);
		margin: 0 -0.85rem;
	}

	.tag-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.tag-footer-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.15rem;
	}

	.origin-code {
		font-size: 0.75rem;
		font-weight: 700;
		color: oklch(35% 0.01 85);
		letter-spacing: 0.02em;
	}

	.tag-date {
		font-size: 0.5rem;
		color: oklch(55% 0.01 85);
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.tag-legs {
		font-size: 0.5rem;
		color: oklch(50% 0.01 85);
		background: oklch(91% 0.01 85);
		padding: 0.1rem 0.35rem;
		border-radius: 99px;
	}
</style>
