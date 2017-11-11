
attribute float number;
uniform float time;
uniform float headRoundness;
uniform float headRotationDelay;
varying vec2 vUv;

void main()	{
	vUv = uv;

	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	vec3 p = pos;
	float a = max(p.y * .5 + time - headRotationDelay, 0.);
	p.xz *= rot(a);
	p.y -= 8.5 + .2*sin(time) * headRoundness;
	p = mix(p, normalize(p) * max(1.,length(p)), headRoundness);
	// p.y += .5;
	p *= 5.;
	gl_Position = projectionMatrix * viewMatrix * vec4(p,1);
}
