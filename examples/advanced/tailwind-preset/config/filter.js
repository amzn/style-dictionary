export function isColor(token) {
	return (token?.$type || token?.type) === 'color';
}
