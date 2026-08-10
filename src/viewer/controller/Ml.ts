type Matrix3 = Float32Array;

export class Ml {

	init(): Matrix3 {
		return new Float32Array(9);
	}

	identity(r: Matrix3): Matrix3 {
		r[0] = 1;
		r[1] = 0;
		r[2] = 0;
		r[3] = 0;
		r[4] = 1;
		r[5] = 0;
		r[6] = 0;
		r[7] = 0;
		r[8] = 1;
		return r;
	}

	makeTransform(
		o: Matrix3,
		x: number,
		y: number,
		r: number,
		p = 1,
		q = 1
	): Matrix3 {
		let c = Math.cos(r);
		let s = Math.sin(r);

		if (Math.abs(s) < 0.00001) s = 0.0;
		if (Math.abs(c - 1.0) < 0.00001) c = 1.0;
		if (Math.abs(c + 1.0) < 0.00001) c = -1.0;

		o[0] = c * p;
		o[1] = s * p;
		o[2] = 0.0;

		o[3] = -s * q;
		o[4] = c * q;
		o[5] = 0.0;

		o[6] = x;
		o[7] = y;
		o[8] = 1.0;

		return o;
	}

	multiply(r: Matrix3, a: Matrix3, b: Matrix3): Matrix3 {
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

		r[0] = b00 * a00 + b01 * a10 + b02 * a20;
		r[1] = b00 * a01 + b01 * a11 + b02 * a21;
		r[2] = b00 * a02 + b01 * a12 + b02 * a22;

		r[3] = b10 * a00 + b11 * a10 + b12 * a20;
		r[4] = b10 * a01 + b11 * a11 + b12 * a21;
		r[5] = b10 * a02 + b11 * a12 + b12 * a22;

		r[6] = b20 * a00 + b21 * a10 + b22 * a20;
		r[7] = b20 * a01 + b21 * a11 + b22 * a21;
		r[8] = b20 * a02 + b21 * a12 + b22 * a22;
		return r;
	}

	copy(out: Matrix3, a: Matrix3): Matrix3 {
		out.set(a);
		return out;
	}
}
