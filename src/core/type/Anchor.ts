export type Anchor = {
	pivotX: number;
	pivotY: number;
};

export function isAnchor(entity: Record<string, unknown>): entity is Anchor {
	return "pivotX" in entity && "pivotY" in entity;
}