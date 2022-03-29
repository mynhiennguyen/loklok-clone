<template>
  <Modal>
    <h2 class="modal__heading">Hi! Who are you?</h2>
    <input
      class="modal__input"
      v-model="username"
      type="text"
      placeholder="Your Name"
    />
    <button
      class="modal__submit"
      :class="{ 'modal__submit--invalid': isInvalid }"
      @click="submit"
    >
      OK
    </button>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "./Modal.vue";

export default defineComponent({
  name: "RegisterModal",
  components: {
    Modal,
  },
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
.modal__heading {
  margin: 0px 0px 20px 0px;
}

.modal__input {
  height: 40px;
  margin: 0px 10px;
}

.modal__submit {
  margin-top: 10px;
  background-color: rgba(244, 164, 96, 1);
  color: white;
  border: none;
  width: 55px;
  height: 25px;
  cursor: pointer;
}

.modal__submit--invalid {
  cursor: not-allowed;
  background-color: grey;
}
</style>
