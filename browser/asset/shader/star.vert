
attribute vec2 anchor, indexMap;
uniform float time, visible, indexResolution;
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;
varying float vSplashing;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	float range = 20.;
	float height = 40.;
	float size = 1.;
	
	vec4 pos = modelMatrix * vec4(position, 1);
	float count = indexResolution * indexResolution;
	float index = indexMap.x * indexResolution + indexMap.y * count;
	float r = range * index / count;
	float a = index * .1;
	pos.xz = vec2(cos(a),sin(a)) * r;

	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(vView, vec3(0,1,0)));
	vec3 up = normalize(cross(vec3(1,0,0), right));
	pos.xyz += (right * anchor.x + up * anchor.y) * size;

	vColor = vec3(.75);
	vUv = anchor;

	gl_Position = projectionMatrix * viewMatrix * pos;
}