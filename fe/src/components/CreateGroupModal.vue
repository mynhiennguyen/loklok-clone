<template>
  <Modal>
    <h2 class="modal__heading">Nice, let's create a group!</h2>
    <label for="groupname">How do you want to name it?</label>
    <input
      class="modal__input"
      name="groupname"
      v-model="groupname"
      type="text"
      placeholder="Group name"
    />
    <label>Who are the members?</label>
    <div class="modal__memberlist-container">
      <div
        v-for="user in userList"
        :key="user.id"
        class="modal__memberlist-entry"
        :class="{ 'modal__memberlist-entry--selected': isSelected(user.id) }"
      >
        <p class="name">{{ user.name }}</p>
        <button v-if="!isSelected(user.id)" @click="addUserToGroup(user.id)">
          Add
        </button>
        <button v-else @click="removeUserFromGroup(user.id)">Remove</button>
      </div>
    </div>
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
  name: "CreateGroupModal",
  components: {
    Modal,
  },
  data() {
    return {
      groupname: "",
      userList: [],
      addedUsers: [] as string[],
    };
  },
  computed: {
    isInvalid(): boolean {
      return this.groupname.length <= 3;
    },
  },
  mounted() {
    fetch(`${process.env.VUE_APP_HTTP_URL}/users`)
      .then((res) => res.json())
      .then((data) => (this.userList = data));
  },
  methods: {
    submit() {
      if (this.isInvalid) return;
      const data = {
        groupname: this.groupname,
        users: this.addedUsers,
      };
      fetch(`${process.env.VUE_APP_HTTP_URL}/groups`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).catch((err) => console.error(err));
    },
    addUserToGroup(userId: string, index: number) {
      this.addedUsers.push(userId);
    },
    removeUserFromGroup(userId: string) {
      const index = this.addedUsers.findIndex((id) => id === userId);
      this.addedUsers.splice(index, 1);
    },
    isSelected(userId: string) {
      return this.addedUsers.includes(userId);
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

.modal__memberlist-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 250px;
  overflow-y: auto;
}

.modal__memberlist-entry {
  display: flex;
  flex-direction: row;
  background-color: white;
  margin-bottom: 2px;
  height: 35px;
}

.modal__memberlist-entry--selected {
  background-color: rgba(244, 164, 96, 1);
}

.modal__memberlist-entry > .name {
  flex-grow: 1;
  margin: 0px;
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
