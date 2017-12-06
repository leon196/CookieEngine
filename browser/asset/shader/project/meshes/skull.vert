
attribute float seed;
uniform float time;
uniform float Skull, Disolve, Electrify;
uniform vec2 resolution;
uniform vec3 cameraPos;
uniform vec3 SkullPosition;
varying vec4 vColor;
varying vec3 vPos;

void main() {
	vec3 pos = position;
	// vec3 seed = pos;
	float t = time;
	// seed.xz *= rot(t*.9);
	// seed.xy *= rot(t*.6);
	// seed.zy *= rot(t*.3);
	// pos.xz *= rot(PI);
	// pos.z -= 1.5;
	pos += SkullPosition;
	pos += normalize(pos-vec3(0,2.5,0)) * rand(vec2(seed+time)) * Electrify;
	pos.z -= mod(time + seed*.0005, 5.) * Disolve;
	vPos = pos;
	// vec3 view = normalize(cameraPos - pos);
	vColor = vec4(1.);// * abs(dot(-view, normal));
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	gl_Position.y += sin(abs(gl_Position.x)+time)*.05;
}
