import {AdornerKind} from "@src/viewer/adorner";

export const AdornerCatalog: Record<string, {
	id: number;
	size: number;
	width: number;
}> = {
	[AdornerKind.Pivot]: {
		id: 0,
		size: 96,
		width: 2,
	},
	[AdornerKind.Dot]: {
		id: 1,
		size: 24,
		width: 2,
	},
};