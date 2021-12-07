<template>
  <div>
    <canvas
      id="backgroundCanvas"
      class="canvas"
      :style="{ background: backgroundImage }"
    >
    </canvas>
    <canvas
      id="mainCanvas"
      class="canvas"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    >
    </canvas>
    <active-users-display id="activeUsers" :activeUsers="activeUsers"></active-users-display>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ActiveUsersDisplay from "./ActiveUsersDisplay.vue";
import { Action } from "../types/interfaces/action";
import { InputStateManager } from "../types/inputStateManager";
import { CanvasUI } from "../types/interfaces/canvas";
import { Canvas2D } from "../types/canvas2D";
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
      backgroundCanvas: (null as unknown) as CanvasUI,
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

    this.canvas = this.initCanvas("mainCanvas");
    this.backgroundCanvas = this.initCanvas("backgroundCanvas");
    this.inputStateManager = this.initInputStateManager(this.canvas, this.ws);

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
      this.resizeCanvas("backgroundCanvas")}); //TODO: resizing will reset entire canvas, drawing needs to be redrawn
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
      // sets local background
      this.backgroundCanvas.changeBackground(URL.createObjectURL(file));

      // send new background to other users
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }).then((res) => {
        const msg: Message = new Message(
          MessageType.SetBackground,
          res,
          this.$store.state.userId
        );
        this.ws.send(JSON.stringify(msg));
      });
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
    setIsUndoRedoActive(isUndoActive: boolean, isRedoActive: boolean) {
      this.$emit("isUndoRedoActive", isUndoActive, isRedoActive);
    },
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
    handlePointerDown(ev: PointerEvent) {
      this.inputStateManager.startNewAction(ev);
    },
    handlePointerMove(ev: PointerEvent) {
      this.inputStateManager.continueAction(ev);
    },
    handlePointerUp(ev: PointerEvent) {
      const finishedAction: Action = this.inputStateManager.endAction(ev);
    },
    initCanvas(id: string): CanvasUI {
      const canvas: HTMLElement = document.getElementById(id)!;
      const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext(
        "2d"
      )!;
      this.resizeCanvas(id); //sets height and width of canvas
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
.canvas {
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
#mainCanvas {
  z-index: 1;
}
#backgroundCanvas {
  z-index: 0;
}
#activeUsers {
  z-index: 2;
}
</style>
