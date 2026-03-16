import {Schema} from "@src/shared/type";
import {Asset} from "@src/asset/type";
import {typeToExtension} from "@src/editor/service";

export class WebBlobDriver {
    async loadBlobs(files: {[key: string]: Blob}): Promise<Schema> {
        const dataString = await files["data.json"].text();
        const data = JSON.parse(dataString) as Schema;

        for (const id in data.asset) {
            const asset = data.asset[id];
            if (!asset.path) throw new Error("");
            asset.path = URL.createObjectURL(files[asset.path]);
        }

        return data;
    }

    async unloadBlobs(data: Schema): Promise<{[key: string]: Blob}> {
        return {
            ...await this.getAssetsBlobs(data.asset),
            ...this.getDataBlob(data),
        };
    }

    private async getAssetBlob (asset: Asset): Promise<[string, Blob]> {
        const response = await fetch(asset.path);
        const blob = await response.blob();
        const ext = typeToExtension(asset.mime);
        const path = `asset/${asset.id}.${ext}`;

        asset.path = path;

        return [path, blob];
    }

    private async getAssetsBlobs(
        assets: {[key: number]: Asset}
    ): Promise<{[key: string]: Blob}> {
        const promises: Promise<[string, Blob]>[] = [];

        for (const id in assets) {
            promises.push(this.getAssetBlob(assets[id]));
        }

        const blobs = Object.fromEntries(await Promise.all(promises));

        return blobs;
    }

    private getDataBlob(data: Schema): {[key: string]: Blob} {
        const dataString = JSON.stringify(data, null, 4);
        const dataType = "application/json;charset=utf-8";
        const dataBlob = new Blob([dataString], {type: dataType});
        return {["data.json"]: dataBlob};
    }
}