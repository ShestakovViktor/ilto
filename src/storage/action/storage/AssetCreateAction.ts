import {AssetKind} from "@src/storage/enum";
import type {Asset, Graphics} from "@src/storage/type/asset";
import {Action} from "@src/shared/controller";
import type {DataRepository} from "@src/storage/controller";

export class AssetCreateAction extends Action<Asset> {
	name = "AssetCreateAction";

	private assetId?: number;

	constructor(
		private storage: DataRepository,
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

	apply(): Graphics {
		const image = this.storage.asset.create<Graphics>({
			kind: AssetKind.Graphics,
			...this.payload,
		});

		this.assetId = image.id;

		return image;
	}

	revert(): void {
		if (this.assetId) {
			this.storage.asset.delete(this.assetId);
		}
	}
}