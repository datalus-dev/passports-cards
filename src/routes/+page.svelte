<script>
	import { CardFan } from '$lib';
	import { cards } from './samples.js';

	const FONTS = [
		{ id: 'mono', label: 'DM Mono (default)' },
		{ id: 'system', label: '--ps-font: system-ui' },
		{ id: 'host', label: 'font="inherit" (page font: Atkinson)' }
	];
	let fontMode = $state('mono');

	const fanFont = $derived(fontMode === 'host' ? 'inherit' : 'mono');

	const NAMES = {
		'travel-tag': 'Travel tag',
		'ticket-stub': 'Ticket stub',
		'state-stamp': 'State stamp',
		'boarding-pass': 'Boarding pass',
		beacon: 'Beacon',
		sello: 'Sello'
	};

	/**
	 * A grid cell shows one card alone, without its link and fan overlap.
	 * @param {import('$lib').FanCard} card
	 * @param {'full' | 'simplified'} variant
	 */
	const solo = (card, variant) => {
		const { href, label, overlap, ...rest } = card;
		return [{ ...rest, variant }];
	};
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=DM+Mono:wght@400;500&display=swap"
	/>
</svelte:head>

<main>
	<h1>passports-cards</h1>
	<p>
		Demo of <code>CardFan</code>. The fan geometry is computed from the list. Cards render the
		<code>simplified</code> variant by default; <code>variant="full"</code> is the real ps-app card.
	</p>

	<fieldset class="font-switch">
		<legend>Font (applies to every section below)</legend>
		{#each FONTS as f}
			<label><input type="radio" name="font" value={f.id} bind:group={fontMode} /> {f.label}</label>
		{/each}
	</fieldset>

	<div class="stage" class:host-font={fontMode === 'host'} style={fontMode === 'system' ? '--ps-font: system-ui, sans-serif' : ''}>
		<h2>Fan, simplified (default)</h2>
		<CardFan {cards} font={fanFont} label="Sample cards from each passport" />

		<h2>Fan, <code>variant="full"</code></h2>
		<CardFan {cards} font={fanFont} variant="full" />

		<h2>Full vs simplified, same data</h2>
		<p>One row per card type. Both columns get the same sample data, so any difference is the variant.</p>
		<div class="grid">
			<div class="head"></div>
			<div class="head">full</div>
			<div class="head">simplified</div>
			{#each cards as card, i (i)}
				<div class="rowname">{NAMES[card.type]}{card.title ? `: ${card.title}` : ''}</div>
				<div class="cell"><CardFan cards={solo(card, 'full')} font={fanFont} /></div>
				<div class="cell"><CardFan cards={solo(card, 'simplified')} font={fanFont} /></div>
			{/each}
		</div>

		<h2>Three cards (layout recomputes)</h2>
		<CardFan cards={[cards[0], cards[2], cards[5]]} font={fanFont} />

		<h2>Per-card override</h2>
		<p>Fan default is simplified; the first and last cards set <code>variant: 'full'</code> in their data.</p>
		<CardFan cards={cards.map((c, i) => (i === 0 || i === cards.length - 1 ? { ...c, variant: 'full' } : c))} font={fanFont} />
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #f1ede4;
		color: #2a2a2a;
		font-family: system-ui, sans-serif;
	}
	main {
		max-width: 62rem;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}
	.host-font {
		font-family: 'Atkinson Hyperlegible', sans-serif;
	}
	.font-switch {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		margin: 1rem 0;
		padding: 0.6rem 0.9rem;
		border: 1px solid #cfc8b8;
		border-radius: 0.5rem;
		font-size: 0.9rem;
	}
	.font-switch label {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		cursor: pointer;
	}
	.grid {
		display: grid;
		grid-template-columns: 8rem 1fr 1fr;
		align-items: center;
		gap: 0 1rem;
	}
	.head {
		font-weight: 700;
		padding: 0.25rem 0;
		border-bottom: 1px solid #cfc8b8;
	}
	.rowname {
		font-size: 0.8rem;
		opacity: 0.75;
	}
	.cell {
		display: flex;
		justify-content: center;
		min-width: 0;
	}
</style>
