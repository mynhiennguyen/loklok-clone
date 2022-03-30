<template>
  <div class="modal-container">
    <div class="modal">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  data() {
    return {
      username: "",
    };
  },
  computed: {
    isInvalid(): boolean {
      return this.username.length <= 3;
    },
  },
  methods: {
    submit() {
      if (this.isInvalid) return;
      this.$emit("submitUserName", this.username);
    },
  },
});
</script>

<style>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: whitesmoke;
  border-radius: 1%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
