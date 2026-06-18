import type {
	Engine,
	Key,
	Mouse,
	Notif,
	Log,
	Uid,
} from "@src/editor/controller";

import type {Storage} from "@src/core/controller";
import type {Ref} from "vue";
import type {Session} from "./Session";

export type EditorContext = {
	session: Ref<Session>;

	storage: Storage;

	log: Log;
	mouse: Mouse;
	key: Key;
	engine: Engine;
	notif: Notif;
	uid: Uid;
};