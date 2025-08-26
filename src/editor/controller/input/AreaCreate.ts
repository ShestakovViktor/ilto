import {MOUSE} from "@src/shared/enum";
import {pushAreaPoint} from "@src/entity/controller/pushAreaPoint";
import {ActionManager, InputMode} from "@src/editor/controller";
import {Area} from "@src/entity/type/Area";
import {Parent} from "@src/entity/type";
import {Footnote} from "@src/entity/type/Footnote";
import {ENTITY_TYPE} from "@src/entity/enum";
import {Type} from "@src/shared/type";
import {Session} from "@src/editor/type";
import {ViewerState} from "@src/viewer/type";
import {SetStoreFunction} from "solid-js/store";
import {Database} from "@src/shared/controller";

export class AreaCreate extends InputMode {
    private areaType: Type;

    private footnoteType: Type;

    constructor(
        private viewer: ViewerState,
        private editor: Session,
        private setEditor: SetStoreFunction<Session>,
        private actionManager: ActionManager,
        private database: Database
    ) {
        super();
        const [areaType] = this.database.data.entityType
            .filter({name: ENTITY_TYPE.AREA});

        const [footnoteType] = this.database.data.entityType
            .filter({name: ENTITY_TYPE.FOOTNOTE});

        if (!areaType || !footnoteType) throw new Error();

        this.areaType = areaType;

        this.footnoteType = footnoteType;
    }

    initArea(x: number, y: number): Area {
        const parent = this.editor.layer;
        if (!parent) throw new Error();

        const area = this.database.data.entity.create<Area>({
            entityTypeId: this.areaType.id,
            x,
            y,
            width: 0,
            height: 0,
            points: [{x: 0, y: 0}],
            footnoteId: null,
        });

        this.database.data.entity.update<Parent>(
            parent.id,
            {childIds: [...parent.childIds, area.id]}
        );

        const footnote = this.database.data.entity.create<Footnote>({
            entityTypeId: this.footnoteType.id,
            text: "",
        });

        this.database.data.entity.update<Area>(area.id, {footnoteId: footnote.id});

        return area;
    }

    onMouseDown(event: MouseEvent): void {
        event.stopPropagation();

        const x = Math.floor((event.x - this.viewer.x) / this.viewer.scale);
        const y = Math.floor((event.y - this.viewer.y) / this.viewer.scale);
        const click = {x, y};

        if (event.buttons == MOUSE.LEFT) {

            const selected = this.editor.selected;

            if (!selected || selected.entityTypeId != this.areaType.id) {
                this.setEditor({selected: this.initArea(x, y)});
            }
            else {
                const area = selected as Area;

                const res = pushAreaPoint(area, click);

                this.database.data.entity.update<Area>(area.id, res);
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