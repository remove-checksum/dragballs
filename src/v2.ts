export interface PointLike {
	x: number;
	y: number;
}

export type Vector2d = _v2;
class _v2 implements PointLike {
	constructor(public x: number, public y: number) {}

	scale(n: number) {
		return new _v2(this.x * n, this.y * n);
	}

	static from(p: PointLike) {
		return new _v2(p.x, p.y);
	}

	add(next: PointLike) {
		return new _v2(this.x + next.x, this.y + next.y);
	}

	subtract(next: PointLike) {
		return new _v2(this.x - next.x, this.y - next.y);
	}

	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	divide(n: number) {
		if (n === 0) throw new Error("division by zero");

		return new _v2(this.x / n, this.y / n);
	}

	multiply(next: PointLike) {
		return new _v2(this.x * next.x, this.y * next.y);
	}
}

export function v2(x: number, y = x) {
	return new _v2(x, y);
}

v2.from = _v2.from;
