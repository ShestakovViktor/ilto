export interface FetcherDriver {
	downloadFile(file: Blob, name: string): void;

	uploadFile(props: {type: string; accept: string}): Promise<File>;

	getRemoteBlob(path: string): Promise<Blob>;

	getLocalBlob(name: string): Promise<Blob>;

	putLocalBlob(name: string, file: Blob): Promise<void>;
}