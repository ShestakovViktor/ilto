import type {InputMode} from "@src/editor/enum";
import type {Entity, Parent} from "@src/core/type";
import type {ModalView, NotificationRecord} from "@src/editor/type";
import type {Activities} from "./activity/Activities";

export type Session = {
	selected: Entity | undefined;

	layer: Entity & Parent | undefined;

	activity: Activities;

	history: Activities[];

	inputMode: InputMode;

	notification: NotificationRecord[];

	modal: ModalView[];
};