<template>
<div>
  <canvas id="canvas" @mousedown="beginDrawing" @mouseup="stopDrawing" @mousemove="draw" width="1000" height="750">
  </canvas>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Action, DrawingAction } from '../types/action';

export default defineComponent({
  name: 'Canvas',
  props: {
  },

  data() {
    return {
      vueCanvas: null as CanvasRenderingContext2D,
      isDrawing: false,
      x: 0,
      y: 0,
      history: [] as Action[],
      redoStack: [] as Action[],
      currentAction: null as Action
    }
  },
  mounted(): void {
    const canvas: HTMLElement = document.getElementById("canvas");
    const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext("2d");
    this.vueCanvas = context;
  },
  methods: {
    beginDrawing(e: MouseEvent): void {
      this.isDrawing = true;
      this.x = e.offsetX;
      this.y = e.offsetY;
      //init new DrawingAction
      if(this.currentAction == null){
        this.currentAction = new DrawingAction('black', 1, this.vueCanvas)
      }
    },
    draw(e: MouseEvent): void {
      if(this.isDrawing && this.currentAction !== null){
        //executes drawing and records all points
        this.currentAction.recordAndDrawSegment(this.x, this.y, e.offsetX, e.offsetY)
        this.x = e.offsetX;
        this.y = e.offsetY
      }
    },
    stopDrawing(e: MouseEvent): void {
    if (this.isDrawing) {
      //save DrawingAction
      this.history.push(this.currentAction)
      this.currentAction = null;
      this.isDrawing = false;
    }
    },
    undo(): void {
      const lastAction: Action = this.history.pop()
      this.redoStack.push(lastAction)

      //clear canvas and redraw it
      this.vueCanvas.clearRect(0, 0, this.vueCanvas.canvas.width, this.vueCanvas.canvas.height);
      this.history.forEach((action: Action) => {
        action.execute()
      });
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#canvas {
  background-color: silver;
  height: 750px;
  width: 100%;
}
</style>
