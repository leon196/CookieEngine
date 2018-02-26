
attribute vec2 indexMap, anchor;
varying vec3 vNormal, vView, vColor;
uniform float time, dataTextureDimension;
uniform float branchCount, branchCountDimension, branchThin;
uniform vec2 branchSegments;
uniform sampler2D dataTexture, framebuffer;

#define dimension dataTextureDimension
#define segments branchSegments.y
#define countDim branchCountDimension

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

	vec3 forwardNext = normalize(next - pos);
	vec3 up = vec3(0,1,0);//normalize(cross(normalize(next), normalize(pos)));
	// vec3 up = normalize(cross(vec3(0,1,0), normalize(cross(normalize(next), normalize(pos)))));
	vec3 rightNext = normalize(cross(forwardNext, up));
	vec3 forwardPrev = normalize(pos - prev);
	vec3 rightPrev = normalize(cross(forwardPrev, up));
	vec3 forward = normalize(mix(forwardPrev, forwardNext, y));
	vec3 right = normalize(mix(rightPrev, rightNext, y));
	mat4 rotation = rotationMatrix(forward, -anchor.x * PI);// + anchor.y + time);
	right = (rotation * vec4(right,1)).xyz;

	float base = smoothstep(0., 1., y);

	pos += right * branchThin;// * base;// * (.5 + 5. * (.5 + .5 * sin(anchor.y * 3. - time)));
	// pos.x += anchor.x * branchThin;
	// lookAt(pos, vec3(0), anchor * .1);

	vNormal = right;
	vView = cameraPosition-pos;
	vColor = vec3(.3,.8,.2)*y;
	// vColor = right * .5 + .5;
	
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}