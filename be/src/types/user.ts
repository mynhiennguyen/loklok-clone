export class User {
  userId: string = "NO_ID";
  username: string = "NO_NAME";
  color: Color = Color.BLACK;

  setUserId(userId: string) {
    this.userId = userId;
  }
  setUsername(username: string) {
    this.username = username;
  }
  setColor(color: Color) {
    this.color = color;
  }
}

// Line Color Options
export enum Color {
  RED_MEDIUM = "#f23a3a",
  RED_DARK = "#ab2513",
  ORANGE = "#ffa600",
  YELLOW = "#fffb00",
  GREEN_LIGHT = "#b7ff4a",
  GREEN_MEDIUM = "#40d43b",
  GREEN_DARK = "#186915",
  BLUE_LIGHT = "#54eeff",
  BLUE_MEDIUM = "#0f93ff",
  BLUE_DARK = "#0036d9",
  PURPLE = "#7300e6",
  PINK = "#f419ff",
  BROWN = "#6b5034",
  BLACK = "#000000",
  WHITE = "#ffffff",
  GREY = "#b0b0b0",
}
