
attribute vec2 anchor, indexMap;
uniform float time, visible;
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;

const vec3 redLight = vec3(255./255., 72./255., 58./255.);
const vec3 redDark = vec3(157./255., 11./255., 0);

void main () {
	vec4 pos = modelMatrix * vec4(position, 1);
	float salt = rand(indexMap);
	vUv = anchor;
	float y = (anchor.y*.5+.5)*2.+1.;
	float size = (.1 + salt * .2) * visible;
	vec3 curl = vec3(0);
	vec3 seed = pos.xyz * 4. + indexMap.xyy * 100.;

	vec3 dir = pos.xyz;
	float noisy = noiseIQ(seed);
	curl.x = noisy;
	curl.y = noiseIQ(seed+vec3(11.5013240, 5.134, 9.0329));
	curl.z = noiseIQ(seed+vec3(9.459,39.1239,15.0));
	curl = curl * 2. - 1.;
	curl = normalize(curl);
	vNormal = curl;

	vColor = mix(redLight, redDark, noisy);

	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(vView, vec3(0,1,0)));
	vec3 up = normalize(cross(vView, right));
	pos.xyz += (right * anchor.x + up * y) * size;
	gl_Position = projectionMatrix * viewMatrix * pos;
}