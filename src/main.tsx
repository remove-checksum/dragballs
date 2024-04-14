import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	StrictMode,
} from "react";
import ReactDOM from "react-dom/client";
import { GameLayout } from "./game-layout";
import { BOARD_SIZE, makeGameInstance } from "./model";
import { V2, type PointLike } from "./math";

const root = document.getElementById("root");

if (root === null) {
	throw new Error("no root");
}

ReactDOM.createRoot(root).render(
	<StrictMode>
		<Main />
	</StrictMode>,
);

function Main() {
	return (
		<GameLayout header={<h2>Bounce</h2>}>
			<BilliardTable backdropColor="#2f6d56" canvasDomSizing={BOARD_SIZE} />
		</GameLayout>
	);
}

function BilliardTable({
	backdropColor,
	canvasDomSizing,
}: {
	backdropColor: string;
	canvasDomSizing: PointLike;
}) {
	// measure canvas
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [rect, setRect] = useState<DOMRect>();

	useLayoutEffect(() => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			setRect(rect);
			console.log('settingrect')
		}
	}, []);

	// const [absMousePosition, setAbsMousePosition] = useState(new V2(-100));
	const hitTestCb = useRef<(hit: PointLike) => void>()

	useEffect(() => {
		if (!canvasRef.current) {
			console.error("no canvas element");
			return
		}

		const { ticker, destroy, hitTest } = makeGameInstance(canvasRef.current);
		hitTestCb.current = hitTest

		const handleMouseMove = (e) => {
			if (!rect) { return }

			const mouseAbs = new V2(e.clientX - rect.left, e.clientY - rect.top)
			console.log('hmousemouve', 'x: ', mouseAbs.x, 'y: ', mouseAbs.y)
			hitTest(mouseAbs)
		}

		canvasRef.current.addEventListener("mousemove", handleMouseMove)
		ticker.start()

		return () => {
			destroy()
			canvasRef.current?.removeEventListener("mousemove", handleMouseMove)
		}
	}, [rect]);

	// const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
	//   if (!rect) return;
	//   const mouseAbs = new V2(e.clientX - rect.left, e.clientY - rect.top);
	//   if (typeof hitTestCb.current === 'function') {
	//     console.log(mouseAbs)
	//     hitTestCb.current(mouseAbs)
	//   }
	// };

	console.log("react render");
	return (
		<>
			<canvas
				style={{
					backgroundColor: backdropColor,
					maxWidth: canvasDomSizing.x,
					maxHeight: canvasDomSizing.y,
				}}
				// onMouseMove={handleMouseMove}
				width={canvasDomSizing.x}
				height={canvasDomSizing.y}
				ref={canvasRef}
			/>
		</>
	);
}

