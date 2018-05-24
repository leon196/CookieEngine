
attribute vec2 anchor, indexMap;
uniform float time;
varying vec3 vColor, vNormal, vView;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	vec4 pos = modelMatrix * vec4(position, 1);
	float size = .2;
	vec3 curl = vec3(0);
	vec3 seed = pos.xyz * 4. + indexMap.xyy * 50.;
	// seed.xz *= rot(time*.1);
	// seed.yz *= rot(time*.1);
	// seed.yx *= rot(time*.1);
	// float salt = rand(indexMap);
	// float ratio = mod(time * .2 + salt, 1.);
	// size *= smoothstep(.0, .2, ratio) * smoothstep(1., .8, ratio);
	// pos.y -= smoothstep(.1, .9, ratio) * 5.;
	vec3 dir = pos.xyz;
	float noisy = noiseIQ(seed);
	curl.x = -1.+2.*noisy;
	curl.y = -1.+2.*noiseIQ(seed+vec3(1312.5013240, 59.134, 951.0329));
	curl.z = -1.+2.*noiseIQ(seed+vec3(954.459,3439.1239,1951.0));
	// curl *= 1. + ratio * 10.;
	vColor = mix(greenLight, greenDark, noisy);
	// vColor = greenDark;
	pos.xyz += curl;
	dir = normalize(pos.xyz - dir);
	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(dir, vec3(0,1,0)));
	vNormal = normalize(cross(dir, right));
	pos.xyz += (right * anchor.x + dir * anchor.y) * size;
	gl_Position = projectionMatrix * viewMatrix * pos;
}