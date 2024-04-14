export type TickerConfig = {
	fps: number;
	update: (t: number, dt: number, updateCount: number, renderCount: number) => void;
	render: (t: number, dt: number, updateCount: number, renderCount: number) => void;
};

export function makeTicker({ fps, update, render }: TickerConfig) {
	let t = 0.0;
	const dt = 1000.0 / fps;

	let now = performance.now();
	let accum = 0.0;

	let loopRunning = false;
	let rafHandle: number | undefined;

	let updateCount = 0;
	let renderCount = 0;

	function Ticker(newNow: number) {
		rafHandle = requestAnimationFrame(Ticker);

		let frameTime = newNow - now;
		now = newNow;

		if (frameTime > 3000) frameTime = dt;

		accum += frameTime;
		let updatedThisFrame = false;

		while (accum >= dt) {
			update(t, dt, updateCount, renderCount);
			updateCount += 1;
			accum -= dt;
			t += dt;
			updatedThisFrame = true;
		}
		if (updatedThisFrame) {
			render(t, dt, updateCount, renderCount);
			renderCount += 1;
		}
	}

	return {
		get updateCount() {
			return updateCount;
		},
		get renderCount() {
			return renderCount;
		},
		get isRunning() {
			return loopRunning;
		},
		start: () => {
			loopRunning = true;
			rafHandle = requestAnimationFrame(Ticker);
		},
		stop: () => {
			loopRunning = false;
			if (rafHandle) {
				cancelAnimationFrame(rafHandle);
			}
		},
	};
}
