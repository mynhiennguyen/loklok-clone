<template>
  <div id="toolbar">
    <tool-bar-dropdown class="toolbar__button" :items="tools"></tool-bar-dropdown>
    <tool-bar-dropdown class="toolbar__button" :items="colors" rounded></tool-bar-dropdown>
    <tool-bar-dropdown class="toolbar__button" :items="width"></tool-bar-dropdown>
    <!-- Undo icon as inline SVG -->
    <div
      class="toolbar__button"
      :class="{ 'toolbar__button--disabled': !isUndoActive }"
      @click="undo"
    >
      <svg
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 454.839 454.839"
        style="enable-background:new 0 0 454.839 454.839;"
        xml:space="preserve"
        fill="#020288"
      >
        <g>
          <path
            d="M404.908,283.853c0,94.282-76.71,170.986-170.986,170.986h-60.526c-10.03,0-18.158-8.127-18.158-18.157v-6.053
		c0-10.031,8.127-18.158,18.158-18.158h60.526c70.917,0,128.618-57.701,128.618-128.618c0-70.917-57.701-128.618-128.618-128.618
		H122.255l76.905,76.905c8.26,8.257,8.26,21.699,0,29.956c-8.015,8.009-21.964,7.997-29.961,0L56.137,149.031
		c-4.001-4.001-6.206-9.321-6.206-14.981c0-5.656,2.205-10.979,6.206-14.978L169.205,6.002c7.997-8.003,21.958-8.003,29.956,0
		c8.26,8.255,8.26,21.699,0,29.953l-76.905,76.911h111.666C328.198,112.866,404.908,189.573,404.908,283.853z"
          />
        </g>
      </svg>
    </div>
    <!-- Redo icon as inline SVG -->
    <div class="toolbar__button" @click="redo"
    :class="{ 'toolbar__button--disabled': !isRedoActive }">
      <svg
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 454.839 454.839"
        style="enable-background:new 0 0 454.839 454.839;"
        xml:space="preserve"
        transform="scale(-1,1)"
        fill="#020288"
      >
        <g>
          <path
            d="M404.908,283.853c0,94.282-76.71,170.986-170.986,170.986h-60.526c-10.03,0-18.158-8.127-18.158-18.157v-6.053
		c0-10.031,8.127-18.158,18.158-18.158h60.526c70.917,0,128.618-57.701,128.618-128.618c0-70.917-57.701-128.618-128.618-128.618
		H122.255l76.905,76.905c8.26,8.257,8.26,21.699,0,29.956c-8.015,8.009-21.964,7.997-29.961,0L56.137,149.031
		c-4.001-4.001-6.206-9.321-6.206-14.981c0-5.656,2.205-10.979,6.206-14.978L169.205,6.002c7.997-8.003,21.958-8.003,29.956,0
		c8.26,8.255,8.26,21.699,0,29.953l-76.905,76.911h111.666C328.198,112.866,404.908,189.573,404.908,283.853z"
          />
        </g>
      </svg>
    </div>
    <div class="toolbar__button" @click="clear">
      <img class="toolbar__icon" :src="clearIcon" />
    </div>
    <div class="toolbar__button">
      <label for="image">
        <img class="toolbar__icon" :src="cameraIcon" />
      </label>
      <input
        @change="changeBackground"
        type="file"
        accept="image/*"
        id="image"
      />
    </div>
    <select @change="changeGroup">
      <option v-for="group in groups" :key="group" :value="group">{{group}}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Tool, Color, Width } from "../options";
import ToolBarDropdown, { DropdownItem } from "./ToolBarDropdown.vue";

export default defineComponent({
  components: { ToolBarDropdown },
  name: "ToolBar",
  props: {
    isUndoActive: Boolean,
    isRedoActive: Boolean
  },
  emits: ["undo", "redo", "clear", "changeBackground", "changeLineColor", "changeGroup"],
  data() {
    return {
      width: [
        new DropdownItem(
          {
            backgroundImage: "url(" + require("../assets/icons/thin.svg") + ")",
          },
          Width.THIN,
          this.changeWidth
        ),
        new DropdownItem(
          {
            backgroundImage:
              "url(" + require("../assets/icons/medium.svg") + ")",
          },
          Width.MEDIUM,
          this.changeWidth
        ),
        new DropdownItem(
          {
            backgroundImage:
              "url(" + require("../assets/icons/thick.svg") + ")",
          },
          Width.THICK,
          this.changeWidth
        ),
      ],
      colors: [
        new DropdownItem(
          { backgroundColor: Color.BLACK },
          Color.BLACK,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.GREY },
          Color.GREY,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.WHITE },
          Color.WHITE,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.RED_MEDIUM },
          Color.RED_MEDIUM,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.RED_DARK },
          Color.RED_DARK,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.ORANGE },
          Color.ORANGE,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.YELLOW },
          Color.YELLOW,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.GREEN_MEDIUM },
          Color.GREEN_MEDIUM,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.GREEN_DARK },
          Color.GREEN_DARK,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.BLUE_MEDIUM },
          Color.BLUE_MEDIUM,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.BLUE_DARK },
          Color.BLUE_DARK,
          this.changeColor
        ),
        new DropdownItem(
          { backgroundColor: Color.PURPLE },
          Color.PURPLE,
          this.changeColor
        ),
      ],
      tools: [
        new DropdownItem(
          {
            backgroundImage:
              "url(" + require("../assets/icons/pencil.svg") + ")",
          },
          Tool.PENCIL,
          this.changeTool
        ),
        new DropdownItem(
          {
            backgroundImage:
              "url(" + require("../assets/icons/eraser.svg") + ")",
          },
          Tool.ERASER,
          this.changeTool
        ),
      ],
      undoIcon: require("../assets/icons/undo.svg"),
      redoIcon: require("../assets/icons/redo.svg"),
      clearIcon: require("../assets/icons/delete.svg"),
      cameraIcon: require("../assets/icons/photo-camera.svg"),
      groups: (null as unknown) as string[],
    };
  },
  mounted() {
    fetch("http://localhost:3000")
      .then(res => res.json())
      .then(res => this.groups = res)
      .catch(err => console.log(err))
  },
  methods: {
    undo(): void {
      this.$emit("undo");
    },
    redo(): void {
      this.$emit("redo");
    },
    clear(): void {
      this.$emit("clear");
    },
    changeTool(e: Tool): void {
      this.$store.commit("changeTool", e);
    },
    changeWidth(width: Width): void {
      this.$store.commit("changeLineWidth", width);
    },
    changeColor(e: Color): void {
      this.$store.commit("changeLineColor", e);
      this.$emit("changeLineColor", e);
    },
    changeBackground(e: Event): void {
      this.$emit("changeBackground", (e.target as HTMLInputElement).files![0]);
    },
    changeGroup(e: Event): void {
      this.$emit("changeGroup", (e.target as HTMLSelectElement).value)
    }
  },
});
</script>

<style scoped>
#toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100vw;
  height: 100px;
  background-color: rgba(244, 164, 96, 0.8);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}

#toolbar > * {
  margin: 1vw;
}

.toolbar__button {
  background: none;
  height: 8vw;
  width: 8vw;
  border: none;
  cursor: pointer;
}

.toolbar__button--disabled {
  cursor: default;
}

.toolbar__button--disabled > svg {
  fill: silver;
}

label {
  cursor: pointer;
}

.toolbar__button > input {
  display: none;
}

.toolbar__icon {
  height: 100%;
  width: 100%;
}

@media screen and (min-width: 768px) {
  .toolbar__button {
    height: 3vw;
    width: 3vw;
  }
}
</style>
