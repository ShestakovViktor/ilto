import {QuadTree} from "./QuadTree";

export class Scene {
	private tree = new QuadTree(0, 0, 0, 0);

	x = 0;

	y = 0;

	w = 0;

	h = 0;

	setSize(x: number, y: number, w: number, h: number): void {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(width: number, height: number): void {
		this.tree = new QuadTree(0, 0, width, height);
	}

	add(leaf: {id: number; x: number; y: number; w: number; h: number}): void {
		this.tree.insert(leaf);
	}
}