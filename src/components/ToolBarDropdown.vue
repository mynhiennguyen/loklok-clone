<template>
    <div class="dropdown">
        <div class="dropdown__item" @click="showDropdown = !showDropdown">
            <div class="dropdown__icon" :style="selectedItem.icon"/>
        </div>
        <div v-if="showDropdown" class="dropdown__content" :class="items.length > 3 ? 'dropdown__content--large': null">
            <a v-for="item, i in items" class="dropdown__item" :key="i" @click="changeSelectedItem(item)" :value="item.value">
                <div class="dropdown__icon" :style="item.icon"/>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export class DropdownItem {
    icon
    value
    onClick: Function

    constructor(icon, value, callback){
        this.icon = icon;
        this.value = value;
        this.onClick = callback;
    }

}

export default defineComponent({
    name: "DropDown",
    props: {
        items: Object as PropType<DropdownItem[]>
    },
    data() {
        return {
            selectedItem: this.items[0],
            showDropdown: false
        }
    },
    methods: {
        changeSelectedItem(item){
            this.selectedItem = item;
            item.onClick(item.value);
            this.showDropdown = false;
        }
    },
})
</script>

<style scoped>
.dropdown {
    display: flex;
    flex-direction: column;
}

.dropdown__icon {
    height: 8vw;
    width: 8vw;
    background-size: contain;
}

.dropdown__content--large {
    max-width: 24vw;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

@media screen and (min-width: 768px){
    .dropdown__icon {
        height: 3vw;
        width: 3vw;
        }
    
    .dropdown__content--large {
        max-width: 9vw;
        }
}

</style>