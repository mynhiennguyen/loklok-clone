<template>
  <div id="app-container">
    <ToolBar
      @undo="undo"
      :isUndoActive="isUndoActive"
      @redo="redo"
      :isRedoActive="isRedoActive"
      @clear="clear"
      @changeBackground="changeBackground"
      @changeLineColor="changeLineColor"
    ></ToolBar>
    <Canvas ref="canvas" @isUndoRedoActive="updateIsUndoRedoActive"></Canvas>
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
  data() {
    return {
      isUndoActive: false,
      isRedoActive: false
    }
  },
  methods: {
    undo(): void {
      (this.$refs.canvas as typeof Canvas).undo();
    },
    redo(): void {
      (this.$refs.canvas as typeof Canvas).redo();
    },
    clear(): void {
      (this.$refs.canvas as typeof Canvas).clear();
    },
    changeBackground(file: File): void {
      (this.$refs.canvas as typeof Canvas).changeBackground(file);
    },
    changeLineColor(color: Color): void {
      (this.$refs.canvas as typeof Canvas).changeLineColor(color); // currently all WS-communication is handled within Canvas. TODO: refactor
    },
    updateIsUndoRedoActive(isUndoActive: boolean, isRedoActive: boolean) {
      this.isUndoActive = isUndoActive;
      this.isRedoActive = isRedoActive;
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
