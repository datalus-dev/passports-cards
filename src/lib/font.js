export const MONO_STACK = "var(--ps-font, 'DM Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace)";

/**
 * font-family for a card root. "mono" (default) is the passports.social look and
 * can be overridden with --ps-font; "inherit" uses the host page's font.
 * @param {string} [font] 'mono' | 'inherit'
 */
export function fontFamily(font = 'mono') {
	return font === 'inherit' ? 'inherit' : MONO_STACK;
}
