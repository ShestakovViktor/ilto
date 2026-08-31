import type {
	ActionEngine,
	HotkeyManager,
	PointerManager,
	ToastQueue,
	ActionLog,
	UidGenerator,
} from "@src/editor/controller";

import type {Session} from "@src/editor/type";

export type EditorContext = {
	session: Session;

	log: ActionLog;
	pointer: PointerManager;
	hotkey: HotkeyManager;
	engine: ActionEngine;
	notif: ToastQueue;
	uid: UidGenerator;
};