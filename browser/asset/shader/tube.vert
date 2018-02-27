
attribute vec2 indexMap, anchor;
varying vec3 vNormal, vView, vColor;
uniform float time, sequenceTextureDimension;
uniform float sequenceCount, sequenceCountDimension, sequenceThin;
uniform vec2 sequenceSegments;
uniform sampler2D sequenceTexture, framebuffer;

#define dimension sequenceTextureDimension
#define segments sequenceSegments.y
#define countDim sequenceCountDimension

void main () {

	float i = indexMap.x * countDim + floor(indexMap.y*countDim) * countDim;
	float y = anchor.y * .5 + .5;
	i = mod(i*segments + y*(segments-1.), dimension*dimension);
	vec2 index = vec2(mod(i, dimension)/dimension, floor(i/dimension)/dimension);

	vec4 frame = texture2D(framebuffer, index);
	vec3 pos = frame.xyz;

	float unit = 1. / dimension;
	vec2 indexNext = vec2(mod(index.x + unit, 1.), index.y + unit * step(1., index.x + unit));
	vec2 indexPrev = vec2(mod(index.x - unit + 1., 1.), index.y - unit * step(index.x, 0.));
	vec3 next = texture2D(framebuffer, indexNext).xyz;
	vec3 prev = texture2D(framebuffer, indexPrev).xyz;

	vec3 up = vec3(0,1,0);
	vec3 forward = mix(normalize(next - pos), normalize(pos - prev), y);
	vec3 right = normalize(cross(forward, up));
	mat4 rotation = rotationMatrix(forward, -anchor.x * PI);
	right = (rotation * vec4(right,1)).xyz;
	pos += right * sequenceThin;

	vNormal = right;
	vView = cameraPosition-pos;
	vColor = vec3(.3,.8,.2);
	
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}