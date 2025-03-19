import {Action} from "@feature/editor/controller";
import {StoreContext} from "@feature/store/type";
import {Entity, Spatial} from "@feature/entity/type";

export class MoveEntityAction extends Action<void> {
    constructor(
        private storeContext: StoreContext,
        private entityId: number,
        private shiftX: number,
        private shiftY: number
    ) {
        super();
    }

    execute(): void {
        const entity = this.storeContext.store.entity
            .getById<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.storeContext.store.entity.set<Entity & Spatial>(
            this.entityId,
            {x: entity.x + this.shiftX, y: entity.y + this.shiftY}
        );
    }

    revert(): void {
        const entity = this.storeContext.store.entity
            .getById<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.storeContext.store.entity.set<Entity & Spatial>(
            this.entityId,
            {
                x: entity.x - this.shiftX,
                y: entity.y - this.shiftY,
            }
        );
    }
}