declare global {
	const tasksheet: ITasksheet
	interface ITasksheet {
    assetUrl: string
	}
}
export {} // Typescript needs this file to be a module
