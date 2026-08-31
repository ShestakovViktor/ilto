export type SceneNode = {
	readonly id: number;
	// readonly parentId: string | null;
	// readonly gpuIndex: number;

	x: number;
	y: number;
	z: number;
	width: number;
	height: number;
	rotation: number;
	scaleX: number;
	scaleY: number;

	assetId?: number;

	readonly worlMatrix: Float32Array;
	// readonly globalMatrix: Float32Array;

	// isDirty: boolean;
};