
attribute vec2 anchor, indexMap;
uniform float time;
varying vec3 vColor, vNormal, vView;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	vec4 pos = modelMatrix * vec4(position, 1);
	float y = anchor.y*.5+.5;
	pos.xz = (indexMap * 2. - 1.) * 20.;
	vec3 seed = pos.xyz / 2.;
	pos.y = 1.+mix(abs(pos.y) * .5, 0., y) + length(pos.xz) * .1;
	float size = .02 * y;
	vec3 curl = vec3(0);
	vec3 dir = pos.xyz;
	float noisy = noiseIQ(seed);
	curl.x = -1.+2.*noisy;
	// curl.y = -1.+2.*noiseIQ(seed+vec3(1312.5013240, 59.134, 951.0329));
	curl.z = -1.+2.*noiseIQ(seed+vec3(954.459,3439.1239,1951.0));
	vNormal = normalize(curl);
	vColor = mix(greenLight, greenDark, noisy);
	// vColor = greenLight;
	pos.xyz += curl * 2.;
	pos.xz += sin(anchor.y / 2. + time + noisy * 10.)*.1*(1.-y);
	// dir = normalize(pos.xyz - dir);
	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(vNormal, vec3(0,1,0)));
	// vNormal = normalize(cross(vView, right));
	pos.xyz += (right * anchor.x + vNormal * anchor.y) * size;
	gl_Position = projectionMatrix * viewMatrix * pos;
}