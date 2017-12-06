
uniform float time;
uniform vec2 resolution;
uniform vec3 cameraPos;
varying vec2 vUv;
varying vec4 vColor;
varying vec3 vPos;

void main() {
	vUv = uv;
	vPos = position;
	vec3 view = normalize(cameraPos - position);
	vColor = vec4(1.) * abs(dot(-view, normal));
	vColor.a = length(cameraPos - position);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}
