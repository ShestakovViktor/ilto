type Item = {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
};

export class QuadTree {
	private ne?: QuadTree;

	private se?: QuadTree;

	private sw?: QuadTree;

	private nw?: QuadTree;

	private items?: Item[] = [];

	private maxItems = 4;

	private maxLevels = 8;

	constructor(
		private x: number,
		private y: number,
		private width: number,
		private height: number,
		private level = 0
	) {}

	private split(): void {
		const width = this.width / 2;
		const height = this.height / 2;
		const level = this.level + 1;

		this.ne = new QuadTree(
			this.x + width,
			this.y,
			width,
			height,
			level
		);
		this.se = new QuadTree(
			this.x + width,
			this.y + height,
			width,
			height,
			level
		);
		this.sw = new QuadTree(
			this.x,
			this.y + height,
			width,
			height,
			level
		);
		this.nw = new QuadTree(
			this.x,
			this.y,
			width,
			height,
			level
		);
	}

	insert(item: Item): void {
		if (!this.items) {
			this.insertToSubnodes(item);
		}
		else {
			this.items.push(item);

			if (
				this.items.length > this.maxItems
                && this.level < this.maxLevels
			) {
				this.split();

				while (this.items.length > 0) {
					this.insertToSubnodes(this.items.pop()!);
				}

				this.items = undefined;
			}
		}
	}

	private insertToSubnodes(item: Item): void {
		if (!this.nw || !this.ne || !this.se || !this.sw) return;

		const midX = this.x + this.width / 2;
		const midY = this.y + this.height / 2;

		const itemLeft = item.x;
		const itemRight = item.x + item.width;
		const itemTop = item.y;
		const itemBottom = item.y + item.height;

		const w = itemLeft < midX;
		const e = itemRight > midX;
		const n = itemTop < midY;
		const s = itemBottom > midY;

		if (n && e) this.ne.insert(item);
		if (s && e) this.se.insert(item);
		if (s && w) this.sw.insert(item);
		if (n && w) this.nw.insert(item);
	}

	retrieve(
		rx: number,
		ry: number,
		rw: number,
		rh: number,
		result: Set<Item> = new Set()
	): Set<Item> {
		if (!this.intersects(
			this.x,
			this.y,
			this.width,
			this.height,
			rx,
			ry,
			rw,
			rh
		)) {
			return result;
		}

		if (this.items) {
			for (let i = 0; i < this.items.length; i++) {
				const item = this.items[i];
				if (
					this.intersects(
						item.x,
						item.y,
						item.width,
						item.height,
						rx,
						ry,
						rw,
						rh
					)
				) {
					result.add(item);
				}
			}
		}

		if (this.nw && this.ne && this.se && this.sw) {
			const midX = this.x + this.width / 2;
			const midY = this.y + this.height / 2;

			if (rx + rw > midX && ry < midY) {
				this.ne.retrieve(rx, ry, rw, rh, result);
			}
			if (rx + rw > midX && ry + rh > midY) {
				this.se.retrieve(rx, ry, rw, rh, result);
			}
			if (rx < midX && ry + rh > midY) {
				this.sw.retrieve(rx, ry, rw, rh, result);
			}
			if (rx < midX && ry < midY) {
				this.nw.retrieve(rx, ry, rw, rh, result);
			}
		}

		return result;
	}

	private intersects(
		ax: number, ay: number, aw: number, ah: number,
		bx: number, by: number, bw: number, bh: number
	): boolean {
		return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
	}
}