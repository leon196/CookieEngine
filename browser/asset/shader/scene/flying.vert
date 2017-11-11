
attribute float number;
uniform float time;
uniform float joOffset;
uniform float flying;
varying vec2 vUv;
varying vec3 vPos;

vec3 pointAt (float ratio, float range) {
	float a = ratio * PI2;
	return vec3(cos(a),sin(a*2.)*.2,sin(a))*range;
}

#define wave smoothstep(.0, 1., sin(time*3.14159*4.))

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

	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	pos *= flying;
	vec3 p = pos;
	float twist = .5;
	float speed = 2.;
	float waveRange = 2. + sin(time);
	p.xz *= rot(p.y * twist + time*speed);
	float should2 = step(number, 20.);
	float should3 = step(number, 40.);
	float should4 = step(number, 60.);

	float offset = joOffset;

	p.y += number * 6. * offset;
	float radius, height, range;
	radius = .5;
	height = .008;
	range = 10.+waveRange;
	vec3 curved = getCurve(p, p.y+time*speed, p.x, p.z, radius, height, range);

	p = pos;
	p.z += number * 6. * offset;
	p.xy *= rot(p.z*.1 - time*speed);
	vec3 curved2 = getCurve(p, p.z+time*speed, p.x, -p.y, radius, height, range);
	p = mix(curved2, curved, should2);

	// p = pos;
	vec3 pp = pos;
	pp.x += (number-30.) * 4. * offset;
	radius = .5+sin(p.x)*.1;
	height = .012;
	range = 5.+waveRange;
	vec3 curved3 = getCurve(pp, -pp.x-time*speed, -pp.z, pp.y, radius, height, range);
	p = mix(curved3, p, should3);
	// p = pos;

	pp = pos;
	pp.x += ((number-60.) - 10.) * 4. * offset;
	radius = .5;
	height = .01;
	range = 12.+waveRange;
	vec3 curved4 = getCurve(pp, pp.y+time*speed*10.+p.z+number*10. * offset, -pp.z, pp.x, radius, height, range);
	p = mix(curved4, p, should4);
	// pos.xz *= 1. + .5 * sin(pos.y + time);
	vPos = p;
	gl_Position = projectionMatrix * viewMatrix * vec4(p,1);
}
