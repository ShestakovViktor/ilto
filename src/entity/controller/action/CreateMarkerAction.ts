import {EntityKind} from "@src/entity/enum";
import {Footnote} from "@src/entity/type";
import {Layer} from "@src/entity/type";
import {Parent, Marker} from "@src/entity/type";
import {Action} from "@src/editor/controller";
import {Session} from "@src/editor/type";
import {Database} from "@src/shared/controller";
import {SetStoreFunction} from "solid-js/store";

export class CreateMarkerAction extends Action<Marker> {
    private parentId?: number;

    private markerId?: number;

    private footnoteId?: number;

    constructor(
        private database: Database,
        private editor: Session,
        private setEditor: SetStoreFunction<Session>,
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

    submit(): Marker {
        const parent = this.editor.layer;

        if (!parent) throw new Error();

        const footnote = this.database.data.entity.create<Footnote>({
            kind: EntityKind.Footnote,
            text: "",
        });

        const marker = this.database.data.entity.create<Marker>({
            kind: EntityKind.Marker,
            x: this.x,
            y: this.y,
            width: 64,
            height: 64,
            propId: null,
            childIds: [footnote.id],
        });

        this.database.data.entity.update<Layer>(
            parent.id,
            {childIds: [...parent.childIds, marker.id]}
        );

        this.parentId = parent.id;
        this.markerId = marker.id;
        this.footnoteId = footnote.id;

        return marker;
    }

    revert(): void {
        this.setEditor({selected: undefined});

        if (this.parentId && this.markerId) {
            const parent = this.database.data.entity
                .select<Parent>(this.parentId);
            if (!parent) throw new Error();

            this.database.data.entity.update<Parent>(this.parentId, {
                childIds: parent.childIds
                    .filter(childId => childId != this.markerId),
            });
        }

        if (this.footnoteId) {
            this.database.data.entity.delete(this.footnoteId);
        }

        if (this.markerId) {
            this.database.data.entity.delete(this.markerId);
        }
    }
}