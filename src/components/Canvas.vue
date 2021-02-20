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
import { ActionHandler } from "../types/actionHandler";
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
      actionHandler: null as ActionHandler,
      touchPointCache: [] as PointerEvent[],
    };
  },
  mounted(): void {
    this.canvas = this.initCanvas();
    this.undoManager = this.initUndoManager(this.canvas);
    this.actionHandler = this.initActionHandler(this.canvas);

    this.resizeCanvas(); //TODO: move to initCanvas
    window.addEventListener("resize", this.resizeCanvas); //TODO: resizing will reset entire canvas, drawing needs to be redrawn
  },
  methods: {
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
      
      if (ev.pointerType == "touch") {
        this.touchPointCache.push(ev);
      }
      if (this.touchPointCache.length == 2) {
        //if two touchpoints
        //start erasing action
        //new erasing action
        //lineWidth
        this.actionHandler.startErasing(ev, this.touchPointCache);
      }
      else {
        this.actionHandler.beginDrawing(ev);
      }
    },
    handlePointerMove(ev: PointerEvent) {
      ev.preventDefault();
      if (this.touchPointCache.length == 2) {
        //TODO: Erase-mode
        document.getElementById("toolbar").style.backgroundColor = "blue";
        this.actionHandler.erase(ev, this.touchPointCache);
      } else {
        this.actionHandler.draw(ev);
      }
    },
    handlePointerUp(ev: PointerEvent) {
      ev.preventDefault();

      const finishedAction: Action = this.actionHandler.stopDrawing(ev);
      this.undoManager.push(finishedAction);

      if (ev.pointerType == "touch") {
        //remove from cache
        this.touchPointCache = this.touchPointCache.filter(x => x.pointerId !== ev.pointerId)
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
    initUndoManager(canvas: Canvas): UndoManager {
      return new UndoManager(canvas);
    },
    initActionHandler(canvas: Canvas): ActionHandler {
      return new ActionHandler(canvas);
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
