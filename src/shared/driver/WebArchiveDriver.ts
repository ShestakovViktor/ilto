import {ArchiveDriver} from "@src/shared/interface";

const LAYOUT = {
    name: {pos: 0, len: 100},
    mode: {pos: 100, len: 8},
    size: {pos: 124, len: 12},
    mtime: {pos: 136, len: 12},
    chksum: {pos: 148, len: 8},
};

type Data = Record<keyof typeof LAYOUT, string>;

export class WebArchiveDriver implements ArchiveDriver {
    async archive(blobs: {[key: string]: Blob}): Promise<Blob> {
        const tarBlockSize = 512;
        const tarParts: Uint8Array[] = [];

        for (const name in blobs) {
            const blob = blobs[name];

            const header = this.serializeHeader({
                name,
                mode: "0666",
                size: blob.size.toString(8),
                mtime: Date.now().toString(8),
                chksum: "",
            });

            const arrayBuffer = await blob.arrayBuffer();
            const fileContent = new Uint8Array(arrayBuffer);

            const padding = new Uint8Array(
                tarBlockSize - blob.size % tarBlockSize || tarBlockSize
            );

            tarParts.push(header);
            tarParts.push(fileContent);
            tarParts.push(padding);
        }

        tarParts.push(new Uint8Array(tarBlockSize * 2));

        const totalLength = tarParts
            .reduce((acc, part) => acc + part.length, 0);
        const tarArrayBuffer = new Uint8Array(totalLength);
        let offset = 0;

        tarParts.forEach(part => {
            tarArrayBuffer.set(part, offset);
            offset += part.length;
        });

        return new Blob([tarArrayBuffer], {type: "application/x-tar"});
    }

    async extract(blob: Blob): Promise<{[key: string]: Blob}> {
        let offset = 0;
        const res: {[key: string]: Blob} = {};

        while (offset < blob.size) {
            const headerSlice = blob.slice(offset, offset + 512);
            const headerBuffer = await headerSlice.arrayBuffer();
            const headerView = new Uint8Array(headerBuffer);
            const headerData = this.parseHeader(headerView);

            const fileSize = parseInt(headerData.size, 8);

            const dataBlocksSize = Math.ceil(fileSize / 512) * 512;

            res[headerData.name] = blob
                .slice(offset + 512, offset + 512 + fileSize);

            offset += 512 + dataBlocksSize;

        }
        return res;
    }

    private parseHeader(block: Uint8Array): Data {
        const decoder = new TextDecoder();

        const data = Object.entries(LAYOUT)
            .reduce((data, [key, {pos, len}]) => {
                const bytes = block.subarray(pos, pos + len);
                data[key as keyof Data] = decoder.decode(bytes)
                    .replace(/\0/g, "")
                    .trim();
                return data;
            }, {} as Data);

        this.checkSum(block, data);

        return data;
    }

    private serializeHeader(data: Data): Uint8Array {
        const encoder = new TextEncoder();

        const block = Object.entries(LAYOUT)
            .reduce((block, [key, {pos, len}]) => {
                const bytes = encoder.encode(data[key as keyof Data]);
                block.set(bytes.subarray(0, len), pos);
                return block;
            }, new Uint8Array(512));

        this.setCheckSum(block);

        return block;
    }

    private getCheckSum(block: Uint8Array): number {
        return block
            .reduce((acc, val, i) => acc + (i >= 148 && i < 156 ? 32 : val), 0);
    }

    private setCheckSum(block: Uint8Array) {
        const checkSum = this.getCheckSum(block)
            .toString(8)
            .padStart(6, "0");

        block.set(new TextEncoder().encode(checkSum), LAYOUT.chksum.pos);
    }

    private checkSum(block: Uint8Array, data: Data) {
        const calculatedSum = this.getCheckSum(block);
        const storedSum = parseInt(data.chksum, 8);

        return calculatedSum === storedSum;
    }
}