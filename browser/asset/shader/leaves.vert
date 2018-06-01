
attribute vec2 anchor, indexMap;
uniform float time, visible, bounce, twist;
varying vec3 vColor, vNormal, vView;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	float salt = rand(indexMap);
	vec4 pos = modelMatrix * vec4(position, 1);
	vec2 pivot = anchor * rot(PI/4.);
	float y = (pivot.y*.5+.5)*2.;
	float size = (.05 + .05 * salt) * visible;
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
	vColor = mix(greenLight, greenDark, noisy);

	seed = pos.xyz*.2;
	seed.xz *= rot(time*.9551);
	seed.yz *= rot(time*.6519);
	seed.yx *= rot(time*.3216);
	float shouldBounce = bounce * smoothstep(.3, 1., noiseIQ(seed));
	pos.xyz += curl * abs(sin(salt + time * PI)) * shouldBounce * 12.;
	float d = length(pos.xz);
	d = sin(d * .5 + time * 4.);
	// pos.xz *= rot(d * shouldBounce * twist);
	// pos.yz *= rot(d * shouldBounce * twist * .6);
	// pos.yx *= rot(d * shouldBounce * twist * .3);
	
	pos.xyz += curl * (1.+y) * size * 2. * visible;
	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(curl, -vView));//vec3(0,1,0)));
	pos.xyz += right * pivot.x * size;

	gl_Position = projectionMatrix * viewMatrix * pos;
}