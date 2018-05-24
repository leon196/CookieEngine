
attribute vec2 anchor, indexMap;
uniform float time;
uniform sampler2D heightmap;
varying vec3 vColor, vNormal, vView;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	vec4 pos = modelMatrix * vec4(position, 1);
	float y = anchor.y*.5+.5;
	pos.xz = (indexMap * 2. - 1.) * 50.;
	vec3 seed = pos.xyz / 2.;
	vec3 curl = vec3(0);
	float noisy = noiseIQ(seed);
	curl.x = -1.+2.*noisy;
	// curl.y = -1.+2.*noiseIQ(seed+vec3(1312.5013240, 59.134, 951.0329));
	curl.z = -1.+2.*noiseIQ(seed+vec3(954.459,3439.1239,1951.0));
	vNormal = normalize(curl);
	vColor = mix(greenDark, greenLight, noisy);
	// vColor = greenDark;
	pos.xyz += curl * 2.;
	pos.xz += sin(anchor.y / 2. + noisy * 10.)*.1*(1.-y);
	vec2 st = (pos.xz / 50.) * .5 + .5;
	st.y = 1. - st.y;
	float ground = texture2D(heightmap, st).y;
	pos.y = ground+mix(1., 0., y);
	float size = .05 * y;
	// dir = normalize(pos.xyz - dir);
	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(vNormal, vec3(0,1,0)));
	// vNormal = normalize(cross(vView, right));
	pos.xyz += (right * anchor.x + vNormal * anchor.y) * size;
	gl_Position = projectionMatrix * viewMatrix * pos;
}