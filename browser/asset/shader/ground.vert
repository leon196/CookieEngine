
uniform sampler2D heightmap;
uniform float time;
varying vec2 vUv;
varying vec3 vView, vPosWorld;

void displace (inout vec3 p, vec2 offset) {
	p.y += texture2DLod(heightmap, uv + offset, 0.).y;
}

void main () {
	vUv = uv;

	vec4 pos = modelMatrix * vec4(position, 1);
	displace(pos.xyz, vec2(0));

	vPosWorld = pos.xyz;
	vView = pos.xyz - cameraPosition;

	gl_Position = projectionMatrix * viewMatrix * pos;
}