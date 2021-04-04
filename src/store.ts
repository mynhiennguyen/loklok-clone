import { createStore } from 'vuex'
import { LineThickness } from './lines';

export type State = { lineThickness: number};

const state: State = { lineThickness: LineThickness.values()[0]}

export const store = createStore({
    state,
    mutations: {
    changeLineThickness (state: State, thickness: number) {
      state.lineThickness = thickness
    }
  }
})