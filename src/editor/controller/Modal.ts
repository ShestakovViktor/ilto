import {Accessor, createSignal, JSX, Setter} from "solid-js";
import {Uid} from "@src/editor/controller";

type Item = {
    uid: string;
    component: (props: {onClose: () => void}) => JSX.Element;
    onClose: () => void;
};

export class Modal {
    private modals: Accessor<Item[]>;

    private setModals: Setter<Item[]>;

    constructor(private uid: Uid) {
        [this.modals, this.setModals] = createSignal<Item[]>([]);
    }

    getAll(): Item[] {
        return this.modals();
    }

    push(component: (props: {onClose: () => void}) => JSX.Element) {
        const uid = this.uid.get();

        const onClose = () => {
            this.setModals(this.modals().filter(modal => modal.uid !== uid));
        };

        this.setModals([...this.modals(), {uid, component, onClose}]);
    }

    pop() {
        this.setModals(this.modals().slice(0, -1));
    }

    clear() {
        this.setModals([]);
    }

}