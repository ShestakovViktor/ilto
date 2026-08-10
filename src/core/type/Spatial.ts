export type Spatial = {
	x: number;
	y: number;
};

export function isSpatial(entity: Record<string, unknown>): entity is Spatial {
	return "x" in entity && "y" in entity;
}
