export interface ArchiverDriver {
	archive(blobs: Record<string, Blob>): Promise<Blob>;
	extract(blob: Blob): Promise<Record<string, Blob>>;
}