
varying vec3 vNormal;

void main () {
	vNormal = normal;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}