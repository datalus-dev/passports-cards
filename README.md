# passports-cards

Entry cards for [passports.social](https://passports.social): the travel tag, boarding pass, ticket stub, state stamp, Beacon and sello, as Svelte 5 components. One source of truth for how a passport entry looks, used by the passports.social app and by sites that show a sample of it.

Also exports `CardFan`, a data-driven row of overlapping cards.

## Install

There is no npm release yet. Pin a commit:

```sh
npm install github:datalus-dev/passports-cards#<commit-sha>
```

Requires Svelte 5. Cards are plain components with no app dependencies.

## Use

```svelte
<script>
	import { TravelTag, CardFan } from 'passports-cards';
</script>

<TravelTag mode="Walking" city="Santiago de Compostela" code="SCQ" origin="OVD" date="15 Jul 2025" />

<CardFan
	cards={[
		{ type: 'travel-tag', mode: 'Walking', city: 'Santiago de Compostela', code: 'SCQ', origin: 'OVD', date: '15 Jul 2025' },
		{ type: 'state-stamp', code: 'US-HI', city: 'Honolulu', date: '26 Mar 2025' }
	]}
/>
```

Cards: `TravelTag`, `BoardingPass`, `TicketStub`, `StateStamp`, `BeaconCard`, `SelloCard`. `src/routes/samples.js` has example props for each.

### Options

- `variant`: `'full'` or `'simplified'`. `CardFan` defaults to `'simplified'`; a card in its `cards` array can override it.
- `font`: `'mono'` (DM Mono, the default) or `'inherit'` to use the page's font. Set `--ps-font` and `--ps-font-code` to change the stacks.
- `CardFan` cards: `type` picks the component (`travel-tag`, `ticket-stub`, `state-stamp`, `boarding-pass`, `beacon`, `sello`); `href`, `label` and `overlap` are fan options; every other key goes to the card as a prop.

Also exported: `STATE_PATHS`, `ROUTE_COLORS`, `SELLO_SWATCHES`, `BEACON_CATEGORIES` and the font helpers.

## Develop

```sh
npm install
npm run dev     # demo page: every card, full vs simplified, font switch
npm run check
npm run build   # svelte-package into dist/
```

## Contributing

Changes here change every site that pins a newer commit, so keep a card's look stable unless the change is the point. Cards must not import from any app. Community passports bring their own cards through [passports-plugins](https://github.com/datalus-dev/passports-plugins), not this repo.

## Where it lives

- GitHub: https://github.com/datalus-dev/passports-cards
- Tangled: https://tangled.org/passports.social/passports-cards

## License

MIT.
