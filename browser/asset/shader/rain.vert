
attribute vec2 anchor, indexMap;
uniform float time, visible, indexResolution, stormIntensity;
uniform vec3 stormDirection;
uniform sampler2D heightmap, heightNormalMap;
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;
varying float vSplashing;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	float range = 20.;
	float height = 40.;
	vec2 size = visible * vec2(.01, 2.);
	vec2 sizeSplash = visible * vec2(.2);
	
	vec4 pos = modelMatrix * vec4(position, 1);
	float y = anchor.y*.5+.5;
	float count = indexResolution * indexResolution;
	float index = indexMap.x * indexResolution + indexMap.y * count;
	float r = range * index / count;
	float a = index * .1;
	pos.xz = vec2(cos(a),sin(a)) * r;

	vec2 st = (pos.xz / 50.) * .5 + .5;
	st.y = 1. - st.y;
	float ground = texture2D(heightmap, st).y;
	float salt = rand(st);
	float ratio = mod(time + salt, 1.);
	float splashAt = .9;
	float ratioFall = smoothstep(.0, splashAt, ratio);
	float ratioSplash = smoothstep(splashAt, 1., ratio);

	float splashing = step(.0001, ratioSplash);
	y = mix(y, anchor.y, splashing);
	size = mix(size, mix(vec2(0), sizeSplash, ratioSplash), splashing);
	pos.y = ground + height * (1.-ratioFall) + .02 * splashing;

	vView = pos.xyz - cameraPosition;
	vec3 right = normalize(cross(vView, vec3(0,1,0)));
	vec3 up = vec3(0,1,0);//normalize(cross(vec3(1,0,0), right));
	vec3 normalMap = texture2D(heightNormalMap, st).xyz;
	right = mix(right, normalize(cross(normalMap, vec3(0,1,0))), splashing);
	up = mix(up, normalize(cross(normalMap, right)), splashing);
	pos.xyz += right * anchor.x * size.x + up * y * size.y;

	pos.xz += normalize(stormDirection).xz * stormIntensity * pos.y * ratioFall; 

	vColor = vec3(.75);
	vSplashing = splashing;
	vUv = anchor;

	gl_Position = projectionMatrix * viewMatrix * pos;
}