import {ENTITY_TYPE} from "@feature/entity/enum";
import {Footnote} from "@feature/footnote/type";
import {Layer} from "@feature/layer/type";
import {Marker} from "@feature/marker/type";
import {Action} from "@feature/editor/controller";
import {StoreContext} from "@feature/store/type";
import {EditorContext} from "@feature/editor/type";
import {Parent} from "@feature/entity/type";

export class CreateMarkerAction extends Action<Marker> {
    private parentId?: number;

    private markerId?: number;

    private footnoteId?: number;

    constructor(
        private storeContext: StoreContext,
        private editorContext: EditorContext,
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
        const storeContext = this.storeContext;

        const parent = this.editorContext.state.layer;

        if (!parent) throw new Error();

        const footnote = storeContext.store.entity.create<Footnote>({
            entityTypeId: ENTITY_TYPE.FOOTNOTE,
            text: "",
        });

        const marker = storeContext.store.entity.create<Marker>({
            entityTypeId: ENTITY_TYPE.MARKER,
            x: this.x,
            y: this.y,
            width: 64,
            height: 64,
            propId: null,
            childIds: [footnote.id],
        });

        storeContext.store.entity.update<Layer>(
            parent.id,
            {childIds: [...parent.childIds, marker.id]}
        );

        this.parentId = parent.id;
        this.markerId = marker.id;
        this.footnoteId = footnote.id;

        return marker;
    }

    revert(): void {
        this.editorContext.setState({selected: undefined});

        if (this.parentId && this.markerId) {
            const parent = this.storeContext.store.entity
                .select<Parent>(this.parentId);
            if (!parent) throw new Error();

            this.storeContext.store.entity.update<Parent>(this.parentId, {
                childIds: parent.childIds
                    .filter(childId => childId != this.markerId),
            });
        }

        if (this.footnoteId) {
            this.storeContext.store.entity.delete(this.footnoteId);
        }

        if (this.markerId) {
            this.storeContext.store.entity.delete(this.markerId);
        }
    }
}