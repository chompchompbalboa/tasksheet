//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { schema, normalize } from 'normalizr'

//-----------------------------------------------------------------------------
// Schema
//-----------------------------------------------------------------------------
const file = new schema.Entity('file')
const folder = new schema.Entity('folder')
folder.define({
	folders: [folder],
	files: [file],
})
const foldersList = [folder]

//-----------------------------------------------------------------------------
// Normalizer
//-----------------------------------------------------------------------------
const folderNormalizer = (folders: any) => normalize(folders, foldersList)
export default folderNormalizer
