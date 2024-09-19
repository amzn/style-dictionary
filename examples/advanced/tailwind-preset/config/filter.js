export const isColor = (token) => {
	return (token?.$type || token?.type) === 'color';
};
