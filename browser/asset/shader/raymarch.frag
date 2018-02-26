
uniform float time;
uniform vec2 resolution;

#define STEPS 30.
#define VOLUME .01
#define FAR 20.

const vec3 pink = vec3(0.917,0.482,0.663);
const vec3 red = vec3(0.825,0.142,0.111);
const vec3 beige = vec3(0.905, 0.670, 0.235);
const vec3 blue = vec3(0.058, 0.074, 0.560);
const vec3 blueSky = vec3(0.741, 0.941, 1);
const vec3 green1 = vec3(0.298,0.830,0.153);
const vec3 green2 = vec3(0.038,0.260,0.047);
const vec3 gold = vec3(1, 0.858, 0.058);

// raymarch toolbox
#define sdist(p,r) (length(p)-r)
#define repeat(v,s) (mod(v,s)-s/2.)

// raymarch toolbox
float rng (vec2 seed) { return fract(sin(dot(seed*.1684,vec2(54.649,321.547)))*450315.); }
float sdSphere (vec3 p, float r) { return length(p)-r; }
float sdCylinder (vec2 p, float r) { return length(p)-r; }
float sdIso(vec3 p, float r) { return max(0.,dot(p,normalize(sign(p))))-r; }
float sdBox( vec3 p, vec3 b ) { vec3 d = abs(p) - b; return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0)); }
float sdTorus( vec3 p, vec2 t ) { vec2 q = vec2(length(p.xz)-t.x,p.y); return length(q)-t.y; }
float amod (inout vec2 p, float count) { float an = TAU/count; float a = atan(p.y,p.x)+an/2.; float c = floor(a/an); c = mix(c,abs(c),step(count*.5,abs(c))); a = mod(a,an)-an/2.; p.xy = vec2(cos(a),sin(a))*length(p); return c; }
float smoo (float a, float b, float r) { return clamp(.5+.5*(b-a)/r, 0., 1.); }
float smin (float a, float b, float r) { float h = smoo(a,b,r); return mix(b,a,h)-r*h*(1.-h); }
float smax (float a, float b, float r) { float h = smoo(a,b,r); return mix(a,b,h)+r*h*(1.-h); }
vec2 toroidal (vec2 p, float r) { return vec2(length(p.xy)-r, atan(p.y,p.x)); }
struct Shape { float dist, material; };
Shape newShape () { Shape shape; shape.dist = 1000.; shape.material = 0.; return shape; }
Shape add (Shape a, Shape b) { Shape c = newShape(); c.dist = min(a.dist, b.dist); float op = step(b.dist, a.dist); c.material = mix(a.material, b.material, op); return c; }
Shape map (vec3 p);
vec3 getNormal (vec3 p) { vec2 e = vec2(.01,0); return normalize(vec3(map(p+e.xyy).dist-map(p-e.xyy).dist,map(p+e.yxy).dist-map(p-e.yxy).dist,map(p+e.yyx).dist-map(p-e.yyx).dist)); }
float getShadow (vec3 pos, vec3 at, float k) {
	vec3 dir = normalize(at - pos);
	float maxt = length(at - pos);
	float f = 1.;
	float t = .1;
	for (float i = 0.; i <= 1.; i += 1./30.) {
		float dist = map(pos + dir * t).dist;
		if (dist < .01) return 0.;
		f = min(f, k * dist / t);
		t += dist;
		if (t >= maxt) break;
	}
	return f;
}

Shape sdN64 (vec3 pos) {

	pos.xz *= rot(pos.y * smoothstep(.5,1.,sin(time)));

	vec3 p = pos;
	Shape n64 = newShape();

	float thin = .25;
	float height = 1.;
	float scale = 1.5;

	p = pos;
	p.xz = abs(p.xz)-height+thin;
	n64.dist = sdBox(p, vec3(thin, height, thin));
	p = pos;
	p.x = abs(p.x)-height+thin;
	p.z += p.y / scale * mix(1.,-1.,step(pos.x, 0.));
	n64.dist = min(n64.dist, sdBox(p, vec3(thin, height*2., thin*scale)));
	p = pos;
	p.z = abs(p.z)-height+thin;
	p.x += p.y / scale * mix(1.,-1.,step(0., pos.z));
	n64.dist = min(n64.dist, sdBox(p, vec3(thin*scale, height*2., thin)));
	n64.dist = max(n64.dist, sdBox(pos, vec3(height)));
	// p = vec3(abs(pos.z)-height+thin, pos.y, pos.x + pos.y);
	// n64.dist = min(n64.dist, sdBox(p, vec3(thin, height, thin)));

	return n64;
}

Shape map (vec3 pos) {
	Shape scene = newShape();
	vec3 p = pos;
	scene = add(scene, sdN64(p));
	return scene;
}

vec3 camera (vec3 p) {
	p.y += sin(time) * .5;
	p.xz *= rot(time*.4);
	return p;
}

void main() {
	vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	vec3 eye = camera(vec3(0,2,-4.5));
	vec3 ray = lookAtRay(eye, vec3(0), uv);
	float shade = 0., dist = 0.;
	vec3 pos = eye;
	Shape shape;
	for (float i = 0.; i <= 1.; i += 1./STEPS) {
		shape = map(pos);
		if (shape.dist < VOLUME) { shade = 1.-i; break; }
		shape.dist *= .9 + .1 * rng(uv+fract(time));
		dist += shape.dist;
		pos = eye + ray * dist;
	}
	vec3 normal = getNormal(pos);
	vec3 color = normal * .5 + .5;
	vec3 view = normalize(eye-pos);
	vec3 lightDir = normalize(vec3(2,2,-1)-pos);
	// float light = dot(lightDir, normal)*.5+.5;
	float light = dot(view, normal)*.5+.5;
	color *= light;// * shade;
	gl_FragColor = vec4(color,1.0);
}
