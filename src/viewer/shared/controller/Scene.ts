import type {DataRepository} from "@src/storage/controller";
import {QuadTree} from "@src/shared/controller";
import {mat3, type Mat3} from "@src/shared/math";
import type {Entity} from "@src/storage/type/entity";
import {
	isParent,
	isVisual,
	type Rotation,
	type Scale,
	type Size,
	type Spatial,
} from "@src/storage/type/property";

import type {SceneNode} from "@src/viewer/shared/type";

export class Scene {
	private tree = new QuadTree(0, 0, 0, 0);

	x = 0;
	y = 0;
	width = 0;
	height = 0;

	graph: SceneNode[] = [];

	constructor(private storage: DataRepository) {}

	setSize(x: number, y: number, w: number, h: number): void {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	getMatrixById(id: number): Float32Array | undefined {
		return this.graph.find(entity => entity.id == id)?.worlMatrix;
	}

	getNodeById(id: number): SceneNode | undefined {
		return this.graph.find(entity => entity.id == id);
	}

	update(): void {
		this.graph = [];
		this.fillSceneGraph(1);
	}

	createQuadTree(id = 1, worldMatrix?: Float32Array): void {
		if (!worldMatrix) {
			worldMatrix = mat3.identity(mat3.init());
		}

		const entity = this.storage.entity
			.select<Entity & Spatial & Size & Rotation & Scale>(id);

		if (!entity) return;

		const localMatrix = mat3.makeTransform(
			mat3.init(),
			entity.x,
			entity.y,
			entity.rotation,
			entity.scaleX,
			entity.scaleY
		);

		if (isParent(entity)) {
			entity.childIds.forEach(id => this.createQuadTree(id, localMatrix));
		}
	}

	fillSceneGraph(id: number, worldMatrix?: Float32Array): void {
		if (!worldMatrix) {
			worldMatrix = mat3.identity(mat3.init());
		}

		const entity = this.storage.entity
			.select<Entity & Spatial & Size & Rotation & Scale>(id);

		if (!entity) return;

		const localMatrix = mat3.makeTransform(
			mat3.init(),
			entity.x,
			entity.y,
			entity.rotation,
			entity.scaleX,
			entity.scaleY
		);

		mat3.multiply(localMatrix, localMatrix, worldMatrix);

		const sceneNode: SceneNode = {
			id,
			x: entity.x,
			y: entity.y,
			z: 1,
			width: entity.width || 0,
			height: entity.height || 0,
			rotation: entity.rotation,
			scaleX: entity.scaleX,
			scaleY: entity.scaleY,
			worlMatrix: localMatrix,
		};

		if (isVisual(entity)) {
			sceneNode.assetId = entity.assetId;
		}

		this.graph.push(sceneNode);

		if (isParent(entity)) {
			entity.childIds.forEach(id => this.fillSceneGraph(id, {...localMatrix}));
		}
	}

	init(width: number, height: number): void {
		this.tree = new QuadTree(0, 0, width, height);
	}

	add(leaf: {
		id: number;
		x: number;
		y: number;
		width: number;
		height: number;
	}): void {
		this.tree.insert(leaf);
	}
}