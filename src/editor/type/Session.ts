import type {InputMode, ActivityMode} from "@src/editor/enum";
import type {Entity, Parent} from "@src/core/type";
import type {ModalView, NotificationRecord} from "@src/editor/type";

export type Session = {
	selected: Entity | undefined;

	layer: Entity & Parent | undefined;

	activityMode: ActivityMode;

	activityHistory: ActivityMode[];

	inputMode: InputMode;

	notification: NotificationRecord[];

	modal: ModalView[];
};