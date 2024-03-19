import { PointLike, Vector2d, v2 } from "./v2";

export function clamp(val: number, min: number, max: number) {
	return Math.min(Math.max(val, min), max);
}

export function randi(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randf(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function randomPointInBounds({ lower, upper }: typeof Bounds) {
	return v2(randi(lower.x, upper.x), randi(lower.y, upper.y));
}

export const BOARD_SIZE = v2(1024, 600);
const BALL_RADIUS_MIN = 30;
const BALL_RADIUS_MAX = 40;

export const colours = [
	"aqua",
	"orange",
	"crimson",
	"tan",
	"rebeccapurple",
	"gold",
];

type Body = {
	position: PointLike;
	velocity: PointLike;
};

export const Bounds = {
	lower: v2(BALL_RADIUS_MAX),
	upper: BOARD_SIZE.subtract(v2(BALL_RADIUS_MAX)),
};

export function bodies(
	size: number
): Array<Body & { colourIndex: number; radius: number }> {
	if (size < 1) {
		throw new Error("size must be positive");
	}

	const MAX_SIZE = 48;

	if (size > MAX_SIZE) {
		throw new Error(
			`function likely to take a very long time with size > ${MAX_SIZE}`
		);
	}

	let balls = [];

	generate: while (balls.length < size) {
		let radius = randi(BALL_RADIUS_MIN, BALL_RADIUS_MAX);
		let position = randomPointInBounds(Bounds);

		for (let i = 0; i < balls.length; i++) {
			let other = balls[i];
			let distance = position.subtract(other.position).magnitude();
			if (distance < BALL_RADIUS_MAX * 2) {
				continue generate;
			}
		}

		let ball = {
			position,
			radius,
			colourIndex: randi(0, colours.length),
			velocity: v2(randf(-0.3, 0.3), randf(-0.3, 0.3)),
		};
		balls.push(ball);
	}

	return balls;
}

export function MovementSystem(gravity: PointLike, dt: number, bods: Body[]) {
	for (let i = 0; i < bods.length; i++) {
		const pos = v2.from(bods[i].position);
		const change = v2.from(bods[i].velocity).add(gravity).scale(dt);
		const next = pos.add(change);
		bods[i].position = next;
	}
}

export function CollisionSystem({ lower, upper }: typeof Bounds, bods: Body[]) {
	const decelFractionOnHit = 0.05;
	for (let i = 0; i < bods.length; i++) {
		const vx = bods[i].velocity.x;
		const vy = bods[i].velocity.y;

		if (bods[i].position.x < lower.x) {
			bods[i].velocity.x = -vx + vx * decelFractionOnHit;
			bods[i].position.x = lower.x;
		}
		if (bods[i].position.y < lower.y) {
			bods[i].velocity.y = -vy + vy * decelFractionOnHit;
			bods[i].position.y = lower.y;
		}
		if (bods[i].position.x > upper.x) {
			bods[i].velocity.x = -vx + vx * decelFractionOnHit;
			bods[i].position.x = upper.x;
		}
		if (bods[i].position.y > upper.y) {
			bods[i].velocity.y = -vy + vy * decelFractionOnHit;
			bods[i].position.y = upper.y;
		}
	}
}
