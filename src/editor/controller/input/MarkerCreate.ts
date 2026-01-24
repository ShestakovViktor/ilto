import {ActionManager, InputMode} from "@src/editor/controller";
import {Session} from "@src/editor/type";
import {CreateMarkerAction} from "@src/entity/controller/action";
import {Database} from "@src/shared/controller";
import {ViewerState} from "@src/viewer/type";
import {SetStoreFunction} from "solid-js/store";

export class MarkerCreate extends InputMode {
    constructor(
        private viewer: ViewerState,
        private editor: Session,
        private setEditor: SetStoreFunction<Session>,
        private actionManager: ActionManager,
        private database: Database

    ) {
        super();
    }

    onMouseDown(event: MouseEvent): void {
        const rect = (event.currentTarget as HTMLDivElement)
            .getBoundingClientRect();

        const x = Math.floor((event.x - rect.x)
            / this.viewer.scale);
        const y = Math.floor((event.y - rect.y)
            / this.viewer.scale);

        const marker = this.actionManager.execute(
            new CreateMarkerAction(
                this.database,
                this.editor,
                this.setEditor,
                x,
                y
            )
        );

        this.setEditor({
            selected: marker,
        });

        // event.preventDefault();
    }

    onMouseMove(): void {}

    onMouseUp(): void {}
}