export interface PointLike {
	x: number;
	y: number;
}

export function clamp(val: number, min: number, max: number) {
	return Math.min(Math.max(val, min), max);
}

export function randi(min: number, max: number) {
	return (Math.random() * (max - min + 1) + min) | 0;
}

export function randf(min: number, max: number) {
	min = Math.fround(min);
	max = Math.fround(max);
	return Math.fround(Math.fround(Math.random()) * (max - min) + min);
}

export function rand(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function randomPointInBounds(lower: PointLike, upper: PointLike) {
	return new V2(randi(lower.x, upper.x), randi(lower.y, upper.y));
}

export function randSign() {
	return Math.random() < 0.5 ? -1 : 1;
}

export function circleArea(radius: number) {
	return Math.PI * (radius * radius);
}

export function ballMass3d(radius: number) {
	return (4 * Math.PI * (radius * 2) ** 3) / 3;
}

export function floatEqual(f1: number, f2: number) {
	return Math.abs(f2 - f1) < Number.EPSILON;
}

export function distance(p1: PointLike, p2: PointLike) {
	return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function vector2InBounds(from: number, to: number) {
	return new V2(randSign() * rand(from, to));
}

export class V2 implements PointLike {
	constructor(
		public x: number,
		public y = x,
	) {}

	scale(n: number) {
		return new V2(this.x * n, this.y * n);
	}

	add(next: PointLike) {
		return new V2(this.x + next.x, this.y + next.y);
	}

	subtract(next: PointLike) {
		return new V2(this.x - next.x, this.y - next.y);
	}

	magnitude() {
		return Math.hypot(this.x + this.y);
	}

	normalized() {
		const len = this.magnitude();
		if (len === 0) {
			return V2.zero();
		}
		return new V2(this.x / len, this.y / len);
	}

	divide(n: number) {
		if (n === 0) throw new Error("division by zero");

		return new V2(this.x / n, this.y / n);
	}

	multiply(next: PointLike) {
		return new V2(this.x * next.x, this.y * next.y);
	}

	clamp(min: number, max: number) {
		return new V2(clamp(this.x, min, max), clamp(this.y, min, max));
	}

	static distance(v1: PointLike, v2: PointLike) {
		return Math.hypot(Math.abs(v2.x - v1.x) + Math.abs(v2.y - v1.y));
	}

	static create(x: number, y: number) {
		return new V2(x, y);
	}

	static from(p: PointLike) {
		return new V2(p.x, p.y);
	}

	static zero() {
		return new V2(0, 0);
	}

	static one() {
		return new V2(1, 1);
	}

	static max() {
		return new V2(Number.MAX_VALUE, Number.MAX_VALUE);
	}

	static pointLike(x: number, y = x) {
		return { x, y };
	}
}

export function circlesIntersect(
	c1: PointLike,
	r1: number,
	c2: PointLike,
	r2: number,
): { normal: PointLike; depth: number } | false {
	let normal = V2.zero();
	let depth = 0.0;

	const dist = distance(c1, c2);
	const radii = r1 + r2;

	if (Math.abs(dist - radii) < 0) {
		return false;
	}

	normal = V2.from(c1).subtract(c2).normalized();
	depth = radii - dist;

	return { normal, depth };
}
