<template>
  <div>
    <canvas
      id="canvas"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    >
    </canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Action } from "../types/interfaces/action";
import { DrawingAction } from "../types/drawingAction";
import { Canvas } from "@/types/interfaces/canvas";
import { Canvas2D } from "@/types/canvas2D";
import { UndoManager } from "@/types/undoManager";

export default defineComponent({
  name: "Canvas",
  props: {},

  data() {
    return {
      canvas: null as Canvas,
      undoManager: null as UndoManager,
      isDrawing: false,
      x: 0,
      y: 0,
      currentAction: null as Action,
      touchPointCache: [] as number[],
    };
  },
  mounted(): void {
    this.canvas = this.initCanvas();
    this.undoManager = this.initUndoManager(this.canvas);

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
        this.currentAction = new DrawingAction("black", 1, this.canvas);
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
        this.undoManager.push(this.currentAction);
        this.currentAction = null;
        this.isDrawing = false;
      }
    },
    undo(): void {
      this.undoManager.undo();
    },
    redo(): void {
      this.undoManager.redo();
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
    handlePointerDown(ev: PointerEvent) {
      ev.preventDefault();
      this.beginDrawing(ev);
      if (ev.pointerType == "touch") {
        this.touchPointCache.push(ev.pointerId);
      }
    },
    handlePointerMove(ev: PointerEvent) {
      ev.preventDefault();
      if (this.touchPointCache.length >= 2) {
        //TODO: Erase-mode
        document.getElementById("toolbar").style.backgroundColor = "blue";
      } else {
        this.draw(ev);
      }
    },
    handlePointerUp(ev: PointerEvent) {
      ev.preventDefault();
      this.stopDrawing(ev);
      if (ev.pointerType == "touch") {
        //remove from cache
        const index = this.touchPointCache.indexOf(ev.pointerId);
        this.touchPointCache.splice(index, 1);
      }
      if (this.touchPointCache.length <= 1) {
        //TODO: Erase-mode done
        document.getElementById("toolbar").style.backgroundColor = "sandybrown";
      }
    },
    initCanvas(): Canvas {
      const canvas: HTMLElement = document.getElementById("canvas");
      const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext(
        "2d"
      );
      return new Canvas2D(context);
    },
    initUndoManager(canvas: Canvas): UndoManager{
      return new UndoManager(canvas);
    }
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
