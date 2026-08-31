export type Vec2 = Float32Array;

export const vec2 = {
	create(): Vec2 {
		return new Float32Array(2);
	},

	init(x: number, y: number): Vec2 {
		const out = new Float32Array(2);
		out[0] = x;
		out[1] = y;
		return out;
	},

	set(out: Vec2, x: number, y: number): Vec2 {
		out[0] = x;
		out[1] = y;
		return out;
	},

	copy(out: Vec2, a: Vec2): Vec2 {
		out[0] = a[0];
		out[1] = a[0];
		return out;
	},
};