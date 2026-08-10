export type SceneNode = {
	readonly id: number;
	// readonly parentId: string | null;
	// readonly gpuIndex: number;

	x: number;
	y: number;
	z: number;
	w: number;
	h: number;
	r: number;
	p: number;
	q: number;

	assetId?: number;

	readonly localMatrix: Float32Array;
	// readonly globalMatrix: Float32Array;

	// isDirty: boolean;
};