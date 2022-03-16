<template>
  <div>
    <canvas
      id="backgroundCanvas"
      class="canvas"
      :style="{ background: 'rgba(210, 210, 210, 0.75)' }"
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
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue'
export default defineComponent({
    name: "Canvas",
    props: {},
    methods: {
        handlePointerDown(ev: PointerEvent) { this.$emit('pointerdown', ev)},
        handlePointerMove(ev: PointerEvent) { this.$emit('pointermove', ev)},
        handlePointerUp(ev: PointerEvent) {this.$emit('pointerup', ev)}
  },
});
</script>

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
</style>
