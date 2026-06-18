import type {Updater} from "@src/editor/type";

export type Setter<T> = (updater: Updater<T>) => void;