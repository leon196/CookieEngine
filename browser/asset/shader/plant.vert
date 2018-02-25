
attribute vec2 indexMap, anchor;
varying vec3 vNormal, vView;
uniform float dimension, time, thin;
uniform sampler2D dataTexture;

void main () {

	vec3 pos = texture2D(dataTexture, indexMap).xyz;
	vec3 point = pos;

	float dim = dimension * dimension;
	float index = floor(indexMap.x * dimension) + floor(indexMap.y * dim);
	float indexNext = min(index + 1., dim);
	float indexPrev = max(index - 1., 0.);
	vec2 indexMapNext = vec2(mod(indexNext, dimension)/dimension, floor(indexNext/dimension)/dimension);
	vec2 indexMapPrev = vec2(mod(indexPrev, dimension)/dimension, floor(indexPrev/dimension)/dimension);
	vec3 next = texture2D(dataTexture, indexMapNext).xyz;
	vec3 prev = texture2D(dataTexture, indexMapPrev).xyz;

	vec3 forward = normalize(next - pos);
	vec3 up = normalize(cross(normalize(next), normalize(pos)));
	vec3 right = normalize(cross(forward, up));
	float angle = atan(pos.z,pos.x);

	vec3 dir = right;
	vec3 dirNext = normalize(cross(normalize(next-pos), dir));
	vec3 dirPrev = normalize(cross(normalize(prev-pos), -dir));
	float y = anchor.y * .5 + .5;
	pos = mix(pos, next, y);
	pos += mix(dirPrev, dirNext, y) * thin;

	mat4 rotation = rotationMatrix(forward, -anchor.x * PI);

	pos -= point;
	pos = (rotation * vec4(pos,1)).xyz;
	pos += point;

	pos -= dir * cos(anchor.y * HALFPI) * .05;
	vNormal = (rotation * vec4(pos,1)).xyz;
	vView = pos - cameraPosition;
	
	// lookAt(pos, cameraPosition, anchor * .1);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}