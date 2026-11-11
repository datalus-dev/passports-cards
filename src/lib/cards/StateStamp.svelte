<script>
	import { fontFamily, codeFamily } from '../font.js';

	/**
	 * @type {{
	 *   code?: string,
	 *   city?: string,
	 *   date?: string,
	 *   path?: string,
	 *   fill?: string,
	 *   editMode?: boolean,
	 *   selectionMode?: boolean,
	 *   withStrip?: boolean,
	 *   onclick?: (e: MouseEvent) => void,
	 *   onkeydown?: (e: KeyboardEvent) => void,
	 *   controls?: import('svelte').Snippet,
	 *   strip?: import('svelte').Snippet,
	 *   font?: string,
	 *   variant?: 'full' | 'simplified'
	 * }}
	 *   `path` is the state outline (an SVG path in a 144 x 144 box; see `STATE_PATHS`). `editMode`
	 *   and `selectionMode` draw the dashed outline and move the code to the left corner so a host
	 *   control can take the right one. `withStrip` makes the card taller to fit the host's
	 *   visibility row. `controls` and `strip` render at the end of the card.
	 */
	let {
		code = '',
		city = '',
		date = '',
		path = '',
		fill = 'var(--color-stamp, #c4882a)',
		editMode = false,
		selectionMode = false,
		withStrip = false,
		onclick,
		onkeydown,
		controls,
		strip,
		font = 'mono',
		variant = 'full'
	} = $props();

	const simple = $derived(variant === 'simplified');
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article
	class="stamp-card"
	class:edit-mode={editMode && !simple}
	class:selection-mode={selectionMode && !simple}
	class:with-strip={withStrip && !simple}
	style:font-family={fontFamily(font)}
	onclick={simple ? undefined : onclick}
	onkeydown={simple ? undefined : onkeydown}
>
	<div class="state-svg-wrap">
		<svg class="state-svg" viewBox="0 0 144 144" aria-hidden="true">
			{#if path}
				<path d={path} {fill} stroke="white" stroke-width="1.5" stroke-linejoin="round" />
			{/if}
		</svg>
	</div>

	{#if city || date}
		<div class="stamp-footer">
			{#if city}<span class="stamp-city">{city}</span>{/if}
			{#if date}<span class="stamp-date">{date}</span>{/if}
		</div>
	{/if}

	<div class="stamp-code" class:edit={editMode && !simple} style:font-family={codeFamily(font)}>{code}</div>

	{#if !simple}
		{@render controls?.()}
		{@render strip?.()}
	{/if}
</article>

<style>
	.stamp-card.edit-mode,
	.stamp-card.selection-mode {
		cursor: pointer;
		outline: 2px dashed oklch(60% 0 0 / 0.4);
	}

	.stamp-card {
		position: relative;
		width: 9rem;
		height: 9rem;
		border-radius: 0.75rem;
		background: oklch(94% 0 0);
		color-scheme: light;
		overflow: hidden;
		border: 1px solid oklch(88% 0 0);
		box-shadow:
			0 1px 2px oklch(0% 0 0 / 0.08),
			0 4px 12px oklch(0% 0 0 / 0.1);
		display: flex;
		flex-direction: column;
	}

	.stamp-card.with-strip {
		height: calc(9rem + 1.7rem);
	}

	.state-svg-wrap {
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.state-svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	.stamp-footer {
		flex-shrink: 0;
		padding: 0.2rem 0.5rem 0.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
		border-top: 1px solid oklch(88% 0 0);
	}

	.stamp-city {
		font-size: 0.7rem;
		font-weight: 700;
		color: oklch(20% 0 0);
		max-width: 7.5rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.stamp-date {
		font-size: 0.6rem;
		color: oklch(40% 0 0);
	}

	.stamp-code {
		position: absolute;
		top: 0.4rem;
		right: 0.5rem;
		left: auto;
		font-size: 0.6rem;
		font-weight: 700;
		color: oklch(50% 0 0);
		opacity: 0.7;
		transition: right 0.2s ease, left 0.2s ease, opacity 0.2s ease;
	}

	.stamp-code.edit {
		right: auto;
		left: 0.5rem;
	}
</style>
