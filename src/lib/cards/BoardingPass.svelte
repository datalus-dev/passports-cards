<script>
	import { fontFamily, codeFamily } from '../font.js';

	/**
	 * @type {{
	 *   kind?: string,
	 *   icon?: string,
	 *   from?: string,
	 *   from_city?: string,
	 *   to?: string,
	 *   to_city?: string,
	 *   date?: string,
	 *   carrier_code?: string,
	 *   stack?: number,
	 *   clickable?: boolean,
	 *   reserveControl?: boolean,
	 *   controls?: import('svelte').Snippet,
	 *   font?: string,
	 *   variant?: 'full' | 'simplified'
	 * }}
	 *   `stack` > 1 draws ghost cards and a "N legs" pill. `controls` renders inside the card's
	 *   positioned box (the host puts its edit/select button there); `reserveControl` moves the
	 *   transport icon next to the carrier name so the top-right corner is free for it.
	 */
	let {
		kind = '',
		icon = '✈︎',
		from = '',
		from_city = '',
		to = '',
		to_city = '',
		date = '',
		carrier_code = '',
		stack = 1,
		clickable = false,
		reserveControl = false,
		controls,
		font = 'mono',
		variant = 'full'
	} = $props();

	const simple = $derived(variant === 'simplified');
</script>

<div
	class="entry-stack"
	class:simplified={simple}
	style="--entry-ctl-top: 0.5rem; --entry-ctl-right: 0.7rem"
	style:font-family={fontFamily(font)}
>
	{#if stack > 1 && !simple}
		<div class="tag-ghost ghost-2"></div>
		<div class="tag-ghost ghost-1"></div>
	{/if}
	<article class="boarding-pass" class:clickable={clickable && !simple}>
		<div class="accent-bar"></div>

		<div class="pass-body">
			<div class="pass-header">
				<div class="carrier-left">
					<span class="carrier-name">{kind}</span>
					{#if reserveControl && !simple}<span class="edit-icon">{icon}</span>{/if}
				</div>
				{#if !reserveControl || simple}<span class="transport-icon">{icon}</span>{/if}
			</div>

			<div class="route">
				<div class="endpoint origin">
					<span class="code" style:font-family={codeFamily(font)}>{from}</span>
					<span class="city">{from_city}</span>
				</div>

				<div class="route-line">
					<span class="route-dot"></span>
					<span class="route-dash"></span>
					<span class="route-arrow">›</span>
				</div>

				<div class="endpoint destination">
					<span class="code" style:font-family={codeFamily(font)}>{to}</span>
					<span class="city">{to_city}</span>
				</div>
			</div>

			<div class="tear-line"></div>

			<div class="pass-footer">
				<span class="date">{date}</span>
				<div class="carrier-info">
					{#if carrier_code && !simple}
						<span class="carrier-code" style:font-family={codeFamily(font)}>{carrier_code}</span>
					{/if}
					{#if stack > 1 && !simple}
						<span class="leg-count">{stack} legs</span>
					{/if}
				</div>
			</div>
		</div>
	</article>
	{#if !simple}{@render controls?.()}{/if}
</div>

<style>
	.carrier-left {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.edit-icon {
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.entry-stack {
		position: relative;
	}

	.entry-stack.simplified .boarding-pass {
		width: 15rem;
	}

	.tag-ghost {
		position: absolute;
		inset: 0;
		border-radius: 10px;
		background: oklch(93% 0.01 85);
		box-shadow: 0 0 0 1px oklch(86% 0.01 85);
	}

	.ghost-1 {
		transform: translate(-5px, -5px);
		z-index: -1;
		opacity: 0.65;
	}

	.ghost-2 {
		transform: translate(-10px, -10px);
		background: oklch(90% 0.01 85);
		z-index: -2;
		opacity: 0.4;
	}

	.boarding-pass {
		position: relative;
		width: 18rem;
		background: oklch(97% 0.01 85);
		color-scheme: light;
		border: 1px solid oklch(85% 0.01 85);
		border-radius: 10px;
		overflow: hidden;
		box-shadow:
			0 1px 2px oklch(0% 0 0 / 0.15),
			0 4px 12px oklch(0% 0 0 / 0.18),
			0 12px 32px oklch(0% 0 0 / 0.12);
		transition: box-shadow 0.15s ease, transform 0.15s ease;
	}

	.boarding-pass.clickable:hover {
		box-shadow:
			0 2px 4px oklch(0% 0 0 / 0.18),
			0 8px 20px oklch(0% 0 0 / 0.22),
			0 20px 48px oklch(0% 0 0 / 0.16);
		transform: translateY(-2px);
	}

	.accent-bar {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: var(--entry-color, var(--color-primary, oklch(62.45% 0.278 3.836)));
	}

	/* 1rem left pad clears the 4px accent bar with breathing room */
	.pass-body {
		padding: 0.75rem 1rem 0.7rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.pass-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.carrier-name {
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: oklch(50% 0.01 85);
	}

	.transport-icon {
		font-size: 0.75rem;
		color: var(--color-brand, oklch(40% 0.12 200));
	}

	.route {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 0.65rem;
	}

	.endpoint {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		flex-shrink: 0;
	}

	.endpoint.destination {
		text-align: right;
	}

	.code {
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: oklch(20% 0.01 85);
		line-height: 1;
	}

	.city {
		font-size: 0.55rem;
		color: oklch(50% 0.01 85);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		max-width: 5.5rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Route line sits between the two codes, aligned to their vertical center.
	   The code is 1.6rem line-height:1, so its center is at 0.8rem from top. */
	.route-line {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 3px;
		color: oklch(70% 0.01 85);
		margin-top: 0.6rem;
	}

	.route-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		border: 1.5px solid oklch(70% 0.01 85);
		flex-shrink: 0;
	}

	.route-dash {
		flex: 1;
		height: 1px;
		background: oklch(80% 0.01 85);
	}

	.route-arrow {
		font-size: 1rem;
		color: oklch(60% 0.01 85);
		flex-shrink: 0;
		line-height: 1;
	}

	/* Tear line: full-bleed dashed separator.
	   Negative margins cancel the body padding on both sides. */
	.tear-line {
		border-top: 1.5px dashed oklch(91% 0.01 85);
		margin: 0 -1rem 0.6rem -1.25rem;
		padding-top: 0;
	}

	.pass-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.date {
		font-size: 0.6rem;
		color: oklch(50% 0.01 85);
		font-variant-numeric: tabular-nums;
	}

	.carrier-info {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.carrier-code {
		font-size: 0.65rem;
		font-weight: 700;
		color: oklch(45% 0.01 85);
		letter-spacing: 0.04em;
	}

	.leg-count {
		font-size: 0.55rem;
		color: oklch(55% 0.01 85);
		background: oklch(90% 0.01 85);
		padding: 0.1rem 0.35rem;
		border-radius: 99px;
	}
</style>
