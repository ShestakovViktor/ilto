import type {AdornerKind} from "@src/viewer/adorner";

export type Adorner = {
	x: number;
	y: number;
	kind: AdornerKind;
	color: {
		r: number;
		g: number;
		b: number;
		a: number;
	};
};