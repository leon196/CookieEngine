
attribute float number;
uniform float time;
uniform float introSymbol;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;

void main()	{
	vUv = uv;
	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	vec3 p = pos;
	float w = 8.;
	vec2 uv = vec2(number);
	float seed = rand(uv);
	float rot1 = time*3.+seed*2.;//+length(p)*.2;
	float rot2 = time+seed*10.;//+length(p)*.2;
	p *= 1.;
	// p *= .1 * (.5 + .5 * (.5 + .5 * sin(seed*PI)));
	p.xy *= rot(rot1);
	uv = uv / w * 2. - 1.;
	p.xz *= rot(rot1);
	p.xz += uv;
	// float a = seed * PI2 * 20.;
	// p.xz += vec2(cos(a),sin(a));
	// p.y += (seed * 2. - 1.);
	// p = normalize(p);
	p *= 8. * introSymbol;
	p.xy *= rot(rot2);
	p.xz *= rot(rot2);
	p.y += 10. * introSymbol;
	vView = normalize(cameraPosition - p);

	vNormal = normal;
	vNormal.xy *= rot(rot1);
	vNormal.xz *= rot(rot1);
	vNormal.xy *= rot(rot2);
	vNormal.xz *= rot(rot2);
	// p.xz *= rot(p.y * .5+time);
	// p.y -= 8.5 + .2*sin(time);
	// p = normalize(p) * max(1.,length(p));
	// p.y += .5;
	// p *= 5.;
	gl_Position = projectionMatrix * viewMatrix * vec4(p,1);
}
