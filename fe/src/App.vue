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
      :groups="groups"
      @createGroup="openCreateGroupModal"
    ></ToolBar>
    <EditingCanvas
      ref="canvas"
      @isUndoRedoActive="updateIsUndoRedoActive"
    ></EditingCanvas>
    <RegisterModal
      v-if="showRegisterModal"
      @submitUserName="setNewUser"
    ></RegisterModal>
    <CreateGroupModal v-if="showCreateGroupModal"></CreateGroupModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditingCanvas from "./components/EditingCanvas.vue";
import ToolBar from "./components/ToolBar.vue";
import { Color } from "./options";
import RegisterModal from "./components/RegisterModal.vue";
import CreateGroupModal from "./components/CreateGroupModal.vue";
import { Group } from "./types/interfaces/group";

export default defineComponent({
  name: "App",
  components: {
    EditingCanvas,
    ToolBar,
    RegisterModal,
    CreateGroupModal,
  },
  data() {
    return {
      isUndoActive: false,
      isRedoActive: false,
      showRegisterModal: false,
      showCreateGroupModal: false,
      groups: [] as Group[],
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
      // fetch groups for this user
      (this.$refs.canvas as typeof EditingCanvas)
        .getGroups()
        .then((groups: Group[]) => {
          this.groups = groups;
        });
    } else {
      this.showRegisterModal = true;
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
      this.showRegisterModal = false;

      const canvas = this.$refs.canvas as typeof EditingCanvas;
      canvas.initWSConnection(true);
    },
    openCreateGroupModal() {
      this.showCreateGroupModal = true;
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
