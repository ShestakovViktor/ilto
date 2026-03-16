import {Session} from "@src/editor/type";
import {InputHandler} from "@src/editor/controller";
import {InputMode} from "@src/editor/enum";

export class InputManager {
    active: InputHandler;

    constructor(private modes: {[key in Session["inputMode"]]: InputHandler}) {
        this.active = this.modes.DefaultView;
    }

    setMode(mode: InputMode) {
        this.active = this.modes[mode];
    }
}