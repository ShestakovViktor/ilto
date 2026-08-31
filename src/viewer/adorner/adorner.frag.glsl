#version 300 es
precision highp float;

struct AdornerDesc {
	vec4 params;
};

layout(std140) uniform AdornerBuffer {
	AdornerDesc u_adorners[32];
};

in vec2 v_localCoords;
flat in int v_type;
in vec4 v_color;

out vec4 fragColor;

float sdfSegment(vec2 p, vec2 a, vec2 b) {
	vec2 pa = p - a, ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0f, 1.0f);
	return length(pa - ba * h);
}

float sdfCircleStroke(vec2 p, float r, float thickness) {
	return abs(length(p) - r) - (thickness * 0.5f);
}

vec4 drawPivot(vec2 p, AdornerDesc adorner, float aa, vec4 instanceColor) {
	float lineLength = adorner.params.y * 0.5f;
	float thickness = adorner.params.z;

	float dAxisX = sdfSegment(p, vec2(0.0f), vec2(lineLength, 0.0f));
	float dAxisY = sdfSegment(p, vec2(0.0f), vec2(0.0f, lineLength));
	float dAxes = min(dAxisX, dAxisY) - (thickness * 0.5f);

	float axesAlpha = 1.0f - smoothstep(-aa, aa, dAxes);

	return instanceColor * axesAlpha;
}

vec4 drawDot(vec2 p, AdornerDesc adorner, float aa, vec4 instanceColor) {
	float thickness = adorner.params.z;
	float radius = (adorner.params.y * 0.5f) - (thickness * 0.5f);

	float dRing = sdfCircleStroke(p, radius, thickness);
	float ringAlpha = 1.0f - smoothstep(-aa, aa, dRing);

	return instanceColor * ringAlpha;
}

void main() {
	AdornerDesc adorner = u_adorners[v_type];

	float aa = fwidth(length(v_localCoords)) * 0.5f;
	if(aa == 0.0f)
		aa = 0.707f;

	vec2 p = v_localCoords;
	vec4 finalColor = vec4(0.0f);

	switch(v_type) {
		case 0:
			finalColor = drawPivot(p, adorner, aa, v_color);
			break;
		case 1:
			finalColor = drawDot(p, adorner, aa, v_color);
			break;
	}

	if(finalColor.a < 0.01f) {
		discard;
	}

	fragColor = finalColor;
}
