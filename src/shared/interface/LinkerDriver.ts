import type {Schema} from "@src/storage/type";

export interface LinkerDriver {
	loadBlobs(files: Record<string, Blob>): Promise<Schema>;

	unloadBlobs(data: Schema): Promise<Record<string, Blob>>;
}