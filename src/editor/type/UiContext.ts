import {type ShallowRef} from "vue";
import {ModalData} from "@src/editor/controller";

export type UiContext = {
	modal: ShallowRef<ModalData[]>;
};
