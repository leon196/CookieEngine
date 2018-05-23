
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView;

void main () {
	vUv = uv;
	vNormal = normal;

	vec4 pos = modelMatrix * vec4(position, 1);

	vView = pos.xyz - cameraPosition;

	// float wave = sin(time + pos.y);
	// pos.xz += normalize(pos.xz) * wave;
	// pos.y -= wave;

	// pos.xyz += vNormal * sin(vUv.x * PI) * .5;

	gl_Position = projectionMatrix * viewMatrix * pos;
}