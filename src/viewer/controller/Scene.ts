import {QuadTree} from "./QuadTree";

export class Scene {
    tree = new QuadTree(0, 0, 0, 0);

    init(width: number, height: number): void {
        this.tree = new QuadTree(0, 0, width, height);
    }

    add(leaf: {id: number; x: number; y: number; w: number; h: number}): void {
        this.tree.insert(leaf);
    }

}