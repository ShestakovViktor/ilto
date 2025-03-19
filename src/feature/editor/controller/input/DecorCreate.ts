import {useViewerContext} from "@feature/viewer/context";
import {useEditorContext} from "@feature/editor/context";
import {useStoreContext} from "@feature/store/context";
import {ENTITY_TYPE} from "@feature/entity/enum";
import {InputMode} from "@feature/editor/controller";
import {UI_MODE} from "@feature/editor/enum";
import {Layer} from "@feature/layer/type";
import {Decor} from "@feature/decor/type";
import {StoreContext} from "@feature/store/type";
import {ViewerContext} from "@feature/viewer/type";
import {EditorContext} from "@feature/editor/type";

export class DecorCreate extends InputMode {
    private storeContext: StoreContext;

    private viewerContext: ViewerContext;

    private editorContext: EditorContext;

    constructor() {
        super();
        this.storeContext = useStoreContext();
        this.viewerContext = useViewerContext();
        this.editorContext = useEditorContext();
    }

    onMouseDown(event: MouseEvent): void {
        const {state} = this.viewerContext;

        const x = Math.floor((event.x - state.x) / state.scale);
        const y = Math.floor((event.y - state.y) / state.scale);

        const decor = this.initEntity(x, y);

        this.editorContext.setSelected(decor);
        this.editorContext.setState({
            dockArea: {items: [UI_MODE.ENTITY_FORM]},
        });

        event.preventDefault();
    }

    initEntity(x: number, y: number): Decor {
        const {store} = this.storeContext;

        const parent = this.editorContext.layer();

        if (!parent) throw new Error();

        const decor = store.entity.add<Decor>({
            entityTypeId: ENTITY_TYPE.DECOR,
            x,
            y,
            width: 64,
            height: 64,
            propId: null,
            motionId: null,
            parentId: parent.id,
        });

        store.entity.set<Layer>(
            parent.id,
            {childIds: [...parent.childIds, decor.id]}
        );

        return decor;
    }
}