import {INPUT_MODE, TOOLKIT_MODE} from "@src/editor/enum";
import {Entity, Parent} from "@src/entity/type";
import {NotificationRecord} from "@src/editor/type";

export type Session = {
    selected: Entity | undefined;

    layer: Parent | undefined;

    toolkit: typeof TOOLKIT_MODE[keyof typeof TOOLKIT_MODE];

    inputMode: typeof INPUT_MODE[keyof typeof INPUT_MODE];

    notification: NotificationRecord[];
};