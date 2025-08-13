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

    getLogMessage(): string {
        return "move entity";
    }

    getLogData(): {[key: string]: unknown} {
        return {
            entityId: this.entityId,
            shiftX: this.shiftX,
            shiftY: this.shiftY,
        };
    }

    execute(): void {
        const entity = this.storeContext.store.entity
            .select<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.storeContext.store.entity.update<Entity & Spatial>(
            this.entityId,
            {x: entity.x + this.shiftX, y: entity.y + this.shiftY}
        );
    }

    revert(): void {
        const entity = this.storeContext.store.entity
            .select<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.storeContext.store.entity.update<Entity & Spatial>(
            this.entityId,
            {
                x: entity.x - this.shiftX,
                y: entity.y - this.shiftY,
            }
        );
    }
}