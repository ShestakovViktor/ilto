import {MOUSE} from "@src/shared/enum";
import {ActionManager, InputHandler} from "@src/editor/controller";
import {Entity, Spatial} from "@src/entity/type";
import {MoveEntityAction} from "@src/entity/controller/action";
import {Database} from "@src/shared/controller";
import {SetStoreFunction} from "solid-js/store";
import {Session} from "@src/editor/type";
import {ViewerState} from "@src/viewer/type";

export class EntitySelect extends InputHandler {
    private element?: HTMLElement;

    private entity?: Entity & Spatial;

    private parent?: {x: number; y: number};

    private offset?: {x: number; y: number};

    private origin?: {x: number; y: number};

    private allowedTypes: number[];

    constructor(
        private database: Database,
        private viewer: ViewerState,
        private setEditorState: SetStoreFunction<Session>,
        private actionManager: ActionManager
    ) {
        super();
        // const [markerType] = this.databse.data.entityType
        //     .filter({name: ENTITY_TYPE.MARKER});
        // const [decorType] = this.databse.data.entityType
        //     .filter({name: ENTITY_TYPE.DECOR});
        // const [areaType] = this.databse.data.entityType
        //     .filter({name: ENTITY_TYPE.AREA});

        this.allowedTypes = [];
    }

    getElement(element: EventTarget | null): HTMLElement | undefined {
        if (!(element instanceof HTMLElement)) return undefined;

        let current: HTMLElement | null = element;

        while (current) {
            if (current.hasAttribute("data-entity-id")) return current;
            current = current.parentElement;
        }

        return undefined;
    }

    getParent(element: HTMLElement): {x: number; y: number} {
        const parent = element.parentElement;
        if (!parent) throw new Error();

        const rect = parent.getBoundingClientRect();

        return {x: rect.x, y: rect.y};
    }

    getEntity(element: HTMLElement): Entity & Spatial | undefined {
        return this.database.data.entity.select<Entity & Spatial>(
            Number(element.getAttribute("data-entity-id"))
        );
    }

    getOffset(element: HTMLElement, event: MouseEvent): {x: number; y: number} {
        const rect = element.getBoundingClientRect();

        return {
            x: event.x - rect.x,
            y: event.y - rect.y,
        };
    }

    getStart(entity: Entity & Spatial): {x: number; y: number} {
        return {x: entity.x, y: entity.y};
    }

    onMouseDown(event: MouseEvent): void {
        if (event.buttons != MOUSE.LEFT) return;

        this.element = this.getElement(event.target);
        if (!this.element) throw new Error();

        this.parent = this.getParent(this.element);
        if (!this.parent) throw new Error();

        this.entity = this.getEntity(this.element);
        if (!this.entity) throw new Error();

        this.offset = this.getOffset(this.element, event);

        this.origin = this.getStart(this.entity);

        this.setEditorState({selected: this.entity});

        event.stopPropagation();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.entity || !this.parent || !this.offset) return;

        this.database.data.entity.update<Spatial>(this.entity?.id, {
            x: Math.round(
                (event.x - this.parent.x - this.offset.x)
                                / this.viewer.scale
            ),
            y: Math.round(
                (event.y - this.parent.y - this.offset.y)
                                / this.viewer.scale
            ),
        });

        event.stopPropagation();
    }

    onMouseUp(): void {
        if (this.entity && this.origin) {
            this.actionManager.append(
                new MoveEntityAction(
                    this.database,
                    this.entity.id,
                    this.entity.x - this.origin.x,
                    this.entity.y - this.origin.y
                )
            );
        }

        delete this.element;
        delete this.entity;
        delete this.parent;
        delete this.offset;
    }
}