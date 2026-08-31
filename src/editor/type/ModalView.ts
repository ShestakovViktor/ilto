import type {EntityKind} from "@src/storage/enum";
import type {ModalKind} from "@src/editor/enum";

type AssetBrowser = {
	kind: ModalKind.AssetBrowser;
	payload: {kind: EntityKind};
};

export type ModalView = AssetBrowser;