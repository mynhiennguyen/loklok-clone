<template>
<div id="toolbar">
  <select @change="changeColor" name="color" id="color">
    <option v-for="c in LineColor.keys()" :key="c" :value="LineColor.get(c)" :style="{color: LineColor.get(c)}">{{c}}</option>
  </select>
  <select @change="changeThickness" name="thickness" id="thickness">
    <option v-for="t in LineThickness.keys()" :key="t" :value="LineThickness.get(t)">{{t}}</option>
  </select>
  <button @click="undo">Undo</button>
  <button @click="redo">Redo</button>
  <button @click="clear">Clear</button>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LineThickness, LineColor} from "../options";

export default defineComponent({
    name: "ToolBar",
    emits: ["undo", "redo", "clear"],
    data() {
      return {
        LineThickness,
        LineColor
      }
    },
    methods: {
      undo(): void {
        this.$emit("undo")
      },
      redo(): void {
        this.$emit("redo")
      },
      clear(): void {
        this.$emit("clear")
      },
      changeThickness(e): void {
        this.$store.commit("changeLineThickness", e.target.value)
      },
      changeColor(e): void {
        this.$store.commit("changeLineColor", e.target.value)
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