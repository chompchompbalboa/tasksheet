declare global {
	const environment: IEnvironment
	interface IEnvironment {
    assetUrl: string
    s3Bucket: string
	}
}
export {} // Typescript needs this file to be a module
