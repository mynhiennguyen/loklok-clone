<template>
<div id="toolbar">
  <select @change="changeThickness" name="thickness" id="thickness">
    <option v-for="v in LineThickness.keys()" :key="v" :value="LineThickness.get(v)">{{v}}</option>
  </select>
  <button @click="undo">Undo</button>
  <button @click="redo">Redo</button>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LineThickness} from "../lines";

export default defineComponent({
    name: "ToolBar",
    emits: ["undo", "redo"],
    data() {
      return {
        LineThickness
      }
    },
    methods: {
      undo(): void {
        this.$emit("undo")
      },
      redo(): void {
        this.$emit("redo")
      },
      changeThickness(e): void {
        this.$store.commit("changeLineThickness", e.target.value)
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