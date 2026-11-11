export const MONO_STACK = "var(--ps-font, 'DM Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace)";

export const CODE_STACK = "var(--ps-font-code, ui-monospace, 'SF Mono', 'Fira Code', monospace)";

/**
 * font-family for a card's code labels (airport and state codes, carrier codes). "mono" keeps the
 * system monospace look and can be overridden with --ps-font-code; "inherit" uses the host page's font.
 * @param {string} [font] 'mono' | 'inherit'
 */
export function codeFamily(font = 'mono') {
	return font === 'inherit' ? 'inherit' : CODE_STACK;
}

/**
 * font-family for a card root. "mono" (default) is the passports.social look and
 * can be overridden with --ps-font; "inherit" uses the host page's font.
 * @param {string} [font] 'mono' | 'inherit'
 */
export function fontFamily(font = 'mono') {
	return font === 'inherit' ? 'inherit' : MONO_STACK;
}
