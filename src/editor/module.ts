import type {
	WebLinkerDriver,
	WebFetcherDriver,
} from "@src/core/driver";
import type {Storage} from "@src/core/controller";
import {
	Log,
	Mouse,
	Key,
	Engine,
	Notif,
	Uid,
} from "@src/editor/controller";
import {
	RedoHotkey,
	UndoHotkey,
	SaveHotkey,
} from "@src/editor/controller/hotkey";
import type {ArchiverDriver, GraphicsDriver} from "@src/core/interface";
import type {ViewerState} from "@src/viewer/type";
import type {Getter, Session, Setter} from "@src/editor/type";
import type {Loop} from "@src/viewer/controller";

export function initEditorModule(deps: {
	linker: WebLinkerDriver;
	fetcher: WebFetcherDriver;
	archiver: ArchiverDriver;
	graphics: GraphicsDriver;
	storage: Storage;
	loop: Loop;
	getViewer: Getter<ViewerState>;
	setViewer: Setter<ViewerState>;
	getSession: Getter<Session>;
	setSession: Setter<Session>;
}): {
	storage: Storage;
	uid: Uid;
	notif: Notif;
	log: Log;
	engine: Engine;
	key: Key;
	mouse: Mouse;
} {
	const uid = new Uid();
	const notif = new Notif(uid, deps.getSession, deps.setSession);
	const log = new Log();
	const engine = new Engine(log);
	const key = new Key([
		new RedoHotkey(engine),
		new UndoHotkey(engine),
		new SaveHotkey(deps.storage, deps.linker, deps.archiver, deps.fetcher),
	]);
	const mouse = new Mouse(
		deps.getViewer,
		deps.setSession,
		deps.storage,
		deps.loop,
		engine,
		deps.graphics
	);

	return {
		storage: deps.storage,
		uid,
		log,
		mouse,
		key,
		engine,
		notif,
	};
}

