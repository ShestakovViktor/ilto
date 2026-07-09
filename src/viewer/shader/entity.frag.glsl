#version 300 es
precision highp float;

in vec3 v_texCoord;
in float v_opacity;
in float v_hoverState;

uniform highp sampler2DArray u_textureArray;

out vec4 outColor;

void main() {
    // Используем стандартную выборку texture() с включенным gl.LINEAR в атласе
	vec4 texColor = texture(u_textureArray, v_texCoord);

    // Микро-оптимизация прозрачности
	if(texColor.a < 0.01f) {
		discard;
	}

	texColor.a *= v_opacity;

    // Подсветка при ховере
	if(v_hoverState > 0.5f) {
		texColor.rgb = mix(texColor.rgb, vec3(1.0f, 1.0f, 1.0f), 0.2f);
	}

	outColor = texColor;
}
