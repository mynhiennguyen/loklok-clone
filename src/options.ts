// Tools Options
export enum Tool {
    PENCIL,
    ERASER
}

export const Tools = new Map<Tool, string>([
    [Tool.PENCIL, "Draw"],
    [Tool.ERASER, "Erase"],
])

// Line Thickness Options
export enum Thickness {
    THIN = "Thin",
    MEDIUM = "Medium",
    THICK = "Thick"
}

export const LineThickness  = new Map<Thickness, number>([
    [Thickness.THIN, 5],
    [Thickness.MEDIUM, 10],
    [Thickness.THICK, 20]
]);

// Line Color Options
export enum Color {
    RED_MEDIUM,
    RED_DARK,
    ORANGE,
    YELLOW,
    GREEN_LIGHT,
    GREEN_MEDIUM,
    GREEN_DARK,
    BLUE_LIGHT,
    BLUE_MEDIUM,
    BLUE_DARK,
    PURPLE,
    PINK,
    BROWN,
    BLACK,
    WHITE,
    GREY
}

export const LineColor  = new Map<Color, string>([
    [Color.RED_MEDIUM, '#f23a3a'],
    [Color.RED_DARK, '#661414'],
    [Color.ORANGE, '#ffa600'],
    [Color.YELLOW, '#fffb00'],
    [Color.GREEN_LIGHT, '#b7ff4a'],
    [Color.GREEN_MEDIUM, '#40d43b'],
    [Color.GREEN_DARK, '#186915'],
    [Color.BLUE_LIGHT, '#54eeff'],
    [Color.BLUE_MEDIUM, '#0f93ff'],
    [Color.BLUE_DARK, '#0036d9'],
    [Color.PURPLE, '#7300e6'],
    [Color.PINK, '#f419ff'],
    [Color.BROWN, '#6b5034'],
    [Color.BLACK, '#000000'],
    [Color.WHITE, '#ffffff'],
    [Color.GREY, '#b0b0b0']
]);