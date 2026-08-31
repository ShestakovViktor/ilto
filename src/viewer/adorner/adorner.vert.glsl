#version 300 es

layout(std140) uniform SharedBuffer {
	vec4 u_projRow0;
	vec4 u_projRow1;
	vec4 u_projRow2;
	vec4 u_viewRow0;
	vec4 u_viewRow1;
	vec4 u_viewRow2;
	vec2 u_viewportSize;
};

struct AdornerDesc {
	vec4 params;
};

layout(std140) uniform AdornerBuffer {
	AdornerDesc u_adorners[32];
};

layout(location = 0) in vec2 a_position;
layout(location = 1) in int a_type;
layout(location = 2) in vec4 a_color;
layout(location = 3) in vec2 a_quadVertex;

flat out int v_type;
out vec4 v_color;
out vec2 v_localCoords;

void main() {
	v_type = a_type;
	v_color = a_color;

	AdornerDesc adorner = u_adorners[a_type];

	mat3 projMatrix = mat3(u_projRow0.xyz, u_projRow1.xyz, u_projRow2.xyz);
	mat3 viewMatrix = mat3(u_viewRow0.xyz, u_viewRow1.xyz, u_viewRow2.xyz);

	vec3 viewPos = viewMatrix * vec3(a_position, 1.0f);
	vec3 clipPos = projMatrix * viewPos;

	float halfSize = adorner.params.y * 0.5f;

	vec2 offsetInPixels = (a_quadVertex - vec2(0.5f)) * (halfSize * 2.0f);
	v_localCoords = offsetInPixels;

	vec2 ndcOffset = (offsetInPixels / u_viewportSize) * 2.0f;
	ndcOffset.y *= -1.0f;

	float w = (clipPos.z != 0.0f) ? clipPos.z : 1.0f;
	gl_Position = vec4((clipPos.xy / w + ndcOffset) * w, clipPos.z, w);
}
