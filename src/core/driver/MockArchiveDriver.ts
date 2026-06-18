import type {ArchiverDriver} from "@src/core/interface";

export class MockArchiveDriver implements ArchiverDriver {
	async archive(data: Record<string, Blob>): Promise<Blob> {
		const result: Record<string, string> = {};

		for (const key in data) {
			const blob = data[key];
			result[key] = btoa(await blob.text());
		}

		const resultString = JSON.stringify(result, null, 4);

		return new Promise(resolve => resolve(new Blob([resultString])));
	}

	async extract(blob: Blob): Promise<Record<string, Blob>> {
		const result: Record<string, Blob> = {};

		const dataString = JSON.parse(await blob.text());

		for (const path in dataString) {
			const byteCharacters = atob(dataString[path]);
			const byteArrays = [];

			for (let i = 0; i < byteCharacters.length; i++) {
				byteArrays.push(byteCharacters.charCodeAt(i));
			}

			const byteArray = new Uint8Array(byteArrays);
			result[path] = new Blob([byteArray], {type: ""});
		}

		return new Promise(resolve => resolve(result));
	}
}