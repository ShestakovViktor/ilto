import {ENTITY_TYPE} from "@src/entity/enum";
import {Footnote} from "@src/entity/type";
import {Layer} from "@src/entity/type";
import {Parent, Marker} from "@src/entity/type";
import {Action} from "@src/editor/controller";
import {Type} from "@src/shared/type";
import {Session} from "@src/editor/type";
import {Database} from "@src/shared/controller";
import {SetStoreFunction} from "solid-js/store";

export class CreateMarkerAction extends Action<Marker> {
    private parentId?: number;

    private markerId?: number;

    private footnoteId?: number;

    private markerType: Type;

    private footnoteType: Type;

    constructor(
        private database: Database,
        private editor: Session,
        private setEditor: SetStoreFunction<Session>,
        private x: number,
        private y: number
    ) {
        super();

        const [markerType] = this.database.data.entityType
            .filter({name: ENTITY_TYPE.MARKER});

        const [footnoteType] = this.database.data.entityType
            .filter({name: ENTITY_TYPE.FOOTNOTE});

        if (!markerType || !footnoteType) throw new Error();

        this.markerType = markerType;

        this.footnoteType = footnoteType;
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
            entityTypeId: this.footnoteType.id,
            text: "",
        });

        const marker = this.database.data.entity.create<Marker>({
            entityTypeId: this.markerType.id,
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