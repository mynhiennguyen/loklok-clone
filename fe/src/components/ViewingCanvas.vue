<template>
  <div>
    <Canvas
    ></Canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Action } from "../types/interfaces/action";
import { InputStateManager } from "../types/inputStateManager";
import { CanvasUI } from "../types/interfaces/canvas";
import { Canvas2D } from "../types/canvas2D";
import Canvas from "./Canvas.vue";
import {
  Message,
  MessageDecoder,
  MessageType,
} from "../types/messages/message";

export default defineComponent({
  name: "ViewingCanvas",
  props: {},
  components: {
    Canvas
  },

  data() {
    return {
      canvas: (null as unknown) as CanvasUI,
      backgroundCanvas: (null as unknown) as CanvasUI,
      backgroundImage: "rgba(210, 210, 210, 0.75)",
      ws: (null as unknown) as WebSocket,
    };
  },
  mounted(): void {
    if (process.env.NODE_ENV === "development") {
      this.ws = new WebSocket("ws://localhost:3000");
    } else {
      this.ws = new WebSocket("wss://loklok-clone.herokuapp.com/");
    }

    this.canvas = this.initCanvas("mainCanvas");
    this.backgroundCanvas = this.initCanvas("backgroundCanvas");

    // Websocket commmunication
    this.ws.onmessage = (msg: any) => {
      const action: Action = MessageDecoder.parse(
        msg.data,
        this.canvas,
        this.backgroundCanvas,
        this.ws
      );
      action.execute(this);
    };

    window.addEventListener("resize", () => {
      this.resizeCanvas("mainCanvas");
      this.resizeCanvas("backgroundCanvas");
    }); //TODO: resizing will reset entire canvas, drawing needs to be redrawn
  },
  methods: {
    resizeCanvas(id: string): void {
      // look up the size the canvas is being displayed
      const canvas: HTMLCanvasElement = document.getElementById(
        id
      ) as HTMLCanvasElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // If its resolution does not match change it
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    },
    initCanvas(id: string): CanvasUI {
      const canvas: HTMLElement = document.getElementById(id)!;
      const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext(
        "2d"
      )!;
      this.resizeCanvas(id); //sets height and width of canvas
      return new Canvas2D(context);
    },
    setActiveUsers(activeUsers: Record<string, string>[]) {
      // do nothing
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
