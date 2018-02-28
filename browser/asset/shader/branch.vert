
attribute vec2 indexMap, anchor;
varying vec3 vNormal, vView, vColor;
varying vec2 vUv;
uniform float time, thin, capStart, capEnd;
uniform float branchCount, branchSegments, branchCountDimension, branchTextureDimension;
uniform vec3 color;
uniform sampler2D branchTexture;

uniform float branchParentCount, branchParentCountDimension, branchParentSegments, branchParentTextureDimension;
uniform sampler2D branchParentTexture;

#define dimension branchTextureDimension
#define segments branchSegments
#define countDim branchCountDimension

#define dimensionParent branchParentTextureDimension
#define segmentsParent branchParentSegments
#define countDimParent branchParentCountDimension

void main () {

	float i = indexMap.x * countDim + floor(indexMap.y*countDim) * countDim;
	float y = anchor.y * .5 + .5;
	float iBranch = mod(i*segments + y*(segments-1.), dimension*dimension);
	vec2 index = vec2(mod(iBranch, dimension)/dimension, floor(iBranch/dimension)/dimension);

	float iParent = mod(mod(i,branchParentCount)*(segmentsParent-1.)+segmentsParent*.95, dimensionParent*dimensionParent);
	vec2 uvParent = vec2(mod(iParent, dimensionParent)/dimensionParent, floor(iParent/dimensionParent)/dimensionParent);
	vec3 parent = texture2D(branchParentTexture, uvParent).xyz;

	vec3 pos = texture2D(branchTexture, index).xyz;
	// vec3 pos = position;

	pos += parent;

	float unit = 1. / dimension;
	vec2 indexNext = vec2(mod(index.x + unit, 1.), index.y + unit * step(1., index.x + unit));
	vec2 indexPrev = vec2(mod(index.x - unit + 1., 1.), index.y - unit * step(index.x, 0.));
	vec3 next = texture2D(branchTexture, indexNext).xyz + parent;
	vec3 prev = texture2D(branchTexture, indexPrev).xyz + parent;
	vec3 forward = mix(normalize(next - pos), normalize(pos - prev), y);
	vec3 right = normalize(cross(forward, normalize(cameraPosition)));

	float cap = mix(y, 1., capStart) * mix(1.-y, 1., capEnd);
	pos += right * anchor.x * thin * cap;
	// pos.x += anchor.x * thin * cap;
	// pos.y += sin(anchor.y*5.+time)*.2;

	vNormal = forward;
	vView = cameraPosition - pos;
	vColor = color * y;
	vUv = anchor * .5 + .5;
	
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}