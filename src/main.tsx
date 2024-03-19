import React, {
	useEffect,
	useId,
	useLayoutEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import ReactDOM from "react-dom/client";
import { v2, type Vector2d } from "./v2";
import { makeTicker } from "./ticker";
import { GameLayout } from "./game-layout";
import {
	colours,
	BOARD_SIZE,
	bodies,
	MovementSystem,
	Bounds,
	CollisionSystem,
} from "./model";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Main></Main>
	</React.StrictMode>
);

function onEnable(canvas: HTMLCanvasElement | null) {
	if (!canvas) {
		throw "no canvas";
	}

	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw "no context";
	}

	let state = bodies(40);
	let gravity = v2(0, 0);

	let selId: number | null = null;

	const update = (t, dt) => {
		MovementSystem(gravity, dt, state);
		CollisionSystem(Bounds, state);
	};

	const render = () => {
		ctx.clearRect(0, 0, BOARD_SIZE.x, BOARD_SIZE.y);
		for (const { position, radius, colourIndex } of state) {
			ctx.beginPath();
			ctx.arc(position.x, position.y, radius, 0, 360);
			ctx.fillStyle = colours[colourIndex];
			ctx.fill();
		}
	};

	const ticker = makeTicker({
		fps: 30,
		update,
		render,
	});

	ticker.start();

	return ticker;
}

function diag(e, gameState, rect) {
	const { x, y } = v2(e.clientX - rect.left, e.clientY - rect.top);
	console.log({ x, y }, gameState);
}

function Main() {
	const checkboxId = useId();

	return (
		<GameLayout header={<h2>Bounce</h2>}>
			<Billiard backdropColor="#2f6d56" canvasDomSizing={BOARD_SIZE} />
		</GameLayout>
	);
}

function Billiard({
	backdropColor,
	canvasDomSizing,
}: {
	backdropColor: string;
	canvasDomSizing: Vector2d;
}) {
	// measure canvas
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [rect, setRect] = useState<DOMRect>();
	useLayoutEffect(() => {
		if (!canvasRef.current) return;

		const rect = canvasRef.current!.getBoundingClientRect();
		setRect(rect);
	}, [setRect]);

	const [absMousePosition, setAbsMousePosition] = useState<Vector2d>(v2(-100));

	useEffect(() => {
		onEnable(canvasRef.current);
	}, []);

	const handleMouseMove = (e) => {
		if (!rect) return;
		const mouseAbs = v2(e.clientX - rect.left, e.clientY - rect.top);

		// setAbsMousePosition(mouseAbs);
	};

	console.log("react render");
	return (
		<>
			<canvas
				style={{
					backgroundColor: backdropColor,
					maxWidth: canvasDomSizing.x,
					maxHeight: canvasDomSizing.y,
				}}
				onMouseMove={handleMouseMove}
				width={canvasDomSizing.x}
				height={canvasDomSizing.y}
				ref={canvasRef}
			></canvas>
		</>
	);
}
