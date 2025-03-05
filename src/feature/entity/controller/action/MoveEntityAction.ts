import {Action} from "@feature/editor/controller";
import {StoreContextType} from "@feature/store/context";
import {Entity, Spatial} from "@feature/entity/type";

export class MoveEntityAction extends Action<void> {
    constructor(
        private storeCtx: StoreContextType,
        private entityId: number,
        private shiftX: number,
        private shiftY: number
    ) {
        super();
    }

    execute(): void {
        const entity = this.storeCtx.store.entity
            .getById<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.storeCtx.store.entity.set<Entity & Spatial>(
            this.entityId,
            {x: entity.x + this.shiftX, y: entity.y + this.shiftY}
        );
    }

    revert(): void {
        const entity = this.storeCtx.store.entity
            .getById<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.storeCtx.store.entity.set<Entity & Spatial>(
            this.entityId,
            {
                x: entity.x - this.shiftX,
                y: entity.y - this.shiftY,
            }
        );
    }
}