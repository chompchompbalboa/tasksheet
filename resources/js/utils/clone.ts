import _ from 'lodash'

const clone = (itemToClone: any): any => {
	return _.cloneDeep(itemToClone)
}

export default clone
