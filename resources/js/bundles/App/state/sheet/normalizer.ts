//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { schema, normalize } from 'normalizr'

import { NestedSheet } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Schema
//-----------------------------------------------------------------------------
const sheet = new schema.Entity('sheet')
const column = new schema.Entity('columns')
const row = new schema.Entity('rows')
const cell = new schema.Entity('cells')

cell.define({
	row: row,
	column: column,
})

column.define({
	cells: [cell],
})

row.define({
	cells: [cell],
})

sheet.define({
	rows: [row],
	columns: [column],
})

//-----------------------------------------------------------------------------
// Normalizer
//-----------------------------------------------------------------------------
const sheetNormalizer = (nestedSheet: NestedSheet) => normalize(nestedSheet, sheet)
export default sheetNormalizer
