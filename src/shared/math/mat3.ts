import type {Vec2} from "./vec2";

export type Mat3 = Float32Array;

export const mat3 = {
	create(): Mat3 {
		return new Float32Array(9);
	},

	init(): Mat3 {
		const out = new Float32Array(9);
		out[0] = 1; out[4] = 1; out[8] = 1;
		return out;
	},

	identity(out: Mat3): Mat3 {
		out[0] = 1;
		out[1] = 0;
		out[2] = 0;
		out[3] = 0;
		out[4] = 1;
		out[5] = 0;
		out[6] = 0;
		out[7] = 0;
		out[8] = 1;
		return out;
	},

	makeTransform(
		out: Mat3,
		x: number,
		y: number,
		r: number,
		p = 1,
		q = 1
	): Mat3 {
		let c = Math.cos(r);
		let s = Math.sin(r);

		if (Math.abs(s) < 0.00001) s = 0.0;
		if (Math.abs(c - 1.0) < 0.00001) c = 1.0;
		if (Math.abs(c + 1.0) < 0.00001) c = -1.0;

		out[0] = c * p;
		out[1] = s * p;
		out[2] = 0.0;

		out[3] = -s * q;
		out[4] = c * q;
		out[5] = 0.0;

		out[6] = x;
		out[7] = y;
		out[8] = 1.0;

		return out;
	},

	multiply(out: Mat3, a: Mat3, b: Mat3): Mat3 {
		const a00 = a[0];
		const a01 = a[1];
		const a02 = a[2];
		const a10 = a[3];
		const a11 = a[4];
		const a12 = a[5];
		const a20 = a[6];
		const a21 = a[7];
		const a22 = a[8];

		const b00 = b[0];
		const b01 = b[1];
		const b02 = b[2];
		const b10 = b[3];
		const b11 = b[4];
		const b12 = b[5];
		const b20 = b[6];
		const b21 = b[7];
		const b22 = b[8];

		out[0] = b00 * a00 + b01 * a10 + b02 * a20;
		out[1] = b00 * a01 + b01 * a11 + b02 * a21;
		out[2] = b00 * a02 + b01 * a12 + b02 * a22;

		out[3] = b10 * a00 + b11 * a10 + b12 * a20;
		out[4] = b10 * a01 + b11 * a11 + b12 * a21;
		out[5] = b10 * a02 + b11 * a12 + b12 * a22;

		out[6] = b20 * a00 + b21 * a10 + b22 * a20;
		out[7] = b20 * a01 + b21 * a11 + b22 * a21;
		out[8] = b20 * a02 + b21 * a12 + b22 * a22;
		return out;
	},

	copy(out: Mat3, a: Mat3): Mat3 {
		out.set(a);
		return out;
	},

	invert(out: Mat3, a: Mat3): Mat3 {
		const a00 = a[0];
		const a01 = a[1];
		const a02 = a[2];
		const a10 = a[3];
		const a11 = a[4];
		const a12 = a[5];
		const a20 = a[6];
		const a21 = a[7];
		const a22 = a[8];

		const b01 = a22 * a11 - a12 * a21;
		const b11 = -a22 * a10 + a12 * a20;
		const b21 = a21 * a10 - a11 * a20;

		let det = a00 * b01 + a01 * b11 + a02 * b21;

		if (!det) {
			return this.identity(out);
		}

		det = 1.0 / det;

		out[0] = b01 * det;
		out[1] = (-a22 * a01 + a02 * a21) * det;
		out[2] = (a12 * a01 - a02 * a11) * det;

		out[3] = b11 * det;
		out[4] = (a22 * a00 - a02 * a20) * det;
		out[5] = (-a12 * a00 + a02 * a10) * det;

		out[6] = b21 * det;
		out[7] = (-a21 * a00 + a01 * a20) * det;
		out[8] = (a11 * a00 - a01 * a10) * det;

		return out;
	},

	multiplyVec2(out: Vec2, m: Mat3, a: Vec2): Vec2 {
		const outX = m[0] * a[0] + m[3] * a[1] + m[6];
		const outY = m[1] * a[0] + m[4] * a[1] + m[7];

		out[0] = outX;
		out[1] = outY;

		return out;
	},
};
