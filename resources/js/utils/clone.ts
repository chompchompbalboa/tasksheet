const clone = (itemToClone: any): any => {
	return JSON.parse(JSON.stringify(itemToClone))
}

export default clone
