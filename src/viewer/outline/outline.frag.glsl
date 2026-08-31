#version 300 es
precision highp float;

in vec4 v_color;
out vec4 fragColor;

void main() {
	if(v_color.a == 0.0f) {
		discard;
	}
	fragColor = v_color;
}
