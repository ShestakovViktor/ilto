import {Mode, Modal} from "@src/editor/controller";
import {InputMode} from "@src/editor/enum";
import {Session} from "@src/editor/type";
import {ImageForm, MarkerForm} from "@src/editor/widget/form";
import {Dialog} from "@src/editor/widget/Editor/widget";
import {ViewerState} from "@src/viewer/type";
import {JSX} from "solid-js";
import {Dynamic} from "solid-js/web";
import {Button} from "@src/core/widget";
import {SetStoreFunction} from "solid-js/store";

export class EntityCreate extends Mode {
    private forms: {
        [key: string]: (props: {x: number; y: number}) => JSX.Element;
    } = {
        [InputMode.ImageCreate]: ImageForm,
        [InputMode.MarkerCreate]: MarkerForm,
    };

    constructor(
        private viewer: ViewerState,
        private modal: Modal,
        private session: Session,
        private setSession: SetStoreFunction<Session>
    ) {
        super();
    }

    onMouseDown(event: MouseEvent): void {
        const rect = (event.currentTarget as HTMLDivElement)
            .getBoundingClientRect();

        const x = Math.floor((event.x - rect.x)
            / this.viewer.scale);
        const y = Math.floor((event.y - rect.y)
            / this.viewer.scale);

        this.modal.push((props: {onClose: () => void}) => {
            const component = this.forms[this.session.inputMode];
            return (
                <Dialog
                    onClose={props.onClose}
                    onSubmit={props.onClose}
                >
                    <Dynamic component={component} x={x} y={y}/>
                    <Button
                        type="submit"
                        form="entity-form"
                        label="Create"
                        onClick={() => {
                            this.setSession(
                                {inputMode: InputMode.DefaultView}
                            );
                        }}
                    />
                </Dialog>
            );
        });

        event.preventDefault();
    }

    onMouseMove(): void {}

    onMouseUp(): void {}
}