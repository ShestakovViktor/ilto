import {
	Compiler,
	Shear,
	TextureBuffer,
	TileBuffer,
	EntityBuffer,
	EntityPass,
	type Frame,
} from "@src/viewer/controller";
import type {View} from "./View";
import type {ImageLayout, ImageTile, TextureConfig, TextureLayout, TileConfig} from "../type";

export class Canvas {
	private textureConfig: TextureConfig = {
		size: 2048,
		depth: 16,
	};

	private tileConfig: TileConfig = {
		dst: 128,
		ext: 124,
		src: 120,
		spacing: 2,
		extrusion: 2,
	};

	private gl!: WebGL2RenderingContext;

	private shear!: Shear;

	private compiler!: Compiler;

	private textureBuffer!: TextureBuffer;

	private entityBuffer!: EntityBuffer;

	private tileBuffer!: TileBuffer;

	private entityPass!: EntityPass;

	private entities: {
		x: number;
		y: number;
		z: number;
		w: number;
		h: number;
		rotation: number;
		layout: ImageLayout;
		tiles: ImageTile[];
		textureLayout: TextureLayout;
	}[] = [];

	constructor(
		private view: View,
		private frame: Frame
	) {

	}

	setCanvas(canvas: HTMLCanvasElement): void {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		this.gl = canvas.getContext("webgl2", {premultipliedAlpha: false})!;
		this.gl.viewport(0, 0, canvas.width, canvas.height);
		this.frame.setSize(0, 0, canvas.width, canvas.height);

		this.shear = new Shear(this.tileConfig);

		this.compiler = new Compiler(this.gl);

		this.textureBuffer = new TextureBuffer(
			this.gl,
			this.textureConfig,
			this.tileConfig
		);
		this.entityBuffer = new EntityBuffer(this.gl);
		this.tileBuffer = new TileBuffer();

		this.entityPass = new EntityPass(
			this.gl,
			this.compiler,
			this.tileConfig.src
		);
	}

	async initTest(): Promise<void> {
		const response = await fetch("drawing.png");
		const blob = await response.blob();

		const {layout, tiles} = await this.shear.cut(blob);
		const textureLayout = this.textureBuffer.uploadImage(
			"my_test_image",
			layout,
			tiles
		);

		this.entities = [{
			x: 1920 / 2,
			y: 1080 / 2,
			w: 1920,
			h: 1080,
			z: 0.0,
			rotation: 0 * Math.PI / 180,
			layout,
			tiles,
			textureLayout,
		}];

		this.entityBuffer.fill(this.entities);
		this.tileBuffer.fill(this.entities);
	}

	draw(): void {
		this.entityPass.render(
			this.frame.getProjMatrix(),
			this.view.getViewMatrix(),
			this.textureBuffer,
			this.entityBuffer,
			this.tileBuffer
		);
	}
}