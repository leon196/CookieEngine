
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
	vec3 p = pos;
	float twist = .5;
	p.xz *= rot(p.y * twist + time);
	float should = step(number, 10.);
	p.y += number * 6.;
	vec3 curved = getCurve(p, p.y+time-10., p.x, p.z, .5, .01);

	p = pos;
	p.z += number * 6.;
	p.xy *= rot(p.z*.1 + time);
	vec3 curved2 = getCurve(p, -p.z+time, p.x, p.y, .5, .01);


	vec3 curved3 = getCurve(curved2, -curved2.y+time, curved2.z, curved2.x, .5, .01);
	p = mix(curved2, curved, should);
	// pos.xz *= 1. + .5 * sin(pos.y + time);
	gl_Position = projectionMatrix * viewMatrix * vec4(p,1);
}
