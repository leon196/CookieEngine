
attribute vec2 anchor, indexMap;
uniform float time, visible, bounce;
uniform sampler2D heightmap, heightNormalMap;
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;
varying float vBounce;

const vec3 redLight = vec3(255./255., 72./255., 58./255.);
const vec3 redDark = vec3(157./255., 11./255., 0);

void main () {
	vec4 pos = modelMatrix * vec4(position, 1);
	float salt = rand(indexMap);
	vUv = anchor;
	float size = (.05 + salt * .1);

	vec3 seed = pos.xyz*.4 + indexMap.xyy * 2.;
	seed.xz *= rot(time*.9551);
	seed.yz *= rot(time*.6519);
	seed.yx *= rot(time*.3216);
	float noisy = noiseIQ(seed);
	vec3 curl;
	curl.x = noisy;
	curl.y = noiseIQ(seed+vec3(11.5013240, 5.134, 9.0329));
	curl.z = noiseIQ(seed+vec3(9.459,39.1239,15.0));
	curl = curl * 2. - 1.;
	curl = normalize(curl);

	pos.xyz += curl * .4 * salt * bounce;

	vBounce = bounce * smoothstep(.5, .8, noisy);
	float y = (1.+vBounce) * (anchor.y*.5+.5)*2. * visible;

	size *= 1. + .5 * abs(sin(time * 8.)) * vBounce;

	seed = pos.xyz * 4. + indexMap.xyy * 100.;

	vec3 dir = pos.xyz;
	noisy = noiseIQ(seed);

	vColor = mix(redLight, redDark, noisy);

	// vec2 st = (pos.xz / 50.) * .5 + .5;
	// st.y = 1. - st.y;
	// float ground = texture2D(heightmap, st).y;
	// float ratio = mod(time * .5 + salt, 1.);
	// pos.y = mix(pos.y, ground, ratio);

	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(vView, vec3(0,1,0)));
	vec3 up = normalize(cross(vView, right));
	pos.xyz += (-right * anchor.x * visible * (1.+vBounce) + up * y) * size;
	gl_Position = projectionMatrix * viewMatrix * pos;
}