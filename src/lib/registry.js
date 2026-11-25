import TravelTag from './cards/TravelTag.svelte';
import TicketStub from './cards/TicketStub.svelte';
import StateStamp from './cards/StateStamp.svelte';
import BoardingPass from './cards/BoardingPass.svelte';
import BeaconCard from './cards/BeaconCard.svelte';
import SelloCard from './cards/SelloCard.svelte';

/**
 * The card components by the `type` a FanCard (and a sample card) names.
 * @type {Record<string, import('svelte').Component<any>>}
 */
export const CARD_TYPES = {
	'travel-tag': TravelTag,
	'ticket-stub': TicketStub,
	'state-stamp': StateStamp,
	'boarding-pass': BoardingPass,
	beacon: BeaconCard,
	sello: SelloCard
};
