
attribute float number;
uniform float time;
varying vec2 vUv;

vec3 pointAt (float ratio) {
	float a = ratio * PI2;
	return vec3(cos(a),sin(a*5.)*.1,sin(a))*8.;
}

#define wave smoothstep(.0, 1., sin(time*3.14159*4.))

vec3 getCurve (vec3 pos, float forward, float right, float up, float radius, float height) {
	float ratio = mod(forward * height, 1.);
	float angle = atan(up, right);
	float r = length(vec2(right, up)) * radius;

	vec3 curve = pointAt(ratio);

	float unit = .01;
	vec3 next = pointAt(mod(ratio + unit, 1.0));
	vec3 prev = pointAt(mod(ratio - unit + 1.0, 1.0));

	vec3 direction = normalize(next - prev);
	vec3 upward = vec3(0,1,0);
	vec3 tangent = normalize(cross(direction, upward));

	return curve + (tangent * cos(angle) + upward * sin(angle)) * r;
}

void main()	{
	vUv = uv;

	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	float twist = .5;
	pos.xz *= rot(pos.y * twist + time);
	float should = step(3., number);

	pos.y += number * 12. * should;

	vec3 curved = getCurve(pos, pos.y+time, pos.x, pos.z, .5, .01);
	pos = mix(pos, curved, should);
	// pos.xz *= 1. + .5 * sin(pos.y + time);
	gl_Position = projectionMatrix * viewMatrix * vec4(pos,1);
}
