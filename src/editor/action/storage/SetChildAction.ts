import {Entity, Parent} from "@src/core/type";
import {Action} from "@src/editor/action";
import {Storage} from "@src/storage/controller";

export class SetChildAction extends Action<void> {
    constructor(
        private storage: Storage,
        private props: {
            parentId: number;
            childId: number;
        }
    ) {
        super();
    }

    getLogMessage(): string {
        return "set child";
    }

    getLogData(): {[key: string]: unknown} {
        return {
            parentId: this.props.parentId,
            childId: this.props.childId,
        };
    }

    exec(): void {
        const parent = this.storage.data.entity
            .select<Entity & Parent>(this.props.parentId);

        const child = this.storage.data.entity
            .select<Entity>(this.props.childId);

        if (!parent || !child) throw new Error();

        this.storage.data.entity.update<Entity & Parent>(
            parent.id,
            {childIds: [...parent.childIds, child.id]}
        );
    }

    undo(): void {
        const parent = this.storage.data.entity
            .select<Entity & Parent>(this.props.parentId);

        const child = this.storage.data.entity
            .select<Entity>(this.props.childId);

        if (!parent || !child) throw new Error();

        this.storage.data.entity.update<Entity & Parent>(
            this.props.parentId,
            {
                childIds: parent.childIds
                    .filter(childId => childId != this.props.childId),
            }
        );
    }
}