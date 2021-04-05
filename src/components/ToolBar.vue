<template>
<div id="toolbar">
  <select @change="changeTool" name="tool" id="tool">
    <option v-for="tool in Tools.keys()" :key="tool" :value="tool">{{Tools.get(tool)}}</option>
  </select>
  <select @change="changeColor" name="color" id="color">
    <option v-for="c in LineColor.keys()" :key="c" :value="LineColor.get(c)" :style="{color: LineColor.get(c)}">{{c}}</option>
  </select>
  <select @change="changeThickness" name="thickness" id="thickness">
    <option v-for="t in LineThickness.keys()" :key="t" :value="LineThickness.get(t)">{{t}}</option>
  </select>
  <button @click="undo">Undo</button>
  <button @click="redo">Redo</button>
  <button @click="clear">Clear</button>
  <input @change="changeBackground" type="file" accept="image/*" id="image">
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LineThickness, LineColor, Tools} from "../options";

export default defineComponent({
    name: "ToolBar",
    emits: ["undo", "redo", "clear", "changeBackground"],
    data() {
      return {
        Tools,
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
      changeTool(e): void {
        this.$store.commit("changeTool", e.target.value)
      },
      changeThickness(e): void {
        this.$store.commit("changeLineThickness", e.target.value)
      },
      changeColor(e): void {
        this.$store.commit("changeLineColor", e.target.value)
      },
      changeBackground(e): void {
        this.$emit("changeBackground", e.target.files[0])
      }
    }
    
})
</script>

<style scoped>
#toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100vw;
    height: 100px;
    background-color: sandybrown;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
}
</style>