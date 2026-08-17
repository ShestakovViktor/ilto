import type {Mutation} from "@src/editor/type";

export type Setter<T> = (mutation: Mutation<T>) => void;
