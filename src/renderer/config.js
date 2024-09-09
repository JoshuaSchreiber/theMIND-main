import { canvas } from "../canvas"

let hexRadius = 50

export const config = {
  boardHeight: canvas.height,
  boardWidth: canvas.width,
  hexRadius: hexRadius,
  canvasYDistance: 1.5 * hexRadius,
  canvasXDistance: hexRadius * Math.sqrt(3),
}
