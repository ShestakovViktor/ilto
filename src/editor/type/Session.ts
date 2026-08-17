import type {InputKind} from "@src/editor/enum";
import type {Entity} from "@src/core/type/entity";
import type {Parent} from "@src/core/type/property";
import type {ModalView, NotificationRecord} from "@src/editor/type";
import type {Activities} from "./activity/Activities";

export type Session = {
	selected: Entity | undefined;

	layer: Entity & Parent | undefined;

	activity: Activities;

	history: Activities[];

	input: InputKind;

	notification: NotificationRecord[];

	modal: ModalView[];
};