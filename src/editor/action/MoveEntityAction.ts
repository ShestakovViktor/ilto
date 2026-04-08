import {Action} from "@src/editor/action";
import {Entity, isSpatial, Spatial} from "@src/core/type";
import {Storage} from "@src/storage/controller";

export class MoveEntityAction extends Action<void> {
    constructor(
        private storage: Storage,
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

    async exec(): Promise<void> {
        const entity = this.storage.data.entity.select(this.entityId);

        if (!entity || !isSpatial(entity)) throw new Error();

        this.storage.data.entity.update<Entity & Spatial>(
            this.entityId,
            {x: entity.x + this.shiftX, y: entity.y + this.shiftY}
        );
    }

    async undo(): Promise<void> {
        const entity = this.storage.data.entity.select(this.entityId);

        if (!entity || !isSpatial(entity)) throw new Error();

        this.storage.data.entity.update<Entity & Spatial>(
            this.entityId,
            {
                x: entity.x - this.shiftX,
                y: entity.y - this.shiftY,
            }
        );
    }
}