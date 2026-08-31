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
	SharedBuffer,
} from "@src/viewer/shared/controller";

import type {AdornerManager} from "@src/viewer/adorner";

import type {
	EntityConfig,
	TextureConfig,
	TileConfig,
} from "@src/viewer/shared/type";
import type {DataRepository} from "@src/storage/controller";

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

	private sharedBuffer!: SharedBuffer;

	private textureAtlas!: TextureAtlas;
	private textureManager!: TextureManager;

	private entityPacker!: EntityPacker;
	private entityPayload!: EntityPayload;

	private tilePacker!: TilePacker;
	private tilePayload!: TilePayload;

	private entityPass!: EntityPass;

	constructor(
		private repo: DataRepository,
		private view: View,
		private frame: Frame,
		private scene: Scene,
		private adorner: AdornerManager
	) {}

	setCanvas(
		canvas: HTMLCanvasElement
	): void {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		this.gl = canvas.getContext("webgl2", {premultipliedAlpha: false})!;
		this.gl.viewport(0, 0, canvas.width, canvas.height);
		this.frame.setSize(0, 0, canvas.width, canvas.height);

		this.shear = new Shear(this.tileConfig);

		this.compiler = new ShaderCompiler(this.gl);

		this.sharedBuffer = new SharedBuffer(this.gl);
		this.adorner.init(this.gl, this.compiler);

		this.textureAtlas = new TextureAtlas(
			this.gl,
			this.textureConfig,
			this.tileConfig
		);

		this.textureManager = new TextureManager(
			this.textureAtlas,
			this.repo,
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

		this.scene.fillSceneGraph(1);
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
		this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.sharedBuffer.update(
			this.frame.getProjMatrix(),
			this.view.getViewMatrix(),
			this.frame.w,
			this.frame.h
		);

		this.entityPass.render(
			this.textureAtlas,
			this.entityPayload,
			this.tilePayload
		);

		this.adorner.render();
	}
}