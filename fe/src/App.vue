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
      @changeGroup="changeGroup"
    ></ToolBar>
    <EditingCanvas
      ref="canvas"
      @isUndoRedoActive="updateIsUndoRedoActive"
    ></EditingCanvas>
    <RegisterModal
      v-if="showModal"
      @submitUserName="setNewUser"
    ></RegisterModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditingCanvas from "./components/EditingCanvas.vue";
import ToolBar from "./components/ToolBar.vue";
import { Color } from "./options";
import RegisterModal from "./components/RegisterModal.vue";

export default defineComponent({
  name: "App",
  components: {
    EditingCanvas,
    ToolBar,
    RegisterModal,
  },
  data() {
    return {
      isUndoActive: false,
      isRedoActive: false,
      showModal: false,
    };
  },
  mounted(): void {
    // check localstorage for userinfo
    let storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      let user = JSON.parse(storedUserData);
      this.$store.commit("setUserName", user.name ?? "NO_NAME");
      this.$store.commit("setUserId", user.id ?? "NO_ID");
      (this.$refs.canvas as typeof EditingCanvas).initWSConnection();
      //TODO: request canvases
    } else {
      this.showModal = true;
    }
  },
  methods: {
    undo(): void {
      (this.$refs.canvas as typeof EditingCanvas).undo();
    },
    redo(): void {
      (this.$refs.canvas as typeof EditingCanvas).redo();
    },
    clear(): void {
      (this.$refs.canvas as typeof EditingCanvas).clear();
    },
    changeBackground(file: File): void {
      (this.$refs.canvas as typeof EditingCanvas).changeBackground(file);
    },
    changeLineColor(color: Color): void {
      (this.$refs.canvas as typeof EditingCanvas).changeLineColor(color); // currently all WS-communication is handled within Canvas. TODO: refactor
    },
    changeGroup(group: string) {
      (this.$refs.canvas as typeof EditingCanvas).changeGroup(group);
    },
    updateIsUndoRedoActive(isUndoActive: boolean, isRedoActive: boolean) {
      this.isUndoActive = isUndoActive;
      this.isRedoActive = isRedoActive;
    },
    setNewUser(username: string) {
      this.$store.commit("setUserName", username);
      this.showModal = false;

      const canvas = this.$refs.canvas as typeof EditingCanvas;
      canvas.initWSConnection(true);
    },
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
