<template>
<div id="toolbar">
  <tool-bar-dropdown :items="tools"></tool-bar-dropdown>
  <tool-bar-dropdown :items="colors"></tool-bar-dropdown>
  <tool-bar-dropdown :items="width"></tool-bar-dropdown>
  <button @click="undo">Undo</button>
  <button @click="redo">Redo</button>
  <button @click="clear">Clear</button>
  <input @change="changeBackground" type="file" accept="image/*" id="image">
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Tool, Color, Width} from "../options";
import ToolBarDropdown, { DropdownItem } from "./ToolBarDropdown.vue";

export default defineComponent({
  components: { ToolBarDropdown },
    name: "ToolBar",
    emits: ["undo", "redo", "clear", "changeBackground"],
    data() {
      return {
        width: [
          new DropdownItem({'backgroundImage': 'url(' + require('../assets/icons/thin.svg') + ')'}, Width.THIN, this.changeWidth),
          new DropdownItem({'backgroundImage': 'url(' + require('../assets/icons/medium.svg') + ')'}, Width.MEDIUM, this.changeWidth),
          new DropdownItem({'backgroundImage': 'url(' + require('../assets/icons/thick.svg') + ')'}, Width.THICK, this.changeWidth),
        ],
        colors: [
          new DropdownItem({'backgroundColor': Color.BLACK}, Color.BLACK, this.changeColor),
          new DropdownItem({'backgroundColor': Color.GREY}, Color.GREY, this.changeColor),
          new DropdownItem({'backgroundColor': Color.WHITE}, Color.WHITE, this.changeColor),
          new DropdownItem({'backgroundColor': Color.RED_MEDIUM}, Color.RED_MEDIUM, this.changeColor),
          new DropdownItem({'backgroundColor': Color.RED_DARK}, Color.RED_DARK, this.changeColor),
          new DropdownItem({'backgroundColor': Color.ORANGE}, Color.ORANGE, this.changeColor),
          new DropdownItem({'backgroundColor': Color.YELLOW}, Color.YELLOW, this.changeColor),
          new DropdownItem({'backgroundColor': Color.GREEN_MEDIUM}, Color.GREEN_MEDIUM, this.changeColor),
          new DropdownItem({'backgroundColor': Color.GREEN_DARK}, Color.GREEN_DARK, this.changeColor),
          new DropdownItem({'backgroundColor': Color.BLUE_MEDIUM}, Color.BLUE_MEDIUM, this.changeColor),
          new DropdownItem({'backgroundColor': Color.BLUE_DARK}, Color.BLUE_DARK, this.changeColor),
          new DropdownItem({'backgroundColor': Color.PURPLE}, Color.PURPLE, this.changeColor),
        ],
        tools: [
          new DropdownItem({'backgroundImage': 'url(' + require('../assets/icons/pencil.svg') + ')'}, Tool.PENCIL, this.changeTool),
          new DropdownItem({'backgroundImage': 'url(' + require('../assets/icons/eraser.svg') + ')'}, Tool.ERASER, this.changeTool),
        ]
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
        this.$store.commit("changeTool", e)
      },
      changeWidth(width: number): void {
        this.$store.commit("changeLineWidth", width)
      },
      changeColor(e): void {
        this.$store.commit("changeLineColor", e)
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

#toolbar > * {
  margin: 1vw;
}
</style>