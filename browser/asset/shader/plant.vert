
attribute vec2 indexMap, anchor;
varying vec3 vNormal, vView;
uniform float dimension, time, thin;
uniform sampler2D dataTexture, framebuffer;

void main () {

	vec3 pos = texture2D(framebuffer, indexMap).xyz;
	vec3 point = pos;

	float unit = 1. / dimension;
	vec2 indexMapNext = vec2(mod(indexMap.x + unit, 1.), indexMap.y + unit * step(1., indexMap.x + unit));
	vec2 indexMapPrev = vec2(mod(indexMap.x - unit + 1., 1.), indexMap.y - unit * step(indexMap.x, 0.));
	vec3 next = texture2D(framebuffer, indexMapNext).xyz;
	vec3 prev = texture2D(framebuffer, indexMapPrev).xyz;

	vec3 forward = normalize(next - pos);
	vec3 up = normalize(cross(normalize(next), normalize(pos)));
	vec3 right = normalize(cross(forward, up));

	vec3 dirNext = normalize(cross(normalize(next-pos), right));
	vec3 dirPrev = normalize(cross(normalize(prev-pos), -right));
	float y = anchor.y * .5 + .5;
	pos = mix(pos, next, y);
	pos += mix(dirPrev, dirNext, y) * thin;

	mat4 rotation = rotationMatrix(forward, -anchor.x * PI);

	pos -= point;
	pos = (rotation * vec4(pos,1)).xyz;
	pos += point;

	// pos -= right * cos(anchor.y * HALFPI) * .05;
	vNormal = (rotation * vec4(pos,1)).xyz;
	vView = pos - cameraPosition;
	
	// lookAt(pos, cameraPosition, anchor * .1);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}