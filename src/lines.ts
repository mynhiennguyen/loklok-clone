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