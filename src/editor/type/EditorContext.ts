import type {
	ActionEngine,
	HotkeyManager,
	MouseController,
	ToastQueue,
	ActionLog,
	UidGenerator,
} from "@src/editor/controller";

import type {Session} from "@src/editor/type";

export type EditorContext = {
	session: Session;

	log: ActionLog;
	mouse: MouseController;
	hotkey: HotkeyManager;
	engine: ActionEngine;
	notif: ToastQueue;
	uid: UidGenerator;
};