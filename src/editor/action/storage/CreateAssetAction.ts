import {AssetKind} from "@src/core/enum";
import {Asset, Graphics} from "@src/core/type";
import {Action} from "@src/editor/action";
import {Storage} from "@src/storage/controller";

export class CreateAssetAction extends Action<Asset> {
    private assetId?: number;

    constructor(
        private storage: Storage,
        private props: {
            size: number;
            mime: string;
            path: string;
            name: string;
            meta: {footnote: string};
        }
    ) {
        super();
    }

    getLogMessage(): string {
        return "create image";
    }

    getLogData(): {[key: string]: unknown} {
        return {
            assetId: this.assetId,
            props: this.props,
        };
    }

    exec(): Graphics {
        const image = this.storage.data.asset.create<Graphics>({
            kind: AssetKind.Graphics,
            ...this.props,
        });

        this.assetId = image.id;

        return image;
    }

    undo(): void {
        if (this.assetId) {
            this.storage.data.asset.delete(this.assetId);
        }
    }
}