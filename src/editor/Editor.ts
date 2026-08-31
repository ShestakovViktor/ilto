import {
	ActionLog,
	MouseController,
	HotkeyManager,
	ActionEngine,
	ToastQueue,
	UidGenerator,
} from "@src/editor/controller";
import {
	RedoHotkey,
	UndoHotkey,
	SaveHotkey,
} from "@src/editor/controller/hotkey";
import type {Storage} from "@src/storage/Storage";
import type {Viewer} from "@src/viewer/Viewer";
import type {Session} from "@src/editor/type";

export class Editor {
	readonly uid: UidGenerator;
	readonly notif: ToastQueue;
	readonly log: ActionLog;
	readonly engine: ActionEngine;
	readonly hotkey: HotkeyManager;
	readonly mouse: MouseController;

	constructor(
		storage: Storage,
		viewer: Viewer,
		public session: Session
	) {
		this.uid = new UidGenerator();
		this.notif = new ToastQueue(this.uid, session);
		this.log = new ActionLog();
		this.engine = new ActionEngine(this.log);
		this.hotkey = new HotkeyManager([
			new RedoHotkey(this.engine),
			new UndoHotkey(this.engine),
			new SaveHotkey(storage, this.engine),
		]);
		this.mouse = new MouseController(
			viewer,
			this.engine,
			this.session
		);
	}
}
