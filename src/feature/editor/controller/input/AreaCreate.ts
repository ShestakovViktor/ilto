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

        const parent = this.editorContext.layer();
        if (!parent) throw new Error();

        const area = store.entity.add<Area>({
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
            .set<Parent>(parent.id, {childIds: [...parent.childIds, area.id]});

        const footnote = store.entity.add<Footnote>({
            entityTypeId: ENTITY_TYPE.FOOTNOTE,
            text: "",
            figureIds: [],
            parentId: area.id,
        });

        store.entity.set<Area>(area.id, {footnoteId: footnote.id});

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

            const selected = editorContext.selected();
            if (
                !selected
                || selected.entityTypeId != ENTITY_TYPE.AREA
            ) {
                editorContext.setSelected(this.initArea(x, y));
            }
            else {
                const area = selected as Area;

                const res = pushAreaPoint(area, click);

                this.storeContext.store.entity.set<Area>(area.id, res);
            }

            editorContext.setState({dockArea: {items: [UI_MODE.ENTITY_FORM]}});

            event.preventDefault();
        }
        else if (event.buttons == MOUSE.RIGHT) {
            editorContext.setSelected(undefined);
        }
    }

    onMouseMove(event: PointerEvent): void {
        event.stopPropagation();
    }
}