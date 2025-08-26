import {Action} from "@src/editor/controller";
import {Entity, Spatial} from "@src/entity/type";
import {Database} from "@src/shared/controller";

export class MoveEntityAction extends Action<void> {
    constructor(
        private database: Database,
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

    submit(): void {
        const entity = this.database.data.entity
            .select<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.database.data.entity.update<Entity & Spatial>(
            this.entityId,
            {x: entity.x + this.shiftX, y: entity.y + this.shiftY}
        );
    }

    revert(): void {
        const entity = this.database.data.entity
            .select<Entity & Spatial>(this.entityId);

        if (!entity) throw new Error();

        this.database.data.entity.update<Entity & Spatial>(
            this.entityId,
            {
                x: entity.x - this.shiftX,
                y: entity.y - this.shiftY,
            }
        );
    }
}