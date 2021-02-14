<template>
  <div id="app-container">
    <ToolBar @undo="undo" @redo="redo"></ToolBar>
    <Canvas ref="canvas"></Canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Canvas from './components/Canvas.vue';
import ToolBar from './components/ToolBar.vue';

export default defineComponent({
  name: "App",
  components: {
    Canvas,
    ToolBar
  },
  methods: {
    undo(): void {
      this.$refs.canvas.undo()
    },
    redo(): void {
      this.$refs.canvas.redo()
    }
  }
});
</script>

<style>
body, html {
  height: 100%;
  width: 100%;
  margin: 0;
}
#app-container {
  position: relative;
}
</style>
