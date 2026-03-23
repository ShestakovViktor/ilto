import {EntityKind} from "@src/entity/enum";
import {Entity, Image} from "@src/entity/type";
import {Layer} from "@src/entity/type";
import {Parent} from "@src/entity/type";
import {Action} from "@src/editor/controller";
import {Session} from "@src/editor/type";
import {Storage} from "@src/storage/controller";
import {SetStoreFunction} from "solid-js/store";

export class ImageCreateAction extends Action<Image> {
    private parentId?: number;

    private imageId?: number;

    constructor(
        private storage: Storage,
        private session: Session,
        private setEditor: SetStoreFunction<Session>,
        private x: number,
        private y: number
    ) {
        super();
    }

    getLogMessage(): string {
        return "create image";
    }

    getLogData(): {[key: string]: unknown} {
        return {
            imageId: this.imageId,
            x: this.x,
            y: this.y,
            parentId: this.parentId,
        };
    }

    submit(): Image {
        const parent = this.session.layer;

        if (!parent) throw new Error();

        const image = this.storage.data.entity.create<Image>({
            kind: EntityKind.Image,
            x: this.x,
            y: this.y,
            width: 64,
            height: 64,
            prop: [],
            assetId: null,
        });

        this.storage.data.entity.update<Layer>(
            parent.id,
            {childIds: [...parent.childIds, image.id]}
        );

        this.parentId = parent.id;
        this.imageId = image.id;

        return image;
    }

    revert(): void {
        this.setEditor({selected: undefined});

        if (this.parentId && this.imageId) {
            const parent = this.storage.data.entity
                .select<Entity & Parent>(this.parentId);
            if (!parent) throw new Error();

            this.storage.data.entity.update<Entity & Parent>(this.parentId, {
                childIds: parent.childIds
                    .filter(childId => childId != this.imageId),
            });
        }

        if (this.imageId) {
            this.storage.data.entity.delete(this.imageId);
        }
    }
}