<template>
  <div class="active-users-display">
    <p class="active-users-display__label">Who is online</p>
    <div
      v-for="user in activeUsers"
      :key="user.userId"
      class="active-user"
      :style="{ backgroundColor: user.color }"
    >
      <span class="active-user__name">{{ user.username }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ActiveUsersDisplay",
  props: {
    activeUsers: Array,
  },
});
</script>

<style scoped>
.active-users-display {
  width: 50px;
  max-width: 300px;
  background-color: rgba(255, 255, 255, 0.5);
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.active-users-display__label {
  text-align: center;
  margin: 0px 0px 10px 0px;
}

.active-user {
  width: 40px;
  height: 40px;
  border-radius: 75%;
  /* background-color: #020288; */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.active-user__name {
  /* Won't work for certain selected colors (e.g yellow, or white) TODO: find solution */
  color: white;
}
</style>
