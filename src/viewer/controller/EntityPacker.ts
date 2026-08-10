import type {EntityConfig, SceneNode} from "@src/viewer/type";

export class EntityPacker {

	constructor(private readonly entityConfig: EntityConfig) {}

	formData(entities: SceneNode []): {data: Float32Array} {
		const data = new Float32Array(
			entities.length * this.entityConfig.stride
		);

		for (let i = 0; i < entities.length; i++) {
			const object = entities[i];

			const offset = i * this.entityConfig.stride;

			data[offset + 0] = object.localMatrix[0];
			data[offset + 1] = object.localMatrix[1];
			data[offset + 2] = object.localMatrix[2];
			data[offset + 3] = object.w;

			data[offset + 4] = object.localMatrix[3];
			data[offset + 5] = object.localMatrix[4];
			data[offset + 6] = object.localMatrix[5];
			data[offset + 7] = object.h;

			data[offset + 8] = object.localMatrix[6];
			data[offset + 9] = object.localMatrix[7];
			data[offset + 10] = object.localMatrix[8];
			data[offset + 11] = object.z;

			data[offset + 12] = 1.0;
			data[offset + 13] = 0.0;
			data[offset + 14] = 0.0;
			data[offset + 15] = 0.0;
		}

		return {data};
	}

}
