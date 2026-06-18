export interface GraphicsDriver {
	prepareSvg(file: File): Promise<File>;

	prepareImg(file: File, width: number, height: number, size: number):
	Promise<{x: number; y: number; w: number; h: number; f: File}[]>;
}
