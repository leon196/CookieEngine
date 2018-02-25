
attribute vec2 indexMap, anchor;
attribute vec3 next, prev;
varying vec3 vNormal, vView;
uniform float time, lineThin;

void main () {

	vec3 pos = position;

	vec3 point = pos;

	vec3 forward = normalize(next - pos);
	vec3 up = normalize(cross(normalize(next), normalize(pos)));
	vec3 right = normalize(cross(forward, up));
	// right.xz *= rot(time);
	float angle = atan(pos.z,pos.x);

	vec3 dir = right;//normalize(-pos);
	vec3 dirNext = normalize(cross(normalize(next-pos), dir));
	vec3 dirPrev = normalize(cross(normalize(prev-pos), -dir));
	float y = anchor.y * .5 + .5;
	pos = mix(pos, next, y);
	pos += mix(dirPrev, dirNext, y) * lineThin;

	mat4 rotation = rotationMatrix(forward, -anchor.x * PI);

	pos -= point;
	pos = (rotation * vec4(pos,1)).xyz;
	pos += point;


	// pos += dir * cos(anchor.x*HALFPI) * .2;
	vNormal = (rotation * vec4(pos,1)).xyz;
	vView = pos - cameraPosition;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}