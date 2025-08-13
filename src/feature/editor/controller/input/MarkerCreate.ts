import {InputMode} from "@feature/editor/controller";
import {useViewerContext} from "@feature/viewer/context";
import {useEditorContext} from "@feature/editor/context";
import {useStoreContext} from "@feature/store/context";
import {UI_MODE} from "@feature/editor/enum";
import {CreateMarkerAction} from "@feature/marker/controller/action";
import {StoreContext} from "@feature/store/type";
import {EditorContext} from "@feature/editor/type";
import {ViewerContext} from "@feature/viewer/type";

export class MarkerCreate extends InputMode {
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
        const x = Math.floor((event.x - this.viewerContext.state.x)
            / this.viewerContext.state.scale);
        const y = Math.floor((event.y - this.viewerContext.state.y)
            / this.viewerContext.state.scale);

        const marker = this.editorContext.action.execute(
            new CreateMarkerAction(this.storeContext, this.editorContext, x, y)
        );

        this.editorContext.setState({
            selected: marker,
            dockArea: {items: [UI_MODE.ENTITY_FORM]},
        });

        event.preventDefault();
    }

    onMouseMove(): void {}

    onMouseUp(): void {}
}