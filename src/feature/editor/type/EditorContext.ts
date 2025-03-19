import {Entity, Parent} from "@feature/entity/type";
import {ArchiveDriver, ImageDriver} from "@interface";
import {Accessor, Setter} from "solid-js";
import {SetStoreFunction} from "solid-js/store";
import {Invoker} from "../controller";
import {EditorState} from "./EditorState";

export type EditorContext = {
    selected: Accessor<Entity | undefined>;
    setSelected: Setter<Entity | undefined>;

    layer: Accessor<Entity & Parent | undefined>;
    setLayer: Setter<Entity & Parent | undefined>;

    state: EditorState;
    setState: SetStoreFunction<EditorState>;

    invoker: Invoker;
    archiveDriver: ArchiveDriver;
    imageDriver: ImageDriver;
};