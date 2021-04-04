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
import { CanvasUI } from "@/types/interfaces/canvas";
import { Canvas2D } from "@/types/canvas2D";
import { UndoManager } from "@/types/undoManager";

export default defineComponent({
  name: "Canvas",
  props: {},

  data() {
    return {
      canvas: null as CanvasUI,
      undoManager: null as UndoManager,
      actionHandler: null as ActionHandler,
    };
  },
  computed: {
    lineThickness(): void {
      return this.$store.lineThickness
    }
  },
  mounted(): void {
    this.canvas = this.initCanvas();
    this.undoManager = this.initUndoManager(this.canvas);
    this.actionHandler = this.initActionHandler(this.canvas);

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
      this.actionHandler.startNewAction(ev);
    },
    handlePointerMove(ev: PointerEvent) {
      this.actionHandler.continueAction(ev);
    },
    handlePointerUp(ev: PointerEvent) {
      const finishedAction: Action = this.actionHandler.endAction(ev);
      this.undoManager.push(finishedAction);
    },
    initCanvas(): CanvasUI {
      const canvas: HTMLElement = document.getElementById("canvas");
      const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext(
        "2d"
      );
      this.resizeCanvas(); //sets height and width of canvas
      return new Canvas2D(context);
    },
    initUndoManager(canvas: CanvasUI): UndoManager {
      return new UndoManager(canvas);
    },
    initActionHandler(canvas: CanvasUI): ActionHandler {
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
