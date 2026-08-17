import {AssetKind} from "@src/core/enum";
import type {Asset, Graphics} from "@src/core/type/asset";
import {Action} from "@src/core/library";
import type {DataStorage} from "@src/core/controller";

export class AssetCreateAction extends Action<Asset> {
	name = "AssetCreateAction";

	private assetId?: number;

	constructor(
		private storage: DataStorage,
		public payload: {
			size: number;
			mime: string;
			path: string;
			name: string;
			meta: {footnote: string};
		}
	) {
		super();
	}

	getLogMessage(): string {
		return "create image";
	}

	getLogData(): Record<string, unknown> {
		return {
			assetId: this.assetId,
			props: this.payload,
		};
	}

	exec(): Graphics {
		const image = this.storage.asset.create<Graphics>({
			kind: AssetKind.Graphics,
			...this.payload,
		});

		this.assetId = image.id;

		return image;
	}

	undo(): void {
		if (this.assetId) {
			this.storage.asset.delete(this.assetId);
		}
	}
}