
attribute vec2 indexMap, anchor;
varying vec3 vNormal, vView, vColor;
varying vec2 vUv;
uniform float time, branchTextureDimension;
uniform float branchCount, branchCountDimension, thin;
uniform float capStart, capEnd;
uniform vec2 branchSegments;
uniform vec3 color;
uniform sampler2D branchTexture, framebuffer;

#define dimension branchTextureDimension
#define segments branchSegments.y
#define countDim branchCountDimension

void main () {

	float i = indexMap.x * countDim + floor(indexMap.y*countDim) * countDim;
	float y = anchor.y * .5 + .5;
	i = mod(i*segments + y*(segments-1.), dimension*dimension);
	vec2 index = vec2(mod(i, dimension)/dimension, floor(i/dimension)/dimension);
	vec3 pos = texture2D(framebuffer, index).xyz;

	float unit = 1. / dimension;
	vec2 indexNext = vec2(mod(index.x + unit, 1.), index.y + unit * step(1., index.x + unit));
	vec2 indexPrev = vec2(mod(index.x - unit + 1., 1.), index.y - unit * step(index.x, 0.));
	vec3 next = texture2D(framebuffer, indexNext).xyz;
	vec3 prev = texture2D(framebuffer, indexPrev).xyz;
	vec3 forward = mix(normalize(next - pos), normalize(pos - prev), y);
	vec3 right = normalize(cross(forward, normalize(cameraPosition)));

	float cap = mix(y, 1., capStart) * mix(1.-y, 1., capEnd);
	pos += right * anchor.x * thin * cap;

	vNormal = forward;
	vView = cameraPosition - pos;
	vColor = color * y;
	vUv = anchor * .5 + .5;
	
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}