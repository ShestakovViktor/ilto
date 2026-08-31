import {
	ShaderCompiler,
	Shear,
	TextureAtlas,
	TilePayload,
	EntityPayload,
	EntityPass,
	TilePacker,
	type Frame,
	type Scene,
	EntityPacker,
	TextureManager,
	type View,
} from "@src/viewer/controller";

import type {
	EntityConfig,
	TextureConfig,
	TileConfig,
} from "@src/viewer/type";
import type {DataStorage} from "@src/core/controller";

export class Canvas {
	private readonly textureConfig: TextureConfig = {
		size: 2048,
		depth: 16,
	};

	private readonly entityConfig: EntityConfig = {
		size: 2048,
		stride: 16,
		slots: 4,
	};

	private readonly tileConfig: TileConfig = {
		stride: 9,
		dst: 128,
		ext: 124,
		src: 120,
		spacing: 2,
		extrusion: 2,
	};

	private gl!: WebGL2RenderingContext;
	private shear!: Shear;
	private compiler!: ShaderCompiler;

	private textureAtlas!: TextureAtlas;
	private textureManager!: TextureManager;

	private entityPacker!: EntityPacker;
	private entityPayload!: EntityPayload;

	private tilePacker!: TilePacker;
	private tilePayload!: TilePayload;

	private entityPass!: EntityPass;

	constructor(
		private view: View,
		private frame: Frame,
		private scene: Scene,
		private storage: DataStorage
	) {}

	setCanvas(canvas: HTMLCanvasElement): void {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		this.gl = canvas.getContext("webgl2", {premultipliedAlpha: false})!;
		this.gl.viewport(0, 0, canvas.width, canvas.height);
		this.frame.setSize(0, 0, canvas.width, canvas.height);

		this.shear = new Shear(this.tileConfig);

		this.compiler = new ShaderCompiler(this.gl);

		this.textureAtlas = new TextureAtlas(
			this.gl,
			this.textureConfig,
			this.tileConfig
		);

		this.textureManager = new TextureManager(
			this.textureAtlas,
			this.storage,
			this.shear
		);

		this.tilePacker = new TilePacker(this.tileConfig);
		this.tilePayload = new TilePayload();

		this.entityPacker = new EntityPacker(this.entityConfig);
		this.entityPayload = new EntityPayload(this.entityConfig, this.gl);

		this.entityPass = new EntityPass(
			this.gl,
			this.compiler,
			this.tileConfig.src
		);
	}

	async initScene(): Promise<void> {
		const nodes = this.scene.graph.filter((node) => node.assetId);

		const textureLayouts = await this.textureManager.formData(nodes);

		const {data: tilesData, count: tilesCount} = this.tilePacker
			.formData(textureLayouts);
		this.tilePayload.fill(tilesData, tilesCount);

		const {data: entityData} = this.entityPacker.formData(nodes);
		this.entityPayload.fill(entityData);
	}

	draw(): void {
		this.entityPass.render(
			this.frame.getProjMatrix(),
			this.view.getViewMatrix(),
			this.textureAtlas,
			this.entityPayload,
			this.tilePayload
		);
	}
}