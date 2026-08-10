import type {TextureTile} from "@src/viewer/type";

export type TextureLayout = {
	textureId: number;
	createTime: number;
	accessTime: number;

	columns: number;
	rows: number;
	tiles: TextureTile[];
};