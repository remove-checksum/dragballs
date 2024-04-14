import { useEffect, useRef } from "react";
import { makeGameInstance, BOARD_SIZE } from "./model";
import { V2 } from "./math";
import useMeasure from "react-use-measure";

export function BilliardTable() {
	const [measureNode, rect] = useMeasure();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const gameRef = useRef<ReturnType<typeof makeGameInstance>>();

	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext("2d");

			if (!ctx) throw new Error("no canvas context");
			const instance = makeGameInstance(ctx);
			gameRef.current = instance;
			instance.start();
		}

		return () => {
			gameRef.current?.destroy();
		};
	}, []);

	const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
		if (!rect || !gameRef.current) {
			return;
		}

		const mouseAbs = new V2(e.clientX - rect.left, e.clientY - rect.top);
		gameRef.current.hitTest(mouseAbs);
	};

	return (
		<canvas
			onMouseMove={handleMouseMove}
			width={BOARD_SIZE.x}
			height={BOARD_SIZE.y}
			ref={(el) => {
				canvasRef.current = el;
				measureNode(el);
			}}
		/>
	);
}
