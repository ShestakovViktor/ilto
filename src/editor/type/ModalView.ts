import type {ModalKind} from "@src/editor/enum";
import type {Props as ImageFormProps} from "@src/editor/view/form/ImageForm.vue";

type ImageCreateForm = {
	kind: ModalKind.ImageForm;
	props: ImageFormProps;
};

export type ModalView = ImageCreateForm;