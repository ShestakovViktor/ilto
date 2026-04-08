import {Engine, Mode, Modal} from "@src/editor/controller";
import {InputMode} from "@src/editor/enum";
import {
    DefaultView,
    EntitySelect,
    EntityCreate,
} from "@src/editor/controller/mode";
import {SetStoreFunction} from "solid-js/store";
import {ViewerState} from "@src/viewer/type";
import {Session} from "@src/editor/type";
import {Storage} from "@src/storage/controller";

export class Mouse {
    private modes: {[key: string]: Mode};

    private active: Mode;

    constructor(
        storage: Storage,
        viewer: ViewerState,
        session: Session,
        setSession: SetStoreFunction<Session>,
        engine: Engine,
        modalManager: Modal
    ) {

        const defaultView = new DefaultView();
        const entitySelect = new EntitySelect(
            storage,
            viewer,
            setSession,
            engine
        );
        const entityCreate = new EntityCreate(
            viewer,
            modalManager,
            session,
            setSession
        );

        this.modes = {
            [InputMode.DefaultView]: defaultView,
            [InputMode.EntitySelect]: entitySelect,
            [InputMode.ImageCreate]: entityCreate,
            [InputMode.MarkerCreate]: entityCreate,
            [InputMode.DecorCreate]: entityCreate,
        };

        this.active = this.modes.DefaultView;
    }

    setElement(element: HTMLElement) {
        element.addEventListener(
            "mousedown",
            (event) => this.active.onMouseDown(event),
            {capture: true}
        );
        element.addEventListener(
            "mousemove",
            (event) => this.active.onMouseMove(event),
            {capture: true}
        );
        element.addEventListener(
            "mouseup",
            (event) => this.active.onMouseUp(event),
            {capture: true}
        );
    }

    setMode(mode: InputMode) {
        this.active = this.modes[mode];
    }
}