import { createStore } from 'vuex'
import { Color, LineColor, LineThickness, Thickness, Tool } from './options';

export type State = {
    tool: Tool; 
    lineThickness: number;
    lineColor: string;
};

const state: State = {
    tool: Tool.PENCIL, 
    lineThickness: LineThickness.get(Thickness.MEDIUM),
    lineColor: LineColor.get(Color.BLACK),
}

export const store = createStore({
    state,
    mutations: {
        changeTool(state: State, tool: Tool){
            state.tool = tool
        },
        changeLineThickness (state: State, thickness: number) {
            state.lineThickness = thickness
        },
        changeLineColor(state: State, color: string){
            state.lineColor = color
        }
  }
})