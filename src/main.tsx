import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { v2, type Vector2d } from "./v2";
import { makeTicker } from "./ticker";
import { makeStruct } from "./helpers";
// import App from './App.tsx'
// import './index.css

const CWidth = 1280;
const CHeight = 729;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main
      onEnable={onEnable}
      canvasDomSizing={v2(CWidth, CHeight)}
      backdropColor={`#bada55`}
    ></Main>
  </React.StrictMode>
);

type VoidFn = (...args: any) => void;

type GameProps = {
  onEnable: VoidFn;
  canvasDomSizing: Vector2d;
  backdropColor: string;
};

function randi(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const colours = ["red", "orange", "tan", "rebeccapurple", "silver"];

function initState(ballCount: number) {
  const balls = makeStruct(
    ["radius", "x", "y", "colourIndex"],
    Uint32Array,
    ballCount
  );

  let greatestRadius = 0;

  for (let i = 0; i < ballCount; i++) {
    const radius = randi(20, 40);
    balls.radius[i] = radius;

    if (radius > greatestRadius) {
      greatestRadius = radius;
    }
  }

  for (let i = 0; i < ballCount; i++) {
    balls.x[i] = randi(greatestRadius, CWidth - greatestRadius);
    balls.y[i] = randi(greatestRadius, CHeight - greatestRadius);
    balls.colourIndex[i] = randi(0, colours.length);
  }

  return {
    balls,
    length: ballCount,
  };
}

function onEnable(canvas: HTMLCanvasElement | null) {
  if (!canvas) {
    throw "no canvas"
  }
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw "no context"
  }

  const state = initState(12);

  function update() {}

  console.log(state.balls.x);
  console.log(state.balls.y);

  function render() {
    for (let index = 0; index < state.length; index++) {
      const x = state.balls.x[index];
      const y = state.balls.y[index];
      const radius = state.balls.radius[index];
      const colourIndex = state.balls.colourIndex[index];

      // ctx!.fillRect(actualx, actualy, radius, radius);

      ctx!.beginPath();
      ctx!.arc(x, y, radius, 0, 100);
      ctx!.fillStyle = colours[colourIndex];
      ctx!.fill();
    }
  }

  const ticker = makeTicker({
    fps: 60,
    update,
    render,
  });

  render();
}


function Main({ onEnable, canvasDomSizing, backdropColor }: GameProps) {
  const canvasElement = useRef<HTMLCanvasElement | null>(null);

  return (
    <canvas
      style={{
        backgroundColor: backdropColor,
      }}
      width={canvasDomSizing.x}
      height={canvasDomSizing.y}
      ref={onEnable}
    ></canvas>
  );
}
