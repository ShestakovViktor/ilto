import type {EventBus, DataStorage} from "@src/core/controller";
import {QuadTree} from "./QuadTree";
import {MathLibrary} from "@src/viewer/controller";
import type {Entity} from "@src/core/type/entity";
import {
	isParent,
	isVisual,
	type Rotation,
	type Scale,
	type Size,
	type Spatial,
} from "@src/core/type/property";

import type {SceneNode} from "@src/viewer/type";
import {EventKind} from "@src/core/enum";

export class Scene {
	private tree = new QuadTree(0, 0, 0, 0);

	x = 0;

	y = 0;

	w = 0;

	h = 0;

	graph: SceneNode[] = [];

	private ml: MathLibrary;

	constructor(
		private storage: DataStorage

	) {
		this.ml = new MathLibrary();
	}

	setSize(x: number, y: number, w: number, h: number): void {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	update(): void {
		console.log("update scene graph");
		this.graph = [];
		this.foo(1);
	}

	foo(id: number): void {
		const entity = this.storage.entity
			.select<Entity & Spatial & Size & Rotation & Scale>(id);

		if (!entity) return;

		const localMatrix = this.ml.makeTransform(
			this.ml.init(),
			entity.x,
			entity.y,
			entity.rotation,
			entity.scaleX,
			entity.scaleY
		);

		const sceneNode: SceneNode = {
			id,
			x: entity.x,
			y: entity.y,
			z: 1,
			w: entity.width || 0,
			h: entity.height || 0,
			r: entity.rotation,
			p: entity.scaleX,
			q: entity.scaleY,
			localMatrix,
		};

		if (isVisual(entity)) {
			sceneNode.assetId = entity.assetId;
		}

		this.graph.push(sceneNode);

		if (isParent(entity)) {
			entity.childIds.forEach(id => this.foo(id));
		}
	}

	init(width: number, height: number): void {
		this.tree = new QuadTree(0, 0, width, height);
	}

	add(leaf: {id: number; x: number; y: number; w: number; h: number}): void {
		this.tree.insert(leaf);
	}
}