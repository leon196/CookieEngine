
attribute vec2 anchor, indexMap;
uniform float time, visible, indexResolution;
uniform sampler2D heightmap;
varying vec3 vColor, vNormal, vView;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	vec4 pos = modelMatrix * vec4(position, 1);
	float y = anchor.y*.5+.5;
	float size = .02 * y * visible;
	float range = 10.;
	float height = 1.;
	
	pos.xz = (indexMap * 2. - 1.) * range;
	float index = indexMap.x * indexResolution + indexMap.y * indexResolution * indexResolution;
	// float r = length(pos.xz);
	// float a = atan(pos.z, pos.x);
	float r = index * .001;
	float a = index * .1;
	pos.xz = vec2(cos(a),sin(a)) * r;
	float fade = smoothstep(range*2.,range,length(pos.xz));
	vec3 seed = pos.xyz / 2.;
	vec3 curl = vec3(0);
	float noisy = noiseIQ(seed);
	curl.x = noisy;
	// curl.y = noiseIQ(seed+vec3(1312.5013240, 59.134, 951.0329));
	curl.z = noiseIQ(seed+vec3(954.459,3439.1239,1951.0));
	curl = curl*2.-1.;
	curl = normalize(curl);
	vNormal = curl;
	vColor = mix(greenDark, greenLight, noisy);
	vColor *= smoothstep(1.,.5,y);
	// vColor = greenDark;
	pos.xyz += curl * 2.;
	pos.xz += fade*2.*sin(anchor.y / 2. + noisy * 10. + time)*.1*(1.-y);
	vec2 st = (pos.xz / 50.) * .5 + .5;
	st.y = 1. - st.y;
	float ground = texture2D(heightmap, st).y;
	pos.y = ground + fade*mix(height, 0., y);
	// dir = normalize(pos.xyz - dir);
	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(vView, vec3(0,1,0)));
	vec3 up = normalize(cross(vNormal, right));
	// vNormal = normalize(cross(vView, right));
	pos.xyz += (right * anchor.x + up * anchor.y) * size;
	gl_Position = projectionMatrix * viewMatrix * pos;
}