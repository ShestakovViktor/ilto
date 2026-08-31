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

layout(location = 0) in vec2 a_quadVertex; // Локация сдвинулась на 4
layout(location = 1) in vec2 a_position;
layout(location = 2) in vec2 a_size;
layout(location = 3) in float a_thickness;
layout(location = 4) in vec4 a_color;

out vec4 v_color;

void main() {
	v_color = a_color;

	// ВЫЧИСЛЯЕМ ТИП СЕГМЕНТА НА GPU (0: Left, 1: Right, 2: Top, 3: Bottom)
	int segment_type = gl_InstanceID % 4;

	mat3 projMatrix = mat3(u_projRow0.xyz, u_projRow1.xyz, u_projRow2.xyz);
	mat3 viewMatrix = mat3(u_viewRow0.xyz, u_viewRow1.xyz, u_viewRow2.xyz);

	vec3 viewScale = viewMatrix * vec3(a_size, 0.0f);
	vec3 clipScale = projMatrix * viewScale;
	vec2 sizeInPixels = abs(clipScale.xy * 0.5f * u_viewportSize);

	vec2 pixelOffset = vec2(0.0f);
	vec2 pixelScale = vec2(0.0f);
	vec2 halfSize = sizeInPixels * 0.5f;

	if(segment_type < 2) {
		float side = (segment_type == 0) ? -1.0f : 1.0f;
		pixelOffset.x = side * halfSize.x + (side * a_thickness * 0.5f);
		pixelOffset.y = 0.0f;
		pixelScale.x = a_thickness;
		pixelScale.y = sizeInPixels.y + (a_thickness * 2.0f);
	} else {
		float side = (segment_type == 2) ? -1.0f : 1.0f;
		pixelOffset.x = 0.0f;
		pixelOffset.y = side * halfSize.y + (side * a_thickness * 0.5f);
		pixelScale.x = sizeInPixels.x;
		pixelScale.y = a_thickness;
	}

	vec2 localPixelPos = (a_quadVertex - vec2(0.5f)) * pixelScale + pixelOffset;

	vec2 elementCenterWorld = a_position;
	vec3 viewPos = viewMatrix * vec3(elementCenterWorld, 1.0f);
	vec3 clipPos = projMatrix * viewPos;

	vec2 ndcOffset = (localPixelPos / u_viewportSize) * 2.0f;
	ndcOffset.y *= -1.0f;

	float w = (clipPos.z != 0.0f) ? clipPos.z : 1.0f;
	gl_Position = vec4((clipPos.xy / w + ndcOffset) * w, clipPos.z, w);
}
