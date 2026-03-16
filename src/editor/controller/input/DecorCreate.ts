import {EntityKind} from "@src/entity/enum";
import {ActionManager, InputHandler} from "@src/editor/controller";
import {Layer, Decor} from "@src/entity/type";
import {Session} from "@src/editor/type";
import {ViewerState} from "@src/viewer/type";
import {SetStoreFunction} from "solid-js/store";
import {Database} from "@src/shared/controller";

export class DecorCreate extends InputHandler {

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
        const x = Math.floor(event.x /*- this.viewer.x*/ / this.viewer.scale);
        const y = Math.floor(event.y /*- this.viewer.y*/ / this.viewer.scale);

        const decor = this.initEntity(x, y);

        this.setEditor({
            selected: decor,
        });

        event.preventDefault();
    }

    initEntity(x: number, y: number): Decor {
        const parent = this.editor.layer;

        if (!parent) throw new Error();

        const decor = this.database.data.entity.create<Decor>({
            kind: EntityKind.Decor,
            x,
            y,
            width: 64,
            height: 64,
            propId: null,
            motionId: null,
        });

        this.database.data.entity.update<Layer>(
            parent.id,
            {childIds: [...parent.childIds, decor.id]}
        );

        return decor;
    }

    onMouseUp(): void {}

    onMouseMove(): void {}
}