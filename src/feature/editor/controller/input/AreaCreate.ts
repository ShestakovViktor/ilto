import {useViewerContext} from "@feature/viewer/context";
import {MOUSE} from "@enum";
import {pushAreaPoint} from "@feature/area/controller/pushAreaPoint";
import {useStoreContext} from "@feature/store/context";
import {useEditorContext} from "@feature/editor/context";
import {InputMode} from "@feature/editor/controller";
import {UI_MODE} from "@feature/editor/enum";
import {Area} from "@feature/area/type/Area";
import {Parent} from "@feature/entity/type";
import {Footnote} from "@feature/footnote/type/Footnote";
import {ENTITY_TYPE} from "@feature/entity/enum";
import {StoreContext} from "@feature/store/type";
import {ViewerContext} from "@feature/viewer/type";
import {EditorContext} from "@feature/editor/type";

export class AreaCreate extends InputMode {
    private storeContext: StoreContext;

    private viewerContext: ViewerContext;

    private editorContext: EditorContext;

    constructor() {
        super();
        this.storeContext = useStoreContext();
        this.viewerContext = useViewerContext();
        this.editorContext = useEditorContext();
    }

    initArea(x: number, y: number): Area {
        const {store} = this.storeContext;

        const parent = this.editorContext.state.layer;
        if (!parent) throw new Error();

        const area = store.entity.create<Area>({
            entityTypeId: ENTITY_TYPE.AREA,
            x,
            y,
            width: 0,
            height: 0,
            points: [{x: 0, y: 0}],
            parentId: parent.id,
            footnoteId: null,
        });

        store.entity
            .update<Parent>(parent.id, {childIds: [...parent.childIds, area.id]});

        const footnote = store.entity.create<Footnote>({
            entityTypeId: ENTITY_TYPE.FOOTNOTE,
            text: "",
            figureIds: [],
            parentId: area.id,
        });

        store.entity.update<Area>(area.id, {footnoteId: footnote.id});

        return area;
    }

    onMouseDown(event: MouseEvent): void {
        event.stopPropagation();

        const editorContext = this.editorContext;
        const {state} = this.viewerContext;

        const x = Math.floor((event.x - state.x) / state.scale);
        const y = Math.floor((event.y - state.y) / state.scale);
        const click = {x, y};

        if (event.buttons == MOUSE.LEFT) {

            const selected = editorContext.state.selected;
            if (
                !selected
                || selected.entityTypeId != ENTITY_TYPE.AREA
            ) {
                editorContext.setState({selected: this.initArea(x, y)});
            }
            else {
                const area = selected as Area;

                const res = pushAreaPoint(area, click);

                this.storeContext.store.entity.update<Area>(area.id, res);
            }

            editorContext.setState({dockArea: {items: [UI_MODE.ENTITY_FORM]}});

            event.preventDefault();
        }
        else if (event.buttons == MOUSE.RIGHT) {
            editorContext.setState({selected: undefined});
        }
    }

    onMouseMove(event: PointerEvent): void {
        event.stopPropagation();
    }
}