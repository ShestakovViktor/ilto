import type {TextureTile} from "@src/viewer/type";

export type TextureLayout = {
	assetId: string;
	columns: number;
	rows: number;
	tiles: TextureTile[];
};