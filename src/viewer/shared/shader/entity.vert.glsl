#version 300 es
precision highp float;

layout(std140) uniform SharedBuffer {
	vec4 u_projRow0;
	vec4 u_projRow1;
	vec4 u_projRow2;
	vec4 u_viewRow0;
	vec4 u_viewRow1;
	vec4 u_viewRow2;
	vec2 u_viewportSize;
};

in vec2 a_quadVertex;

in vec2 a_tileGrid;
in vec2 a_tileUvMin;
in vec2 a_tileUvMax;
in float a_tileLayer;
in float a_entityMatrixIndex;
in float a_entityMatrixLayer;

out vec3 v_texCoord;
out float v_opacity;
out float v_hoverState;

uniform float u_tileSize;

uniform highp sampler2DArray u_entityMatrixArray;

void main() {
	mat3 projMatrix = mat3(u_projRow0.xyz, u_projRow1.xyz, u_projRow2.xyz);
	mat3 viewMatrix = mat3(u_viewRow0.xyz, u_viewRow1.xyz, u_viewRow2.xyz);

	int entityMatrixIndex = int(a_entityMatrixIndex) * 4;
	int entityMatrixLayer = int(a_entityMatrixLayer);

	ivec3 entityMatrixPixel0 = ivec3(entityMatrixIndex, 0, entityMatrixLayer);
	ivec3 entityMatrixPixel1 = ivec3(entityMatrixIndex + 1, 0, entityMatrixLayer);
	ivec3 entityMatrixPixel2 = ivec3(entityMatrixIndex + 2, 0, entityMatrixLayer);
	ivec3 entityMatrixPixel3 = ivec3(entityMatrixIndex + 3, 0, entityMatrixLayer);

	vec4 entityMatrixColumn0 = texelFetch(u_entityMatrixArray, entityMatrixPixel0, 0);
	vec4 entityMatrixColumn1 = texelFetch(u_entityMatrixArray, entityMatrixPixel1, 0);
	vec4 entityMatrixColumn2 = texelFetch(u_entityMatrixArray, entityMatrixPixel2, 0);
	vec4 entityMatrixColumn3 = texelFetch(u_entityMatrixArray, entityMatrixPixel3, 0);

	mat3 modelMatrix = mat3(entityMatrixColumn0.xyz, entityMatrixColumn1.xyz, entityMatrixColumn2.xyz);

	mat3 mvpMatrix = projMatrix * viewMatrix * modelMatrix;

	float entityOrder = entityMatrixColumn2.w;
	float entityOpacity = entityMatrixColumn3.r;
	float entityHover = entityMatrixColumn3.g;

	v_opacity = entityOpacity;
	v_hoverState = entityHover;

	// 

	vec2 assetSize = vec2(entityMatrixColumn0.w, entityMatrixColumn1.w);
	vec2 halfAssetSize = round(assetSize / 2.0f);

	vec2 tileMin = a_tileGrid * u_tileSize;
	vec2 tileMax = tileMin + u_tileSize;
	vec2 tileSize = vec2(u_tileSize, u_tileSize);

	if(tileMax.x > assetSize.x) {
		tileSize.x = u_tileSize - (tileMax.x - assetSize.x);
	}
	if(tileMax.y > assetSize.y) {
		tileSize.y = u_tileSize - (tileMax.y - assetSize.y);
	}

	vec2 srcVertex = a_quadVertex * tileSize;

	vec3 locVertex = vec3(tileMin - halfAssetSize + srcVertex, 1.0f);

	vec3 ndcVertex = mvpMatrix * locVertex;

	float normalizedZ = (entityOrder / 10000.0f) * 2.0f - 1.0f;

	gl_Position = vec4(ndcVertex.xy, normalizedZ, 1.0f);

	vec2 ratio = srcVertex / u_tileSize;
	vec2 uv = mix(a_tileUvMin, a_tileUvMax, ratio);
	v_texCoord = vec3(uv, a_tileLayer);
}
