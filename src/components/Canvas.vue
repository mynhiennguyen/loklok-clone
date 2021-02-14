<template>
  <div>
    <canvas
      id="canvas"
      @pointerdown="beginDrawing"
      @pointerup="stopDrawing"
      @pointermove="draw"
    >
    </canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Action, DrawingAction } from "../types/action";

export default defineComponent({
  name: "Canvas",
  props: {},

  data() {
    return {
      vueCanvas: null as CanvasRenderingContext2D,
      isDrawing: false,
      x: 0,
      y: 0,
      history: [] as Action[],
      redoStack: [] as Action[],
      currentAction: null as Action,
    };
  },
  mounted(): void {
    const canvas: HTMLElement = document.getElementById("canvas");
    const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext(
      "2d"
    );
    this.vueCanvas = context;

    window.addEventListener('resize', this.resizeCanvas) //TODO: resizing will reset entire canvas, drawing needs to be redrawn

    this.resizeCanvas();
  },
  methods: {
    beginDrawing(e: MouseEvent): void {
      console.log("begin")
      this.isDrawing = true;
      this.x = e.offsetX;
      this.y = e.offsetY;
      //init new DrawingAction
      if (this.currentAction == null) {
        this.currentAction = new DrawingAction("black", 1, this.vueCanvas);
      }
    },
    draw(e: MouseEvent): void {
      if (this.isDrawing && this.currentAction !== null) {
        //executes drawing and records all points
        this.currentAction.recordAndDrawSegment(
          this.x,
          this.y,
          e.offsetX,
          e.offsetY
        );
        this.x = e.offsetX;
        this.y = e.offsetY;
      }
    },
    stopDrawing(e: MouseEvent): void {
      if (this.isDrawing) {
        //save DrawingAction
        this.history.push(this.currentAction);
        this.currentAction = null;
        this.isDrawing = false;
      }
    },
    undo(): void {
      const lastAction: Action = this.history.pop();
      this.redoStack.push(lastAction);

      //clear canvas and redraw it
      this.vueCanvas.clearRect(
        0,
        0,
        this.vueCanvas.canvas.width,
        this.vueCanvas.canvas.height
      );
      this.history.forEach((action: Action) => {
        action.execute();
      });
    },
    resizeCanvas(): boolean {
      // look up the size the canvas is being displayed
      const canvas: HTMLCanvasElement = document.getElementById(
        "canvas"
      ) as HTMLCanvasElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // If it's resolution does not match change it
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }

      return false;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#canvas {
  background-color: silver;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
  touch-action: none;
}
</style>
