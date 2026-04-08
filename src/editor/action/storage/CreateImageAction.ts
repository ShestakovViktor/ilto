import {EntityKind} from "@src/core/enum";
import {Image} from "@src/core/type";
import {Action} from "@src/editor/action";
import {Storage} from "@src/storage/controller";

export class CreateImageAction extends Action<Image> {
    private imageId?: number;

    constructor(
        private storage: Storage,
        private props: {
            x: number;
            y: number;
            width: number;
            height: number;
            assetId: number;
        }
    ) {
        super();
    }

    getLogMessage(): string {
        return "create image";
    }

    getLogData(): {[key: string]: unknown} {
        return {
            imageId: this.imageId,
            props: this.props,
        };
    }

    exec(): Image {
        const image = this.storage.data.entity.create<Image>({
            kind: EntityKind.Image,
            prop: [],
            ...this.props,
        });

        this.imageId = image.id;

        return image;
    }

    undo(): void {
        if (this.imageId) {
            this.storage.data.entity.delete(this.imageId);
        }
    }
}