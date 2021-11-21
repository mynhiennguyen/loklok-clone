<template>
  <div>
    <canvas
      id="canvas"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      :style="{background: backgroundImage}"
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
import { UndoManager } from "../types/undoManager";
import { ClearAction } from "../types/actions/clearAction";
import { Message, MessageType } from "../types/messages/message";
import { Color } from "@/options";

export default defineComponent({
  name: "Canvas",
  props: {},
  components: {
    ActiveUsersDisplay
  },

  data() {
    return {
      canvas: null as CanvasUI,
      undoManager: null as UndoManager,
      inputStateManager: null as InputStateManager,
      backgroundImage: 'silver',
      ws: null as WebSocket,
      activeUsers: [] as Array<Object>
    };
  },
  computed: {
    lineThickness(): void {
      return this.$store.lineThickness
    }
  },
  mounted(): void {

    if (process.env.NODE_ENV === "development") {
      this.ws = new WebSocket('ws://localhost:3000')
    }
    else {
      this.ws = new WebSocket('wss://loklok-clone.herokuapp.com/')
    }

    this.canvas = this.initCanvas();
    this.undoManager = this.initUndoManager(this.canvas);
    this.inputStateManager = this.initInputStateManager(this.canvas, this.ws);

    // Websocket commmunication
    // TODO: also use Factory Method Pattern here?
    this.ws.onmessage = (msg) => {
      const message = JSON.parse(msg.data);

      if(message.type === MessageType.ReceiveUserID) {
        this.$store.commit('setUserId',message.data);
      }
      else if(message.type === MessageType.Drawing) {
        this.canvas.drawLine(message.data.points[0], message.data.points[1], message.data.points[2], message.data.points[3], message.data.strokeStyle, message.data.lineWidth)
      }
      else if(message.type === MessageType.Erasing) {
        this.canvas.eraseLine(message.data.points[0], message.data.points[1], message.data.points[2], message.data.points[3], message.data.lineWidth)
      }
      else if(message.type === MessageType.ActiveUsersList) {
        this.activeUsers = message.data;
      }
    }

    window.addEventListener("resize", this.resizeCanvas); //TODO: resizing will reset entire canvas, drawing needs to be redrawn
  },
  methods: {
    undo(): void {
      this.undoManager.undo();
    },
    redo(): void {
      this.undoManager.redo();
    },
    clear(): void {
      const clearAction: Action = new ClearAction(this.canvas, this.ws);
      clearAction.execute();
      this.undoManager.push(clearAction);
    },
    changeBackground(file: File): void {
      this.canvas.changeBackground(file)
    },
    changeLineColor(color: Color): void {
      // notify other users of color change via WS
      const msg: Message = new Message(MessageType.UserSelectedColor, color, this.$store.userId)
      this.ws.send(JSON.stringify(msg))
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
