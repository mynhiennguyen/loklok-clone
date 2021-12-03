<template>
  <div>
    <canvas
      id="canvas"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      :style="{ background: backgroundImage }"
    >
    </canvas>
    <active-users-display :activeUsers="activeUsers"></active-users-display>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ActiveUsersDisplay from "./ActiveUsersDisplay.vue";
import { Action } from "../types/interfaces/action";
import { InputStateManager } from "../types/inputStateManager";
import { CanvasUI } from "../types/interfaces/canvas";
import { Canvas2D } from "../types/canvas2D";
import { ClearAction } from "../types/actions/clearAction";
import {
  Message,
  MessageDecoder,
  MessageType,
} from "../types/messages/message";
import { Color } from "../options";

export default defineComponent({
  name: "Canvas",
  props: {},
  components: {
    ActiveUsersDisplay,
  },

  data() {
    return {
      canvas: (null as unknown) as CanvasUI,
      inputStateManager: (null as unknown) as InputStateManager,
      backgroundImage: "silver",
      ws: (null as unknown) as WebSocket,
      activeUsers: [] as Record<string, string>[],
    };
  },
  computed: {
    lineThickness(): void {
      return this.$store.state.lineThickness;
    },
  },
  mounted(): void {
    if (process.env.NODE_ENV === "development") {
      this.ws = new WebSocket("ws://localhost:3000");
    } else {
      this.ws = new WebSocket("wss://loklok-clone.herokuapp.com/");
    }

    this.canvas = this.initCanvas();
    this.inputStateManager = this.initInputStateManager(this.canvas, this.ws);

    // Websocket commmunication
    this.ws.onmessage = (msg: any) => {
      const action: Action = MessageDecoder.parse(
        msg.data,
        this.canvas,
        this.ws
      );
      action.execute(this);
    };

    window.addEventListener("resize", this.resizeCanvas); //TODO: resizing will reset entire canvas, drawing needs to be redrawn
  },
  methods: {
    undo(): void {
      const msg: Message = new Message(
        MessageType.Undo,
        undefined,
        this.$store.state.userId
      );
      this.ws.send(JSON.stringify(msg));
    },
    redo(): void {
      const msg: Message = new Message(
        MessageType.Redo,
        undefined,
        this.$store.state.userId
      );
      this.ws.send(JSON.stringify(msg));
    },
    clear(): void {
      this.canvas.clear();
      const msg: Message = new Message(
        MessageType.Clear,
        undefined,
        this.$store.state.userId
      );
      this.ws.send(JSON.stringify(msg));
    },
    changeBackground(file: File): void {
      this.canvas.changeBackground(file);
    },
    changeLineColor(color: Color): void {
      // notify other users of color change via WS
      const msg: Message = new Message(
        MessageType.UserSelectedColor,
        color,
        this.$store.state.userId
      );
      this.ws.send(JSON.stringify(msg));
    },
    setActiveUsers(activeUsers: Record<string, string>[]) {
      this.activeUsers = activeUsers;
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
      this.inputStateManager.startNewAction(ev);
    },
    handlePointerMove(ev: PointerEvent) {
      this.inputStateManager.continueAction(ev);
    },
    handlePointerUp(ev: PointerEvent) {
      const finishedAction: Action = this.inputStateManager.endAction(ev);
    },
    initCanvas(): CanvasUI {
      const canvas: HTMLElement = document.getElementById("canvas")!;
      const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext(
        "2d"
      )!;
      this.resizeCanvas(); //sets height and width of canvas
      return new Canvas2D(context);
    },
    initInputStateManager(canvas: CanvasUI, ws: WebSocket): InputStateManager {
      return new InputStateManager(canvas, ws);
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#canvas {
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
  background-size: contain;
}
</style>
