<template>
<div id="toolbar">
  <button @click="undo">Undo</button>
  <button>Redo</button>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'ToolBar',
    emits: ['undo', 'redo'],
    methods: {
      undo() {
        this.$emit('undo')
      }
    }
    
})
</script>

<style scoped>
#toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1000px;
    height: 100px;
    background-color: sandybrown;
}
</style>