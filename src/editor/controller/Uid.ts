export class Uid {
	private fixed = new Set<string>();

	private temp = new Set<string>();

	reg(uid: string): string {
		if (this.isExist(uid)) throw new Error(`Duplicate uid: ${uid}`);
		this.fixed.add(uid);
		return uid;
	}

	get(): string {
		let uid;
		do {uid = this.gen();}
		while (this.isExist(uid));

		this.temp.add(uid);
		return uid;
	}

	del(uid: string): void {
		this.temp.delete(uid);
		this.fixed.delete(uid);
	}

	private isExist(uid: string): boolean {
		return this.temp.has(uid) || this.fixed.has(uid);
	}

	private gen(): string {
		const letters = "abcdefghijklmnopqrstuvwxyz";
		let result = "";
		for (let i = 0; i < 4; i++) {
			result += letters
				.charAt(Math.floor(Math.random() * letters.length));
		}
		return result;
	}

}