import type {Entity} from "@src/storage/type/entity";
import type {ModalView, NotificationRecord} from "@src/editor/type";
import type {Activities} from "./activity/Activities";
import type {Drafts} from "@src/editor/type/draft";
import type {Adorner} from "@src/viewer/adorner";
import type {AdornerRole} from "@src/editor/enum";

export type Session = {
	selected: Entity | undefined;

	activity: Activities;

	history: Activities[];

	draft: Drafts;

	notification: NotificationRecord[];

	modal: ModalView[];

	adorner: Partial<Record<AdornerRole, Adorner>>;
};