import type {EntityConfig, SceneNode} from "@src/viewer/shared/type";

export class EntityPacker {

	constructor(private readonly entityConfig: EntityConfig) {}

	formData(entities: SceneNode []): {data: Float32Array} {
		const data = new Float32Array(
			entities.length * this.entityConfig.stride
		);

		for (let i = 0; i < entities.length; i++) {
			const object = entities[i];

			const offset = i * this.entityConfig.stride;

			data[offset + 0] = object.worlMatrix[0];
			data[offset + 1] = object.worlMatrix[1];
			data[offset + 2] = object.worlMatrix[2];
			data[offset + 3] = object.width;

			data[offset + 4] = object.worlMatrix[3];
			data[offset + 5] = object.worlMatrix[4];
			data[offset + 6] = object.worlMatrix[5];
			data[offset + 7] = object.height;

			data[offset + 8] = object.worlMatrix[6];
			data[offset + 9] = object.worlMatrix[7];
			data[offset + 10] = object.worlMatrix[8];
			data[offset + 11] = object.z;

			data[offset + 12] = 1.0;
			data[offset + 13] = 0.0;
			data[offset + 14] = 0.0;
			data[offset + 15] = 0.0;
		}

		return {data};
	}

}
