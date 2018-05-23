
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

void main () {
	vUv = uv;
	vNormal = normal;

	vec4 pos = modelMatrix * vec4(position, 1);

	vView = pos.xyz - cameraPosition;
	vPosWorld = pos.xyz;

	gl_Position = projectionMatrix * viewMatrix * pos;
}