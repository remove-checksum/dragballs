type TickerConfig = {
  fps: number;
  update: (t: number, dt: number) => void;
  render: (t: number, dt: number) => void;
};

export function makeTicker({ fps, update, render }: TickerConfig) {
  let t = 0;
  let dt = 1 / fps;

  let now = performance.now();
  let accum = 0;

  let loopRunning = false;
  let rafHandle: number | undefined;

  function Ticker(newNow: number) {
    rafHandle = requestAnimationFrame(Ticker);

    const frameTime = newNow - now;
    now = newNow;

    accum += frameTime;
    let updatedThisFrame = false;

    while (accum >= dt) {
      update(t, dt);
      accum -= dt;
      t += dt;
      updatedThisFrame = true;
    }
    if (updatedThisFrame) {
      render(t, dt);
    }
  }

  return {
    isRunning: loopRunning,
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
