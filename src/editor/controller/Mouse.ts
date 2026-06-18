import type {Engine, Mode} from "@src/editor/controller";
import {InputMode} from "@src/editor/enum";
import {
	DefaultView,
	EntitySelect,
	EntityCreate,
} from "@src/editor/controller/mode";
import type {ViewerState} from "@src/viewer/type";
import type {Storage} from "@src/core/controller";
import type {Getter, Session, Setter} from "@src/editor/type";
import type {GraphicsDriver} from "@src/core/interface";
import type {Loop} from "@src/viewer/controller";

export class Mouse {
	private modes: Record<string, Mode>;

	private active: Mode;

	constructor(
		getViewer: Getter<ViewerState>,
		setSession: Setter<Session>,
		storage: Storage,
		loop: Loop,
		engine: Engine,
		graphics: GraphicsDriver
	) {

		const defaultView = new DefaultView();
		const entitySelect = new EntitySelect(
			getViewer,
			storage,
			engine
		);
		const entityCreate = new EntityCreate(
			getViewer,
			setSession,
			graphics,
			storage,
			loop,
			engine
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

	setElement(element: HTMLElement): void {
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

	setMode(mode: InputMode): void {
		this.active = this.modes[mode];
	}
}