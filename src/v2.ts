export interface Vector2d {
  x: number;
  y: number;
}

class _v2 implements Vector2d {
  constructor(public x: number, public y: number) {}

  scale(n: number) {
    return new _v2(this.x * n, this.y * n);
  }

  add(next: Vector2d) {
    return new _v2(this.x + next.x, this.y + next.y);
  }
}

export function v2(x: number, y = x) {
  return new _v2(x, y);
}
