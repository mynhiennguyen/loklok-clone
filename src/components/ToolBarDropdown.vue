<template>
    <div class="dropdown">
        <div class="dropdown__item" @click="showDropdown = !showDropdown">
            <div class="dropdown__icon dropdown__icon--first" :style="selectedItem.icon"/>
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

.dropdown__item {
    height: 8vw;
    width: 8vw;
    margin: 3px;
}

.dropdown__icon {
    height: 100%;
    width: 100%;
    background-size: contain;
}

.dropdown__content {
    display:flex;
    flex-direction: column;
}

.dropdown__content--large {
    max-width: 30vw;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

@media screen and (min-width: 768px){
    .dropdown__item {
        height: 3vw;
        width: 3vw;
        }
    
    .dropdown__content--large {
        max-width: 13vw;
        }
}

.dropdown__icon--first {
    padding: 3px;
}

</style>