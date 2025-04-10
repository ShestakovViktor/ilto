import {EditorState} from "@feature/editor/type";
import {InputMode} from "@feature/editor/controller";
import {
    DefaultView,
    EntitySelect,
    MarkerCreate,
    DecorCreate,
    AreaCreate,
} from "@feature/editor/controller/input";
import {createEffect} from "solid-js";
import {useEditorContext} from "@feature/editor/context";

export class InputManager {
    active: InputMode;

    modes: {[key in EditorState["inputMode"]]: InputMode};

    constructor(element: HTMLElement) {
        const editorContext = useEditorContext();

        createEffect(() => {
            this.active = this.modes[editorContext.state.inputMode];
        });

        this.modes = {
            DefaultView: new DefaultView(),
            EntitySelect: new EntitySelect(),
            MarkerCreate: new MarkerCreate(),
            DecorCreate: new DecorCreate(),
            AreaCreate: new AreaCreate(),
        };

        this.active = this.modes.DefaultView;

        element.addEventListener("mousedown", (event: MouseEvent) => {
            this.active.onMouseDown(event);
        }, {capture: true});

        element.addEventListener("mousemove", (event: MouseEvent) => {
            this.active.onMouseMove(event);
        }, {capture: true});

        element.addEventListener("mouseup", (event: MouseEvent) => {
            this.active.onMouseUp(event);
        }, {capture: true});

        element.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        }, {capture: true});
    }
}