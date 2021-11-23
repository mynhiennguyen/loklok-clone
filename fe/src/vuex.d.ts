// Typing $store Property in Vue Component
// Vuex doesn't provide typings for this.$store property out of the box. When used with TypeScript, you must declare your own module augmentation.

// To do so, declare custom typings for Vue's ComponentCustomProperties by adding a declaration file in your project folder:
// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    tool: Tool; 
    lineThickness: Width;
    lineColor: Color;
    userId: string;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}