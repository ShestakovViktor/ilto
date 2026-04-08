import {Action} from "@src/editor/action";
import {Entity, Parent} from "@src/core/type";
import {Collection} from "@src/storage/controller";
import {unwrap} from "solid-js/store";

export class DeleteEntityAction extends Action<void> {
    private entity?: Entity;

    private parentId?: number;

    private related: Entity[] = [];

    private childIds?: number[];

    constructor(
        private entities: Collection<Entity>,
        private entityId: number
    ) {
        super();
    }

    getLogMessage(): string {
        return "delete entity";
    }

    getLogData(): {[key: string]: unknown} {
        return {
            entityId: this.entityId,
            entity: this.entity,
            parentId: this.parentId,
            related: this.related,
        };
    }

    async exec(): Promise<void> {
        const entity = this.entities
            .select(this.entityId);

        if (!entity) throw new Error();

        const parent = this.entities
            .selectContains<Entity & Parent>("childIds", this.entityId);

        if (!parent) throw new Error();

        this.parentId = parent.id;

        this.childIds = unwrap(parent.childIds);

        this.entities.update<Entity & Parent>(parent.id, {
            childIds: this.childIds.filter(id => id != entity.id),
        });

        const relatedIds = this.entities
            .selectRelated<Entity & Parent>(entity.id, "childIds");

        this.entity = this.entities.delete(this.entityId);

        this.related = relatedIds.map((id) => this.entities.delete(id));
    }

    async undo(): Promise<void> {
        if (!this.parentId || !this.entity) return;

        const parent = this.entities
            .select<Entity & Parent>(this.parentId);

        if (!parent) throw new Error();

        this.related
            .toReversed()
            .forEach((entity) => {
                this.entities.insert(entity);
            });

        this.entities.insert(this.entity);

        this.entities.update<Entity & Parent>(parent.id, {
            childIds: this.childIds,
        });
    }
}