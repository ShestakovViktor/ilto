import {InputMode, ToolkitMode} from "@src/editor/enum";
import {Entity, Parent} from "@src/entity/type";
import {NotificationRecord} from "@src/editor/type";

export type Session = {
    selected: Entity | undefined;

    layer: Parent | undefined;

    toolkit: ToolkitMode;

    inputMode: InputMode;

    notification: NotificationRecord[];
};