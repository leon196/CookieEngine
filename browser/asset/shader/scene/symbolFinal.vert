
attribute float number;
uniform float time;
uniform float finalSymbol;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;

void main()	{
	vUv = uv;
	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	vec3 p = pos;
	float w = 32.;
	vec2 uv = vec2(mod(number, w), floor(number/w)) / w;
	float seed = rand(uv);
	float rot1 = time*3.+seed*5.;//+length(p)*.2;
	float rot2 = time+seed*5.;//+length(p)*.2;
	uv = uv * 2. - 1.;
	p *= .1 * (.5 + .5 * (.5 + .5 * sin(seed*PI)));
	p.xz *= rot(rot1);
	p.xy *= rot(rot1);
	p.xz += uv;
	// float a = seed * PI2 * 20.;
	// p.xz += vec2(cos(a),sin(a));
	// p.y += (seed * 2. - 1.);
	// p = normalize(p);
	p *= 40. * finalSymbol;
	p.xy *= rot(rot2);
	p.xz *= rot(rot2);
	vView = normalize(cameraPosition - p);

	vNormal = normal;
	vNormal.xz *= rot(rot1);
	vNormal.xy *= rot(rot1);
	vNormal.xy *= rot(rot2);
	vNormal.xz *= rot(rot2);
	// p.xz *= rot(p.y * .5+time);
	// p.y -= 8.5 + .2*sin(time);
	// p = normalize(p) * max(1.,length(p));
	// p.y += .5;
	// p *= 5.;
	gl_Position = projectionMatrix * viewMatrix * vec4(p,1);
}
