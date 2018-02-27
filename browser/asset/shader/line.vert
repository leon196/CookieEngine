
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

	vec3 pos = texture2D(framebuffer, index).xyz;
	vec3 point = pos;

	float unit = 1. / dimension;
	vec2 indexNext = vec2(mod(index.x + unit, 1.), index.y + unit * step(1., index.x + unit));
	vec2 indexPrev = vec2(mod(index.x - unit + 1., 1.), index.y - unit * step(index.x, 0.));
	vec3 next = texture2D(framebuffer, indexNext).xyz;
	vec3 prev = texture2D(framebuffer, indexPrev).xyz;

	// vec3 forward = normalize(next - pos);
	vec3 up = vec3(0,1,0);
	// vec3 up = normalize(next-prev);
	vec3 forward = mix(normalize(next - pos), normalize(pos - prev), y);
	vec3 right = normalize(cross(forward, up));
	mat4 rotation = rotationMatrix(forward, -anchor.x * PI);// + anchor.y + time);
	// right = (rotation * vec4(right,1)).xyz;

	float base = smoothstep(0., 1., y);

	// pos += right * sequenceThin;// * base;// * (.5 + 5. * (.5 + .5 * sin(anchor.y * 3. - time)));
	// pos += right * anchor.x * sequenceThin;
	// pos.x += anchor.x * sequenceThin;
	vec2 pivot = vec2(anchor.x * sequenceThin,0);
	lookAt(pos, cameraPosition, pivot);

	vNormal = cross(forward, right);
	vView = cameraPosition-pos;
	vColor = vec3(.3,.8,.2);
	// vColor = right * .5 + .5;
	
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}