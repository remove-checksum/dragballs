import { PointLike } from "./math";
import { Body } from "./model";

export async function makeGridImage(
	canvasSize: PointLike,
	cellSize: PointLike,
	backgroundColor: string,
) {
	const elem = document.createElement("canvas");
	elem.width = canvasSize.x;
	elem.height = canvasSize.y;

	const ctx = elem.getContext("2d");

	if (ctx === null) {
		throw "no context";
	}

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
	for (let i = cellSize.x; i < canvasSize.x; i += cellSize.x) {
		i = Math.floor(i) + 0.5;
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvasSize.y);
		ctx.stroke();
	}

	for (let i = cellSize.y; i < canvasSize.y; i += cellSize.y) {
		i = Math.floor(i) + 0.5;
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(canvasSize.x, i);
		ctx.stroke();
	}

	return createImageBitmap(elem);
}

export function drawBall(
	ctx: CanvasRenderingContext2D,
	ball: Body,
	colour: string,
) {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, 360);
	ctx.fillStyle = colour;
	ctx.fill();
	ctx.restore();
}
