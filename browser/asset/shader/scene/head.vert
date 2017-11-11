
attribute float number;
uniform float time;
varying vec2 vUv;

void main()	{
	vUv = uv;

	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	vec3 p = pos;
	p.xz *= rot(p.y * .5+time);
	p.y -= 8.5 + .2*sin(time);
	p = normalize(p) * max(1.,length(p));
	// p.y += .5;
	p *= 5.;
	gl_Position = projectionMatrix * viewMatrix * vec4(p,1);
}
