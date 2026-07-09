#version 300 es

uniform sampler2DArray u_entityMatrixArray;
uniform mat3 u_projectionMatrix;
uniform mat3 u_viewMatrix;
uniform vec4 u_borderColor; // Единый цвет для всех рамок (например, зеленый или синий)

// Нам нужно знать, сколько объектов на одном слое текстуры, 
// чтобы правильно переходить на следующий слой.
// Из вашего EntityBuffer: objectsPerLayer = 2048 / 4 = 512
uniform int u_objectsPerLayer;

out vec4 v_color;

void main() {
	v_color = u_borderColor;

    // Вычисляем, на каком слое текстуры и под каким индексом лежит сущность
	int entityIndex = gl_InstanceID % u_objectsPerLayer;
	int layer = gl_InstanceID / u_objectsPerLayer;
	int basePixelX = entityIndex * 4;

    // Читаем данные из EntityBuffer
	vec4 row0 = texelFetch(u_entityMatrixArray, ivec3(basePixelX, 0, layer), 0);
	vec4 row1 = texelFetch(u_entityMatrixArray, ivec3(basePixelX + 1, 0, layer), 0);
	vec4 row2 = texelFetch(u_entityMatrixArray, ivec3(basePixelX + 2, 0, layer), 0);

	float width = row0.w;
	float height = row1.w;

    // Восстанавливаем матрицу 3x3
	mat3 modelMatrix = mat3(vec3(row0.xyz, 0.0f), vec3(row1.xyz, 0.0f), vec3(row2.xyz, 1.0f));
	modelMatrix.z = 1.0f;

    // Генерируем вершины рамки (8 вершин = 4 линии)
	vec2 localVertex;
	switch(gl_VertexID) {
		case 0:
			localVertex = vec2(0.0f, 0.0f);
			break;
		case 1:
			localVertex = vec2(0.0f, 1.0f);
			break;
		case 2:
			localVertex = vec2(0.0f, 1.0f);
			break;
		case 3:
			localVertex = vec2(1.0f, 1.0f);
			break;
		case 4:
			localVertex = vec2(1.0f, 1.0f);
			break;
		case 5:
			localVertex = vec2(1.0f, 0.0f);
			break;
		case 6:
			localVertex = vec2(1.0f, 0.0f);
			break;
		case 7:
			localVertex = vec2(1.0f, 0.0f);
			break;
	}

	vec2 scaledVertex = localVertex * vec2(width, height);
	vec3 worldPos = modelMatrix * vec3(scaledVertex, 1.0f);
	vec3 viewPos = u_viewMatrix * worldPos;
	vec3 clipPos = u_projectionMatrix * vec3(viewPos.xy, 1.0f);

	gl_Position = vec4(clipPos.xy, 0.0f, 1.0f);
}
