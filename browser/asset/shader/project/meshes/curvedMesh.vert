
attribute float number;
uniform float time;
uniform float CurvedMeshTwist;
uniform float CurvedMeshSpeed;
uniform float CurvedMeshRadius;
uniform float CurvedMeshHeight;
uniform float CurvedMeshRange;
uniform float CurvedMeshOffset;
varying vec2 vUv;

vec3 pointAt (float ratio, float range) {
	float a = ratio * PI2;
	return vec3(cos(a),sin(a*2.+time)*.2,sin(a))*range;
}

vec3 getCurve (vec3 pos, float forward, float right, float up, float radius, float height, float range) {
	float ratio = mod(forward * height/100., 1.);
	float angle = atan(up, right);
	float r = length(vec2(right, up)) * radius;

	vec3 curve = pointAt(ratio, range);

	float unit = .01;
	vec3 next = pointAt(mod(ratio + unit, 1.0), range);
	vec3 prev = pointAt(mod(ratio - unit + 1.0, 1.0), range);

	vec3 direction = normalize(next - prev);
	vec3 upward = vec3(0,1,0);
	vec3 tangent = normalize(cross(direction, upward));

	return curve + (tangent * cos(angle) + upward * sin(angle)) * r;
}

void main()	{
	vUv = uv;

	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	pos.xz *= rot(pos.y * CurvedMeshTwist + time*CurvedMeshSpeed);
  pos.y += number*CurvedMeshOffset;
	pos = getCurve(pos, pos.y+time*CurvedMeshSpeed, pos.x, pos.z, CurvedMeshRadius, CurvedMeshHeight, CurvedMeshRange);

	gl_Position = projectionMatrix * viewMatrix * vec4(pos,1);
}
