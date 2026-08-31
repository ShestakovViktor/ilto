export type Rotation = {
	rotation: number;
};

export function isRotation(
	entity: Record<string, unknown>
): entity is Rotation {
	return "rotation" in entity;
}

