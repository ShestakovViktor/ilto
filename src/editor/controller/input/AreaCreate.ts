import {MOUSE} from "@src/utility/enum";
import {pushAreaPoint} from "@src/entity/controller/pushAreaPoint";
import {ActionManager, InputHandler} from "@src/editor/controller";
import {Area} from "@src/entity/type/Area";
import {Entity, Parent} from "@src/entity/type";
import {Footnote} from "@src/entity/type/Footnote";
import {EntityKind} from "@src/entity/enum";
import {Session} from "@src/editor/type";
import {ViewerState} from "@src/viewer/type";
import {SetStoreFunction} from "solid-js/store";
import {Storage} from "@src/storage/controller";

export class AreaCreate extends InputHandler {
    constructor(
        private viewer: ViewerState,
        private editor: Session,
        private setEditor: SetStoreFunction<Session>,
        private actionManager: ActionManager,
        private storage: Storage
    ) {
        super();
    }

    initArea(x: number, y: number): Area {
        const parent = this.editor.layer;
        if (!parent) throw new Error();

        const area = this.storage.data.entity.create<Area>({
            kind: EntityKind.Area,
            x,
            y,
            width: 0,
            height: 0,
            points: [{x: 0, y: 0}],
            prop: [],
            footnoteId: null,
        });

        this.storage.data.entity.update<Entity & Parent>(
            parent.id,
            {childIds: [...parent.childIds, area.id]}
        );

        const footnote = this.storage.data.entity.create<Footnote>({
            kind: EntityKind.Footnote,
            text: "",
            prop: [],
        });

        this.storage.data.entity.update<Area>(
            area.id,
            {footnoteId: footnote.id}
        );

        return area;
    }

    onMouseDown(event: MouseEvent): void {
        event.stopPropagation();

        const x = Math.floor(event.x /*- this.viewer.x*/ / this.viewer.scale);
        const y = Math.floor(event.y /*- this.viewer.y*/ / this.viewer.scale);
        const click = {x, y};

        if (event.buttons == MOUSE.LEFT) {

            const selected = this.editor.selected;

            if (!selected || selected.kind != EntityKind.Area) {
                this.setEditor({selected: this.initArea(x, y)});
            }
            else {
                const area = selected as Area;

                const res = pushAreaPoint(area, click);

                this.storage.data.entity.update<Area>(area.id, res);
            }

            // editorContext.setState({toolkit: {items: [TOOLKIT_MODE.ENTITY_FORM]}});

            event.preventDefault();
        }
        else if (event.buttons == MOUSE.RIGHT) {
            this.setEditor({selected: undefined});
        }
    }

    onMouseMove(event: PointerEvent): void {
        event.stopPropagation();
    }

    onMouseUp(): void {}
}