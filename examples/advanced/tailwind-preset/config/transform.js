export function rgbChannels(token) {
	const value = token?.$value || token?.value;
	const { r, g, b, a } = parseRGBA(value);
	const hasAlpha = a !== undefined;
	return `${r} ${g} ${b}${hasAlpha ? ' / ' + a : ''}`;
}

function parseRGBA(value) {
	const regex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+%?))?\s*\)/;
	const matches = value.match(regex);
	if (!matches) {
		throw new Error(`Value '${value}' is not a valid rgb or rgba format.`);
	}
	const [, r, g, b, a] = matches;
	return {
		r,
		g,
		b,
		a: a !== undefined ? (a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a)) : undefined,
	};
}
