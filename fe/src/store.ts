import { createStore } from "vuex";
import { Color, Width, Tool } from "./options";

export type State = {
  tool: Tool;
  lineThickness: number;
  lineColor: Color;
  userId: string;
  userName: string;
  groupId: string;
};

const state: State = {
  tool: Tool.PENCIL,
  lineThickness: Width.THIN,
  lineColor: Color.BLACK,
  userId: "NO_ID",
  userName: "NO_NAME",
  groupId: "Group A",
};

export const store = createStore({
  state,
  mutations: {
    changeTool(state: State, tool: Tool) {
      state.tool = tool;
    },
    changeLineWidth(state: State, thickness: number) {
      state.lineThickness = thickness;
    },
    changeLineColor(state: State, color: Color) {
      state.lineColor = color;
    },
    setUserId(state: State, userId: string) {
      state.userId = userId;
      const user = {
        name: state.userName,
        id: state.userId,
      };
      localStorage.setItem("user", JSON.stringify(user));
    },
    setUserName(state: State, userName: string) {
      state.userName = userName;
      const user = {
        name: state.userName,
        id: state.userId,
      };
      localStorage.setItem("user", JSON.stringify(user));
    },
    changeGroup(state: State, groupId: string) {
      state.groupId = groupId;
    },
  },
});
