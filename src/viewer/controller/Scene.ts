import {QuadTree} from "./QuadTree";

export class Scene {
	private tree = new QuadTree(0, 0, 0, 0);

	public init(width: number, height: number): void {
		this.tree = new QuadTree(0, 0, width, height);
	}

	public add(leaf: {id: number; x: number; y: number; w: number; h: number}): void {
		this.tree.insert(leaf);
	}

}