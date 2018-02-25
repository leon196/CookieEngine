
attribute vec2 indexMap, anchor;
varying vec3 vNormal, vView, vColor;
uniform float dimension, count, time, thin;
uniform vec2 segments;
uniform sampler2D dataTexture;

void main () {

	float i = floor(indexMap.x * count) + floor(indexMap.y * count*count);
	float y = anchor.y * .5 + .5;
	i = mod(i*segments.y + y*(segments.y-1.), dimension*dimension);
	vec2 index = vec2(mod(i, dimension)/dimension, floor(i/dimension)/dimension);

	vec3 pos = texture2D(dataTexture, index).xyz;
	vec3 point = pos;

	float unit = 1. / dimension;
	vec2 indexNext = vec2(mod(index.x + unit, 1.), index.y + unit * step(1., index.x + unit));
	vec2 indexPrev = vec2(mod(index.x - unit + 1., 1.), index.y - unit * step(index.x, 0.));
	vec3 next = texture2D(dataTexture, indexNext).xyz;
	vec3 prev = texture2D(dataTexture, indexPrev).xyz;

	vec3 forward = normalize(next - pos);
	vec3 up = normalize(cross(normalize(next), normalize(pos)));
	vec3 right = normalize(cross(forward, up));

	// vec3 dirNext = normalize(cross(normalize(next-pos), right));
	// vec3 dirPrev = normalize(cross(normalize(prev-pos), -right));
	// pos = mix(pos, next, y);
	// pos += mix(dirPrev, dirNext, y) * thin;

	mat4 rotation = rotationMatrix(forward, -anchor.x * PI);
	
	// pos -= point;
	right = (rotation * vec4(right,1)).xyz;
	// pos += point;
	vColor = vec3(0,1,0);
	// vColor = fract(abs(pos));

	pos += right * thin;
	// pos.y += sin(anchor.y * 30.) * .1;
	// pos -= right * anchor.x * .1;
	// vNormal = (rotation * vec4(pos,1)).xyz;
	vNormal = pos-point;
	vView = cameraPosition-pos;
	
	// lookAt(pos, cameraPosition, anchor * .1);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}