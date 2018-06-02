
attribute vec2 anchor, indexMap;
uniform float time, visible, indexResolution, star;
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;
varying float vSplashing;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	float range = 20.;
	float height = 100.;
	float staring = smoothstep(0., 1., star);
	float size = .2 - .1 * staring;
	
	vec4 pos = modelMatrix * vec4(position, 1);
	float count = indexResolution * indexResolution;
	float index = indexMap.x * indexResolution + indexMap.y * count;
	float salt = rand(indexMap);
	float a = index * .5564 + salt + star + (.5 + .5 * salt) * anchor.y * .2 * staring;
	pos.x = 90.;
	pos.xz *= rot(a*.9986);
	pos.xy *= rot(a*.6654);
	pos.zy *= rot(a*.36546);
	pos.y = abs(pos.y);

	vView = pos.xyz - cameraPosition;
	vec3 up = vec3(0,1,0);
	vec3 right = normalize(cross(vView, up));
	right = (vec4(right, 1) * rotationMatrix(vView, salt * TAU)).xyz;
	size *= .5+.5*salt;
	pos.xyz += (right * anchor.x + up * anchor.y) * size;

	vColor = vec3(1);
	vUv = anchor;

	gl_Position = projectionMatrix * viewMatrix * pos;
}