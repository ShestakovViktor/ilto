import {inject, type App} from "vue";
import type {Storage} from "@src/storage/Storage";

export const storageContextKey = Symbol("storageContext");

export function setStorageContext(app: App, storage: Storage): void {
	app.provide<Storage>(storageContextKey, storage);
}

export function useStorageContext(): Storage {
	const context = inject<Storage>(storageContextKey);

	if (!context) {
		throw new Error("");
	}

	return context;
}