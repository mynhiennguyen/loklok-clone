<template>
<div id="toolbar">
  <button @click="undo">Undo</button>
  <button @click="redo">Redo</button>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ToolBar",
    emits: ["undo", "redo"],
    methods: {
      undo(): void {
        this.$emit("undo")
      },
      redo(): void {
        this.$emit("redo")
      }
    }
    
})
</script>

<style scoped>
#toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100px;
    background-color: sandybrown;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
}
</style>