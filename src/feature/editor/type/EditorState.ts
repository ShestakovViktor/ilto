import {INPUT_MODE, TOOLKIT_MODE} from "@feature/editor/enum";
import {Entity, Parent} from "@feature/entity/type";
import {NotificationRecord} from "@feature/editor/type";

export type EditorState = {
    selected: Entity | undefined;

    layer: Parent | undefined;

    toolkit: typeof TOOLKIT_MODE[keyof typeof TOOLKIT_MODE];

    inputMode: typeof INPUT_MODE[keyof typeof INPUT_MODE];

    notification: NotificationRecord[];
};