declare global {
	const simplesheet: ISimplesheet
	interface ISimplesheet {
    assetUrl: string
	}
}
export {} // Typescript needs this file to be a module
