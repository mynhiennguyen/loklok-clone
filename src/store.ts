import { createStore } from 'vuex'
import { Color, LineColor, LineThickness } from './options';

export type State = { 
    lineThickness: number;
    lineColor: string;
};

const state: State = { 
    lineThickness: LineThickness.values()[0],
    lineColor: LineColor.get(Color.BLACK),
}

export const store = createStore({
    state,
    mutations: {
    changeLineThickness (state: State, thickness: number) {
        state.lineThickness = thickness
    },
    changeLineColor(state: State, color: string){
        state.lineColor = color
    }
  }
})