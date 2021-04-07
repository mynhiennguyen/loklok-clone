import { createStore } from 'vuex'
import { Color, Width, Tool } from './options';

export type State = {
    tool: Tool; 
    lineThickness: number;
    lineColor: string;
};

const state: State = {
    tool: Tool.PENCIL, 
    lineThickness: Width.THIN,
    lineColor: Color.BLACK,
}

export const store = createStore({
    state,
    mutations: {
        changeTool(state: State, tool: Tool){
            state.tool = tool
        },
        changeLineWidth (state: State, thickness: number) {
            state.lineThickness = thickness
            console.log(state.lineThickness)
        },
        changeLineColor(state: State, color: string){
            state.lineColor = color
        }
  }
})