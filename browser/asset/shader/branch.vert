
attribute vec2 indexMap, anchor;
varying vec3 vNormal, vView, vColor;
varying vec2 vUv;
uniform float time, thin, capStart, capEnd;
uniform float count, segmentsX, segmentsY, countDimension, textureDimension;
uniform vec3 color;
uniform sampler2D texture;

uniform float parentCount, parentSegmentsX, parentSegmentsY, parentCountDimension, parentTextureDimension;
uniform sampler2D parentTexture;

#define dimension textureDimension
#define segments (segmentsY)
#define countDim countDimension

#define dimensionParent parentTextureDimension
#define segmentsParent parentSegmentsY
#define countDimParent parentCountDimension

void main () {

	float i = indexMap.x * countDim + floor(indexMap.y*countDim) * countDim;
	float y = anchor.y * .5 + .5;
	float iBranch = mod(i*segments + y*(segments-1.), dimension*dimension);
	vec2 index = vec2(mod(iBranch, dimension)/dimension, iBranch/(dimension*dimension));

	float iParent = mod(mod(i,parentCount)*(segmentsParent)+i*segmentsParent*.1, dimensionParent*dimensionParent);
	vec2 uvParent = vec2(mod(iParent, dimensionParent)/dimensionParent, floor(iParent/dimensionParent)/dimensionParent);
	vec3 parent = texture2D(parentTexture, uvParent).xyz;

	vec3 pos = texture2D(texture, index).xyz;
	// vec3 pos = position;

	float unit = 1. / dimension;
	vec2 indexNext = vec2(mod(index.x + unit, 1.), index.y + unit * step(1., index.x + unit));
	vec2 indexPrev = vec2(mod(index.x - unit + 1., 1.), index.y - unit * step(index.x, 0.));
	vec3 next = texture2D(texture, indexNext).xyz;
	vec3 prev = texture2D(texture, indexPrev).xyz;
	vec3 forward = mix(normalize(next - pos), normalize(pos - prev), y);
	// vec3 right = normalize(cross(forward, normalize(cameraPosition)));
	vec3 right = normalize(cross(forward, vec3(0,1,0)));

	float cap = mix(y, 1., capStart) * mix(1.-y, 1., capEnd);
	pos += right * anchor.x * thin * cap;
	pos += parent;
	// pos.yx += anchor.yx * 10. * thin;// * cap;
	// pos.z += sin(anchor.y*5.+time)*.05;

	vNormal = forward;
	vView = cameraPosition - pos;
	vColor = color * y;
	vUv = anchor * .5 + .5;
	
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}