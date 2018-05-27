
attribute vec2 anchor, indexMap;
uniform float time, visible;
varying vec3 vColor, vNormal, vView;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	vec4 pos = modelMatrix * vec4(position, 1);
	vec2 pivot = anchor * rot(PI/4.);
	float y = (pivot.y*.5+.5)*2.;
	float size = .1 * visible;
	vec3 curl = vec3(0);
	vec3 seed = pos.xyz * 4. + indexMap.xyy * 100.;
	// seed.xz *= rot(time*.1);
	// seed.yz *= rot(time*.1);
	// seed.yx *= rot(time*.1);
	// float salt = rand(indexMap);
	// float ratio = mod(time * .2 + salt, 1.);
	// size *= smoothstep(.0, .2, ratio) * smoothstep(1., .8, ratio);
	// pos.y -= smoothstep(.1, .9, ratio) * 5.;
	vec3 dir = pos.xyz;
	float noisy = noiseIQ(seed);
	curl.x = noisy;
	curl.y = noiseIQ(seed+vec3(11.5013240, 5.134, 9.0329));
	curl.z = noiseIQ(seed+vec3(9.459,39.1239,15.0));
	curl = curl * 2. - 1.;
	curl = normalize(curl);
	vNormal = curl;
	// curl *= 1. + ratio * 10.;
	vColor = mix(greenLight, greenDark, noisy);
	// vColor = greenLight;
	pos.xyz += curl * (1.+y) * size * 2. * visible;
	// dir = normalize(pos.xyz - dir);
	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(curl, vec3(0,1,0)));
	pos.xyz += right * pivot.x * size;
	gl_Position = projectionMatrix * viewMatrix * pos;
}