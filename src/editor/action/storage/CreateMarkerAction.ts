import {EntityKind} from "@src/core/enum";
import {Entity, Footnote} from "@src/core/type";
import {Layer} from "@src/core/type";
import {Parent, Marker} from "@src/core/type";
import {Action} from "@src/editor/action";
import {Session} from "@src/editor/type";
import {Storage} from "@src/storage/controller";
import {SetStoreFunction} from "solid-js/store";

export class CreateMarkerAction extends Action<Marker> {
    private parentId?: number;

    private markerId?: number;

    private footnoteId?: number;

    constructor(
        private storage: Storage,
        private session: Session,
        private setSession: SetStoreFunction<Session>,
        private x: number,
        private y: number
    ) {
        super();
    }

    getLogMessage(): string {
        return "create marker";
    }

    getLogData(): {[key: string]: unknown} {
        return {
            markerId: this.markerId,
            x: this.x,
            y: this.y,
            parentId: this.parentId,
            footnoteId: this.footnoteId,
        };
    }

    exec(): Marker {
        const parent = this.session.layer;

        if (!parent) throw new Error();

        const footnote = this.storage.data.entity.create<Footnote>({
            kind: EntityKind.Footnote,
            text: "",
            prop: [],
        });

        const marker = this.storage.data.entity.create<Marker>({
            kind: EntityKind.Marker,
            x: this.x,
            y: this.y,
            w: 64,
            h: 64,
            prop: [],
            propId: null,
            childIds: [footnote.id],
        });

        this.storage.data.entity.update<Layer>(
            parent.id,
            {childIds: [...parent.childIds, marker.id]}
        );

        this.parentId = parent.id;
        this.markerId = marker.id;
        this.footnoteId = footnote.id;

        return marker;
    }

    undo(): void {
        this.setSession({selected: undefined});

        if (this.parentId && this.markerId) {
            const parent = this.storage.data.entity
                .select<Entity & Parent>(this.parentId);
            if (!parent) throw new Error();

            this.storage.data.entity.update<Entity & Parent>(this.parentId, {
                childIds: parent.childIds
                    .filter(childId => childId != this.markerId),
            });
        }

        if (this.footnoteId) {
            this.storage.data.entity.delete(this.footnoteId);
        }

        if (this.markerId) {
            this.storage.data.entity.delete(this.markerId);
        }
    }
}