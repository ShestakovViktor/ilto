export type Pivot = {
	pivotX: number;
	pivotY: number;
};

export function isAnchor(entity: Record<string, unknown>): entity is Pivot {
	return "pivotX" in entity && "pivotY" in entity;
}