import {Session} from "@src/editor/type";
import {InputMode} from "@src/editor/controller";
import {INPUT_MODE} from "@src/editor/enum";

export class InputManager {
    active: InputMode;

    constructor(private modes: {[key in Session["inputMode"]]: InputMode}) {
        this.active = this.modes.DefaultView;
    }

    setMode(mode: typeof INPUT_MODE[keyof typeof INPUT_MODE]) {
        this.active = this.modes[mode];
    }
}