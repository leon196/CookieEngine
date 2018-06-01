
attribute vec2 anchor, indexMap;
uniform float time, visible, indexResolution, stormIntensity, bounce, twist;
uniform vec3 stormDirection;
uniform sampler2D heightmap, heightNormalMap;
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;
varying float vSplashing;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	float range = 20.;
	float height = 4.;
	float size = .04 * visible;
	float speed = 2.;

	vec4 pos = modelMatrix * vec4(position, 1);
	pos.xyz += normal * .5;

	vec3 seed = pos.xyz * 4. + indexMap.xyy * 100.;
	vec3 curl = vec3(0);
	curl.x = noiseIQ(seed);
	// curl.y = noiseIQ(seed+vec3(11.5013240, 5.134, 9.0329));
	curl.z = noiseIQ(seed+vec3(9.459,39.1239,15.0));
	curl = curl * 2. - 1.;
	curl = normalize(curl);

	vec2 st = (pos.xz / 50.) * .5 + .5;
	st.y = 1. - st.y;
	float ground = texture2D(heightmap, st).y;
	float salt = rand(indexMap);
	float ratio = mod(time * speed + salt, 1.);
	float splashAt = .9;
	float ratioFall = smoothstep(.0, splashAt, ratio);
	float ratioSplash = smoothstep(1., splashAt, ratio);

	seed = pos.xyz*.2;
	seed.xz *= rot(time*1.9551);
	seed.yz *= rot(time*1.6519);
	seed.yx *= rot(time*1.3216);
	float shouldBounce = bounce * smoothstep(.3, 1., noiseIQ(seed));
	pos.xyz += curl * abs(sin(salt + time * 2. * PI)) * shouldBounce * 4.;
	float d = length(pos.xz);
	d = sin(d * .5 + time * 4.);
	pos.xz *= rot(d * shouldBounce * twist);
	pos.yz *= rot(d * shouldBounce * twist * .6);
	pos.yx *= rot(d * shouldBounce * twist * .3);

	// float splashing = step(.0001, ratioSplash);
	// y = mix(y, anchor.y, splashing);
	// size = mix(size, mix(vec2(0), sizeSplash, ratioSplash), splashing);
	// pos.y = mix(max(ground + .1 * splashing, pos.y - height), pos.y, (1.-ratioFall));
	pos.xyz += curl * ratio * 2.;
	pos.y += mix(sin(ratio*PI), -ratio, clamp(stormIntensity, 0., 1.));

	pos.xz += -normalize(stormDirection).xz * stormIntensity * pos.y * ratioFall * .1; 

	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(vView, vec3(0,1,0)));
	vec3 up = normalize(cross(vView, -right));
	vec3 normalMap = texture2D(heightNormalMap, st).xyz;
	// right = mix(right, normalize(cross(normalMap, vec3(0,1,0))), splashing);
	// up = mix(up, normalize(cross(normalMap, right)), splashing);
	pos.xyz += (right * anchor.x + up * anchor.y) * size * ratioSplash;

	vColor = vec3(.9);
	// vSplashing = splashing;
	vUv = anchor;

	gl_Position = projectionMatrix * viewMatrix * pos;
}