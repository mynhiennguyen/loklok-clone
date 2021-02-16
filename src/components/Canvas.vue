<template>
  <div>
    <canvas
      id="canvas"
      @pointerdown="beginDrawing"
      @pointerup="stopDrawing"
      @pointermove="draw"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
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
      tpCache: [],
    };
  },
  mounted(): void {
    const canvas: HTMLElement = document.getElementById("canvas");
    const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext(
      "2d"
    );
    this.vueCanvas = context;
    this.resizeCanvas();

    window.addEventListener("resize", this.resizeCanvas); //TODO: resizing will reset entire canvas, drawing needs to be redrawn
  },
  methods: {
    beginDrawing(e: MouseEvent): void {
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
        this.redoStack = []; //once new drawing is added, clear redoStack
      }
    },
    undo(): void {
      if (this.history.length > 0) {
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
      }
    },
    redo(): void {
      if (this.redoStack.length > 0) {
        const lastAction: Action = this.redoStack.pop();
        this.history.push(lastAction);
        lastAction.execute();
      }
    },
    resizeCanvas(): void {
      // look up the size the canvas is being displayed
      const canvas: HTMLCanvasElement = document.getElementById(
        "canvas"
      ) as HTMLCanvasElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // If its resolution does not match change it
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    },
    handleTouchStart(ev: TouchEvent) {
      ev.preventDefault();
      // Check this event for 2-touch Move/Pinch/Zoom gesture
      if (ev.targetTouches.length == 2) {
        for (let i = 0; i < ev.targetTouches.length; i++) {
          this.tpCache.push(ev.targetTouches[i]);
        }
      }
    },
    handleTouchMove(ev) {
      ev.preventDefault();
      if (!(ev.touches.length == 2 && ev.targetTouches.length == 2))
        // Check this event for 2-touch Move/Pinch/Zoom gesture
        this.handlePinchZoom(ev);
    },
    handlePinchZoom(ev) {
      if (ev.targetTouches.length == 2 && ev.changedTouches.length == 2) {
        console.log("pass")
        // Check if the two target touches are the same ones that started
        // the 2-touch
        let point1 = -1,
          point2 = -1;
        for (let i = 0; i < this.tpCache.length; i++) {
          if (this.tpCache[i].identifier == ev.targetTouches[0].identifier)
            point1 = i;
          if (this.tpCache[i].identifier == ev.targetTouches[1].identifier)
            point2 = i;
        }
        if (point1 >= 0 && point2 >= 0) {
          // Calculate the difference between the start and move coordinates
          const diff1 = Math.abs(
            this.tpCache[point1].clientX - ev.targetTouches[0].clientX
          );
          const diff2 = Math.abs(
            this.tpCache[point2].clientX - ev.targetTouches[1].clientX
          );

          // This threshold is device dependent as well as application specific
          const PINCH_THRESHOLD = ev.target.clientWidth / 10;
          if (diff1 >= PINCH_THRESHOLD && diff2 >= PINCH_THRESHOLD)
            console.log("pinch");
        } else {
          // empty tpCache
          this.tpCache = [];
        }
      }
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
