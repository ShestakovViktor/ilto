export enum PivotKind {
	TopLeft = "1",
	TopCenter = "2",
	TopRight = "3",
	MiddleLeft = "4",
	MiddleCenter = "5",
	MiddleRight = "6",
	BottomLeft = "7",
	BottomCenter = "8",
	BottomRight = "9",
}

export const PivotCoords: Record<PivotKind, [number, number]> = {
	[PivotKind.TopLeft]: [-0.5, -0.5],
	[PivotKind.TopCenter]: [0, -0.5],
	[PivotKind.TopRight]: [0.5, -0.5],
	[PivotKind.MiddleLeft]: [-0.5, 0],
	[PivotKind.MiddleCenter]: [0, 0],
	[PivotKind.MiddleRight]: [0.5, 0],
	[PivotKind.BottomLeft]: [-0.5, 0.5],
	[PivotKind.BottomCenter]: [0, 0.5],
	[PivotKind.BottomRight]: [0.5, 0.5],
};