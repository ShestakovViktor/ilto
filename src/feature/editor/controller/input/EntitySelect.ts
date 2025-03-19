import {useStoreContext} from "@feature/store/context";
import {useEditorContext} from "@feature/editor/context";
import {useViewerContext} from "@feature/viewer/context";
import {getEntity} from "@feature/editor/service";
import {MOUSE} from "@enum";
import {InputMode} from "@feature/editor/controller";
import {Entity, Spatial} from "@feature/entity/type";
import {ENTITY_TYPE} from "@feature/entity/enum";
import {MoveEntityAction} from "@feature/entity/controller/action";
import {EditorContext} from "@feature/editor/type";
import {StoreContext} from "@feature/store/type";
import {ViewerContext} from "@feature/viewer/type";

export class EntitySelect extends InputMode {
    private entityId: number | undefined;

    viewerContext: ViewerContext;

    editorContext: EditorContext;

    storeContext: StoreContext;

    start: {x: number; y: number} = {x: 0, y:0};

    end: {x: number; y: number} = {x: 0, y:0};

    offset: {x: number; y: number} = {x: 0, y:0};

    constructor() {
        super();
        this.viewerContext = useViewerContext();
        this.editorContext = useEditorContext();
        this.storeContext = useStoreContext();
    }

    onMouseDown(event: MouseEvent): void {
        if (event.buttons != MOUSE.LEFT) return;

        const element = getEntity(event.target as HTMLElement);

        if (!element) return;

        const rect = element.getBoundingClientRect();

        this.offset.x = event.x - rect.x;
        this.offset.y = event.y - rect.y;

        this.entityId = Number(element.getAttribute("data-entity-id"));

        const entity = this.storeContext.store.entity
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

        this.editorContext.setSelected(entity);

        this.editorContext.setState({
            dockArea: {items: ["EntityForm"]},
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.entityId) return;
        const {state} = this.viewerContext;

        this.end = {
            x: Math.floor(
                (event.x - this.offset.x - this.viewerContext.state.x) / state.scale
            ),
            y: Math.floor(
                (event.y - this.offset.y - this.viewerContext.state.y) / state.scale
            ),
        };

        this.storeContext.store.entity
            .set<Entity & Spatial>(this.entityId, this.end);
    }

    onMouseUp(): void {
        if (this.entityId) {
            this.editorContext.invoker.append(
                new MoveEntityAction(
                    this.storeContext,
                    this.entityId,
                    this.end.x - this.start.x,
                    this.end.y - this.start.y
                )
            );
        }

        this.entityId = undefined;
    }
}