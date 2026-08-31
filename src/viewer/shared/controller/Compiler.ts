export class ShaderCompiler {
	constructor(private readonly gl: WebGL2RenderingContext) {}

	compile(
		vertexSource: string,
		fragmentSource: string
	): WebGLProgram {
		const gl = this.gl;

		const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
		gl.shaderSource(vertexShader, vertexSource);
		gl.compileShader(vertexShader);

		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(vertexShader);
			gl.deleteShader(vertexShader);
			throw new Error(`Ошибка компиляции вершинного шейдера: ${info}`);
		}

		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
		gl.shaderSource(fragmentShader, fragmentSource);
		gl.compileShader(fragmentShader);

		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(fragmentShader);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			throw new Error(`Ошибка компиляции фрагментного шейдера: ${info}`);
		}

		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(program);
			gl.deleteProgram(program);
			throw new Error(`Ошибка линковки шейдерной программы: ${info}`);
		}

		gl.detachShader(program, vertexShader);
		gl.detachShader(program, fragmentShader);
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);

		return program;
	}
}