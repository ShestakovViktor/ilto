import {StoreContextType, useStoreContext} from "@feature/store/context";
import {EditorContexType, useEditorContext} from "@feature/editor/context";
import {ViewerContextType, useViewerContext} from "@feature/viewer/context";
import {getEntity} from "@feature/editor/utility";
import {MOUSE} from "@enum";
import {InputMode} from "./InputMode";
import {Entity, Spatial} from "@feature/entity/type";
import {ENTITY_TYPE} from "@feature/entity/enum";
import {MoveEntityAction} from "@feature/entity/action";

export class EntitySelect extends InputMode {
    private entityId: number | undefined;

    viewerCtx: ViewerContextType;

    editorCtx: EditorContexType;

    storeCtx: StoreContextType;

    start: {x: number; y: number} = {x: 0, y:0};

    end: {x: number; y: number} = {x: 0, y:0};

    offset: {x: number; y: number} = {x: 0, y:0};

    constructor() {
        super();
        this.viewerCtx = useViewerContext();
        this.editorCtx = useEditorContext();
        this.storeCtx = useStoreContext();
    }

    onMouseDown(event: MouseEvent): void {
        if (event.buttons != MOUSE.LEFT) return;

        const element = getEntity(event.target as HTMLElement);

        if (!element) return;

        const rect = element.getBoundingClientRect();

        this.offset.x = event.x - rect.x;
        this.offset.y = event.y - rect.y;

        this.entityId = Number(element.getAttribute("data-entity-id"));

        const entity = this.storeCtx.store.entity
            .getById<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.start = {
            x: entity.x,
            y: entity.y,
        };

        if ([
            ENTITY_TYPE.MARKER,
            ENTITY_TYPE.DECOR,
            ENTITY_TYPE.AREA,
        ].includes(entity.entityTypeId)) {
            event.stopPropagation();
        }

        this.editorCtx.setSelected(entity);

        this.editorCtx.setState({
            dockArea: {items: ["EntityForm"]},
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.entityId) return;
        const {state} = this.viewerCtx;

        this.end = {
            x: Math.floor(
                (event.x - this.offset.x - this.viewerCtx.state.x) / state.scale
            ),
            y: Math.floor(
                (event.y - this.offset.y - this.viewerCtx.state.y) / state.scale
            ),
        };

        this.storeCtx.store.entity
            .set<Entity & Spatial>(this.entityId, this.end);
    }

    onMouseUp(): void {
        if (this.entityId) {
            this.editorCtx.invoker.append(
                new MoveEntityAction(
                    this.storeCtx,
                    this.entityId,
                    this.end.x - this.start.x,
                    this.end.y - this.start.y
                )
            );
        }

        this.entityId = undefined;
    }
}