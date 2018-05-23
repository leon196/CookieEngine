
varying vec2 vUv;
varying vec3 vNormal;

void main () {
	vUv = uv;
	vNormal = normal;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}