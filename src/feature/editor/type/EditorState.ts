import {INPUT_MODE, UI_MODE} from "@feature/editor/enum";
import {Entity, Parent} from "@feature/entity/type";
import {NotificationRecord} from "@feature/editor/type";

export type EditorState = {
    selected: Entity | undefined;

    layer: Entity & Parent | undefined;

    dockArea: {
        items: typeof UI_MODE[keyof typeof UI_MODE][];
    };

    inputMode: typeof INPUT_MODE[keyof typeof INPUT_MODE];

    notification: NotificationRecord[];
};