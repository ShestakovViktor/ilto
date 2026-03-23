import {InputMode, ToolMode} from "@src/editor/enum";
import {Entity, Parent} from "@src/entity/type";
import {NotificationRecord} from "@src/editor/type";

export type Session = {
    selected: Entity | undefined;

    layer: Entity & Parent | undefined;

    toolkit: ToolMode;

    inputMode: InputMode;

    notification: NotificationRecord[];
};