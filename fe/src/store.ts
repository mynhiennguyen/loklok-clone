import { createStore } from 'vuex'
import { Color, Width, Tool } from './options';

export type State = {
    tool: Tool; 
    lineThickness: number;
    lineColor: Color;
    userId: string;
};

const state: State = {
    tool: Tool.PENCIL, 
    lineThickness: Width.THIN,
    lineColor: Color.BLACK,
    userId: null
}

export const store = createStore({
    state,
    mutations: {
        changeTool(state: State, tool: Tool){
            state.tool = tool
        },
        changeLineWidth (state: State, thickness: number) {
            state.lineThickness = thickness
        },
        changeLineColor(state: State, color: Color){
            state.lineColor = color
        },
        setUserId(state: State, userId: string) {
            state.userId = userId
        }
  }
})