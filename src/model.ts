import {
	ballMass3d,
	randi,
	randomPointInBounds,
	vector2InBounds,
	V2,
	clamp,
	type PointLike,
} from "./math";
import { drawBall, makeGridImage } from "./render";
import { type TickerConfig, makeTicker } from "./ticker";

const BALLS_COUNT = 12;
export const BOARD_SIZE = new V2(1024, 600),
	CELL_SIZE = new V2(24, 24),
	BALL_RADIUS_MIN = 20,
	BALL_RADIUS_MAX = 35,
	BALL_DENSITY = 1.69,
	BALL_V_INITIAL_MIN = 0.05,
	BALL_V_INITIAL_MAX = 0.05,
	BALL_V_TERMINAL = new V2(2, 2),
	DECELERATION_FRACTION = 1.005;

// const GRAVITY = new V2(0, 0.0004);
export const BOUNDS_BOARD_LOWER = new V2(0, 0),
	BOUNDS_BOARD_UPPER = BOARD_SIZE;

export const COLOUR_BALLS = [
		"#001219",
		"#005f73",
		"#0a9396",
		"#ee9b00",
		"#ca6702",
		"#bb3e03",
		"#ae2012",
		"#9b2226",
	],
	COLOUR_BACKGROUND = "#94d2bd",
	COLOUR_TEXT = "#e9d8a6";

export type Body = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	mass: number;
	radius: number;
};

export type GameBall = Body & {
	colourIndex: number;
};

export function makeBodies(size: number): Array<GameBall> {
	if (size < 1) {
		throw new Error("size must be positive");
	}

	const MAX_SIZE = 48;

	if (size > MAX_SIZE) {
		throw new Error(
			`function likely to take a very long time with size > ${MAX_SIZE}`,
		);
	}

	const balls = [];

	const boundsLower = new V2(BALL_RADIUS_MAX);
	const boundsUpper = BOUNDS_BOARD_UPPER.subtract(boundsLower);
	const minCreationRange = BALL_RADIUS_MAX * 3;

	generate: while (balls.length < size) {
		const radius = randi(BALL_RADIUS_MIN, BALL_RADIUS_MAX);
		const point = randomPointInBounds(boundsLower, boundsUpper);

		for (let i = 0; i < balls.length; i++) {
			const other = balls[i];
			const distance = V2.distance(point, other);
			if (distance < minCreationRange) {
				continue generate;
			}
		}

		const velocity = vector2InBounds(BALL_V_INITIAL_MIN, BALL_V_INITIAL_MAX);

		balls.push({
			x: point.x,
			y: point.y,
			vx: velocity.x,
			vy: velocity.y,
			radius,
			mass: ballMass3d(radius),
			colourIndex: randi(0, COLOUR_BALLS.length - 1),
		});
	}

	return balls;
}

export function makeGameInstance(ctx: CanvasRenderingContext2D) {
	// sort balls by x component after creation
	const state = makeBodies(BALLS_COUNT).sort(
		(ballA, ballB) => ballA.x - ballB.x,
	);

	// game state
	let pointerAt = V2.pointLike(-100);
	let hitIndexLast = -1;
	const ballsCollidingNarrowIndices = new Set();
	const ballsIntersectingIndices = new Set();

	// TODO: suspend until background created
	let backgroundImage: CanvasImageSource | null = null;
	makeGridImage(BOARD_SIZE, CELL_SIZE, COLOUR_BACKGROUND).then(
		(image) => (backgroundImage = image),
	);

	const update: TickerConfig["update"] = (_t, dt, _updateCount) => {
		hitIndexLast = -1;
		ballsIntersectingIndices.clear();
		ballsCollidingNarrowIndices.clear();

		for (let i = 0; i < state.length; i++) {
			const ballRef = state[i];
			const lowerX = BOUNDS_BOARD_LOWER.x + ballRef.radius;
			const lowerY = BOUNDS_BOARD_LOWER.y + ballRef.radius;
			const upperX = BOUNDS_BOARD_UPPER.x - ballRef.radius;
			const upperY = BOUNDS_BOARD_UPPER.y - ballRef.radius;

			const x1 = ballRef.x + ballRef.vx * dt;
			const y1 = ballRef.y + ballRef.vy * dt;
			let vx1 = ballRef.vx;
			let vy1 = ballRef.vy;

			for (let hi = state.length - 1; hi >= 0; hi--) {
				const testBall = state[hi];
				if (V2.distance(pointerAt, testBall) < testBall.radius) {
					hitIndexLast = hi;
				}
			}

			// narrow phase
			for (let j = 0; j < state.length; j++) {
				if (j === i) continue;
				const otherBallRef = state[j];

				const ox1 = otherBallRef.x - otherBallRef.radius;
				const ox2 = otherBallRef.x + otherBallRef.radius;
				const tx1 = ballRef.x - ballRef.radius;
				const tx2 = ballRef.x + ballRef.radius;

				if (tx2 >= ox1 && ox2 >= tx1) {
					ballsCollidingNarrowIndices.add(j);
				}
			}

			// resolution
			// for (let ballIndex of ballsCollidingNarrowIndices) {
			// 	let otherBall = state[ballIndex as number];
			// 	let centerDistance = Math.hypot(
			// 		Math.abs(ballRef.x - otherBall.x),
			// 		Math.abs(ballRef.y - otherBall.y),
			// 	);
			//
			// 	let radii = ballRef.radius + otherBall.radius;
			//
			// 	if (centerDistance < radii) {
			// 		ballsIntersectingIndices.add(ballIndex);
			// 	}
			// }

			if (x1 < lowerX) {
				ballRef.x = lowerX;
				vx1 *= -1;
			}
			if (x1 > upperX) {
				ballRef.x = upperX;
				vx1 *= -1;
			}
			if (y1 < lowerY) {
				ballRef.y = lowerY;
				vy1 *= -1;
			}
			if (y1 > upperY) {
				ballRef.y = upperY;
				vy1 *= -1;
			}

			ballRef.vx = clamp(vx1, -BALL_V_TERMINAL.x, BALL_V_TERMINAL.x);
			ballRef.vy = clamp(vy1, -BALL_V_TERMINAL.y, BALL_V_TERMINAL.y);
			ballRef.x = x1;
			ballRef.y = y1;
		}
	};

	// ctx.globalCompositeOperation = "hard-light";
	// ctx.imageSmoothingEnabled = true;
	// ctx.imageSmoothingQuality = "high";
	const render: TickerConfig["render"] = (_t, _dt, _updateCount) => {
		if (backgroundImage !== null) {
			ctx.drawImage(backgroundImage, 0, 0, BOARD_SIZE.x, BOARD_SIZE.y);
		} else {
			ctx.fillStyle = "green";
			ctx.fillRect(0, 0, BOARD_SIZE.x, BOARD_SIZE.y);
		}

		for (let bi = 0; bi < state.length; bi++) {
			const ball = state[bi];
			const pointerHits = hitIndexLast >= 0 && bi === hitIndexLast;
			const intersects = ballsIntersectingIndices.has(bi);
			const colour =
				pointerHits || intersects
					? COLOUR_TEXT
					: COLOUR_BALLS[ball.colourIndex];

			drawBall(ctx, ball, colour);

			if (import.meta.env.DEV) {
				ctx.fillStyle = COLOUR_TEXT;
				ctx.font = "bold 24px monospace";
				ctx.fillText(bi.toString(), ball.x - 8, ball.y + 12);
				ctx.restore();
			}
		}
	};

	const renderOnce = render.bind(null, 0, 0, 0, 0);
	const hitTest = (hit: PointLike) => {
		pointerAt = hit;
	};
	const destroy = () => {
		ticker.stop();
		ctx.clearRect(0, 0, BOARD_SIZE.x, BOARD_SIZE.y);
	};

	const ticker = makeTicker({
		fps: 60,
		update,
		render,
	});

	return {
		start: ticker.start,
		stop: ticker.stop,
		hitTest,
		destroy,
		renderOnce,
	};
}
