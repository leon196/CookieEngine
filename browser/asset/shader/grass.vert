
attribute vec2 anchor, indexMap;
uniform float time, visible, indexResolution, wavy;
uniform sampler2D heightmap;
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);
const vec3 brownLight = vec3(1,0.886,0.667);
const vec3 brownDark = vec3(0.502,0.357,0.082);

void main () {
	vec4 pos = modelMatrix * vec4(position, 1);
	float y = anchor.y*.5+.5;
	float size = 2.;
	float range = 10.;
	float height = .7;
	vUv = anchor * .5 + .5;
	
	pos.xz = (indexMap * 2. - 1.) * range;
	float index = indexMap.x * indexResolution + indexMap.y * indexResolution * indexResolution;
	// index += anchor.x * .1;
	// float r = length(pos.xz);
	// float a = atan(pos.z, pos.x);
	float a = index * .4;
	float r = 1. + index * .07 + sin(anchor.x * 3. + index + wavy) * .5;
	pos.xz = vec2(cos(a),sin(a)) * r;
	vec3 seed = pos.xyz * 2. + anchor.xxx * 4.;
	vec3 curl = vec3(0);
	float noisy = noiseIQ(seed);
	curl.x = noisy;
	// curl.y = noiseIQ(seed+vec3(1312.5013240, 59.134, 951.0329));
	curl.z = noiseIQ(seed+vec3(954.459,3439.1239,1951.0));
	curl = curl*2.-1.;
	curl = normalize(curl);
	vNormal = curl;
	vColor = mix(greenDark, greenLight, noisy);
	vColor = mix(brownLight*.25, vColor, smoothstep(1.,.5,y));

	vec3 right = curl * .5 + normalize(vec3(pos.z, pos.y, -pos.x));//normalize(cross(curl, vView));
	vec3 up = vec3(0,1,0);

	// pos.xyz += curl * .5;

	float fade = .5+.5*smoothstep(.0, .1, vUv.x) * smoothstep(1., .9, vUv.x);
	fade *= smoothstep(80.*visible, 50.*visible, length(pos.xz));
	pos.xyz += right * anchor.x * size;
	pos.xz += fade*sin(anchor.y / 2. + noisy * 2. + time)*.1*(1.-y);

	vec2 st = (pos.xz / 50.) * .5 + .5;
	st.y = 1. - st.y;
	float ground = texture2D(heightmap, st).y;
	pos.y = ground + fade*mix(height, 0., y);

	vView = pos.xyz - cameraPosition;

	gl_Position = projectionMatrix * viewMatrix * pos;
}