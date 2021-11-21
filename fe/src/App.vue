<template>
  <div id="app-container">
    <ToolBar
      @undo="undo"
      @redo="redo"
      @clear="clear"
      @changeBackground="changeBackground"
      @changeLineColor="changeLineColor"
    ></ToolBar>
    <Canvas ref="canvas"></Canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Canvas from "./components/Canvas.vue";
import ToolBar from "./components/ToolBar.vue";
import { Color } from "./options";

export default defineComponent({
  name: "App",
  components: {
    Canvas,
    ToolBar,
  },
  methods: {
    undo(): void {
      this.$refs.canvas.undo();
    },
    redo(): void {
      this.$refs.canvas.redo();
    },
    clear(): void {
      this.$refs.canvas.clear();
    },
    changeBackground(file: File): void {
      this.$refs.canvas.changeBackground(file);
    },
    changeLineColor(color: Color): void {
      this.$refs.canvas.changeLineColor(color); // currently all WS-communication is handled within Canvas. TODO: refactor
    }
  },
});
</script>

<style>
body,
html {
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: "Quicksand", sans-serif;
}
#app-container {
  position: relative;
}
</style>
