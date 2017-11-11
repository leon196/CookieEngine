
attribute float number;
uniform float time;
varying vec2 vUv;

vec3 pointAt (float ratio, float range) {
	float a = ratio * PI2;
	return vec3(cos(a),sin(a*2.)*.2,sin(a))*range;
}

vec3 getCurve (vec3 pos, float forward, float right, float up, float radius, float height, float range) {
	float ratio = mod(forward * height, 1.);
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
	float speed = 4.;

	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	vec3 p = pos;
	float range = 1.;
	float radius = .05;
	float height = .01;
	p.y -= 9.;
	p.xz *= rot(p.y*.5+time*speed);
	float dist = length(p) * .2;
	p.xy *= rot(dist+time*.5);
	p.xz *= rot(dist+time);
	p.yz *= rot(dist+time*.3);
	// p.z += sin(p.y*.5+time*speed);
	p *= 5.;
	// p = getCurve(p, p.y+time*speed, p.x, p.z, radius, height, range);

	gl_Position = projectionMatrix * viewMatrix * vec4(p,1);
}
