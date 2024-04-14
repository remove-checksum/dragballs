import { type PointLike, clamp, distance, V2 } from "./math";
import { type Body, DECELERATION_FRACTION, BALL } from "./model";

// export function CollisionSystem(
// 	bounds: [V2, V2],
// 	bodiesRef: Body[],
// ) {
// 	for (let i = 0; i < bodiesRef.length; i++) {
// 		const bodyRef = bodiesRef[i];
// 		reflectBounds(bounds, bodyRef);
//
// 		for (let j = 0; j < bodiesRef.length; j++) {
// 			const otherRef = bodiesRef[j];
//
// 			if (otherRef === bodyRef) {
// 				continue;
// 			}
//
// 			const pen = circlesIntersect(
// 				V2.from(bodyRef),
// 				bodyRef.radius,
// 				V2.from(otherRef),
// 				otherRef.radius,
// 			);
// 		}
// 	}
// }

// export function MovementSystem(
// 	gravity: PointLike,
// 	dt: number,
// 	bodiesRef: Array<Body>,
// ) {
// 	for (let i = 0; i < bodiesRef.length; i++) {
// 		const body = bodiesRef[i];
// 		const change = new V2(body.vx, body.vy).add(gravity).scale(dt);
//
// 		body.x += change.x;
// 		body.y += change.y;
// 	}
// }

// export function reflectBounds(bounds: typeof BOUNDS.board, bodyRef: Body) {
// 	let x = bodyRef.x;
// 	let y = bodyRef.y;
// 	let vx = bodyRef.vx;
// 	let vy = bodyRef.vy;
// 	const lowerX = bounds.lower.x + bodyRef.radius;
// 	const lowerY = bounds.lower.y + bodyRef.radius;
// 	const upperX = bounds.upper.x - bodyRef.radius;
// 	const upperY = bounds.upper.y - bodyRef.radius;
//
// 	if (x < lowerX) {
// 		x = lowerX;
// 		vx = vx * -1 * DECELERATION_FRACTION;
// 	}
// 	if (x > upperX) {
// 		x = upperX;
// 		vx = vx * -1 * DECELERATION_FRACTION;
// 	}
// 	if (y < lowerY) {
// 		y = lowerY;
// 		vy = vy * -1 * DECELERATION_FRACTION;
// 	}
// 	if (y > upperY) {
// 		y = upperY;
// 		vy = vy * -1 * DECELERATION_FRACTION;
// 	}
//
// 	const vel = new V2(
// 		clamp(vx, -BALL.V_TERMINAL.x, BALL.V_TERMINAL.x),
// 		clamp(vy, -BALL.V_TERMINAL.y, BALL.V_TERMINAL.y),
// 	);
//
// 	bodyRef.x = x;
// 	bodyRef.y = y;
// 	bodyRef.vx = vel.x;
// 	bodyRef.vy = vel.y;
// }
