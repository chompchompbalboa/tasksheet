declare global {
	const environment: IEnvironment
	interface IEnvironment {
    assetUrl: string
	}
}
export {} // Typescript needs this file to be a module
