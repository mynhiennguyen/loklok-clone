<template>
  <div class="register-modal-container">
    <div class="register-modal">
      <h2 class="register-modal__heading">Hi! Who are you?</h2>
      <input
        class="register-modal__input"
        v-model="username"
        type="text"
        placeholder="Your Name"
      />
      <button
        class="register-modal__submit"
        :class="{ 'register-modal__submit--invalid': isInvalid }"
        @click="submit"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RegisterModal",
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
.register-modal-container {
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

.register-modal {
  height: 200px;
  width: 300px;
  background-color: whitesmoke;
  border-radius: 1%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-modal__heading {
  margin: 0px 0px 20px 0px;
}

.register-modal__input {
  height: 40px;
  margin: 0px 10px;
}

.register-modal__submit {
  margin-top: 10px;
  background-color: rgba(244, 164, 96, 1);
  color: white;
  border: none;
  width: 55px;
  height: 25px;
  cursor: pointer;
}

.register-modal__submit--invalid {
  cursor: not-allowed;
  background-color: grey;
}
</style>
