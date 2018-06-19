
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec3 cameraPos, cameraTarget;

vec3 lightPos = vec3(2.,2,-4.);

#define repeat(p,r) (mod(p,r)-r/2.)
#define sdist(p,r) (length(p)-r)
float smin (float a, float b, float r) { float h = clamp(.5+.5*(b-a)/r, 0., 1.); return mix(b, a, h)-r*h*(1.-h); }
void amod (inout vec2 p, float c) {
	float an = (3.1459*2.)/c;
	float a = atan(p.y,p.x)+an/2.;
	a = mod(a, an) - an/2.;
	p = vec2(cos(a), sin(a)) * length(p);
}
float sdbox (vec3 p, vec3 r) {
	vec3 d = abs(p)-r; return max(d.x,max(d.y,d.z));
}
struct Shape { float dist, mat; vec3 pos; };
void shmin (Shape a, Shape b, inout Shape c) {
	float ab = step(a.dist, b.dist);
	c.dist = min(a.dist, b.dist);
	c.mat = mix(b.mat, a.mat, ab);
	c.pos = mix(b.pos, a.pos, ab);
}
void shmax (Shape a, Shape b, inout Shape c) {
	float ab = step(b.dist, a.dist);
	c.dist = max(a.dist, b.dist);
	c.mat = mix(a.mat, b.mat, ab);
	c.pos = mix(a.pos, b.pos, ab);
}

float mapLight (vec3 pos) {
	vec3 p = pos - lightPos;
	return sdist(p, .01);
}

Shape map (vec3 pos) {
	Shape scene;
	scene.dist = 100.;
	scene.mat = 0.;
	scene.pos = pos;
	vec3 p;

	// structure
	p = pos;
	Shape structure;
	structure.dist = 100.;
	structure.mat = 0.;
	const float count = 3.;
	for (float i = count; i > 0.; --i) {
		float r = i / count;
		r *= r;
		float cellY = 20.*r;
		float size = 1.*r;
		float range = 4.*r;
		float width = 1.1;
		float scale = .4;
		float smoo = 2.*r;
		float h = .5*r;
		float l = 2.;
		float w = .1;
		float idY = floor(p.z/cellY);
		p.z = repeat(p.z, cellY);
		p = abs(p) - range;
		p.xy *= rot(r+time+pos.z*.1);
		// p.yz *= rot(r*idY);
		structure.pos = p;
		structure.dist = smin(structure.dist, sdbox(p, vec3(size)), smoo);
		structure.dist = smin(structure.dist, sdbox(p, vec3(size*scale,l,size*scale)), smoo);
		// structure.dist = smin(structure.dist, sdbox(p, vec3(l,w,size*scale)), smoo);
		structure.dist = smin(structure.dist, sdbox(p, vec3(size*width, h, size*width)), smoo);
		shmin(scene, structure, scene);
	}
	// scene.dist = structure.dist;
	// scene.dist = max(scene.dist, sdist(pos, 5.));
	return scene;
}

vec3 getNormal (vec3 p) { vec2 e = vec2(.0001,0); return (vec3(map(p+e.xyy).dist-map(p-e.xyy).dist,map(p+e.yxy).dist-map(p-e.yxy).dist,map(p+e.yyx).dist-map(p-e.yyx).dist))/.0001; }

float getShadow (vec3 pos, vec3 at, float k) {
	vec3 dir = normalize(at - pos);
	float maxt = length(at - pos);
	float f = 1.;
	float t = .01;
	for (float i = 0.; i <= 1.; i += 1./30.) {
		float dist = map(pos + dir * t).dist;
		if (dist < .001) return 0.;
		f = min(f, k * dist / t);
		t += dist;
		if (t >= maxt) break;
	}
	return f;
}

vec3 look (vec3 eye, vec3 target, vec2 anchor)
{
	vec3 forward = normalize(target-eye);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	return normalize(forward + right * anchor.x + up * anchor.y);
}

void main () {
	vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	float dither = rand(uv);
	vec3 eye = cameraPos;
	vec3 ray = look(eye, cameraTarget, uv);
	vec3 pos = eye;
	float shade = 0.;
	const float steps = 50.;
	Shape shape;
	for (float i = steps; i >= 0.; --i) {
		shape = map(pos);
		if (shape.dist < .001) {
			shade = i/steps;
			break;
		}
		shape.dist *= .9 + .1 * dither;
		// pos = mix(pos, shape.pos, .1);
		pos += shape.dist * ray;
	}

	// vec3 pLight = eye;
	// float sLight = 0.;
	// for (float i = 0.; i <= 1.; i += 1./10.) {
	// 	float dist = mapLight(pLight);
	// 	if (dist < 10.) {
	// 		sLight += .1/max(.001,dist);
	// 	}
	// 	dist = max(dist, .001);
	// 	pLight += dist * ray;
	// }

	vec3 color = vec3(1.);

	float ambient = .3;
	float shadow = .7;
	

	float tile = 32.;
	float thin = .01;

	vec3 normal = getNormal(pos);
	vec3 p = shape.pos;
	float tiled =  1.-(.25+.25*clamp(thin/abs(sin(p.x*tile)*sin(p.y*tile)*sin(p.z*tile)), 0., 1.));

	// vec3 view = normalize(eye-pos);
	// vec3 lightDir = normalize(lightPos-pos);
	// float light = clamp(dot(lightDir, normal),0.,1.);
	// color = mix(color * ambient, color, light);
	// color = mix(color, vec3(1,0,0), clamp(pow(light,32.),0.,1.));

	// shadow = (1.-shadow)+shadow*getShadow(pos, lightPos, 32.)*light;
	// color = mix(vec3(.5,.5,1), color, shadow);
	// color = mix(color, vec3(1,0,0), (1.-abs(dot(normal, view))));
	color *= shade;
	// color *= tiled;
	// color += sLight;

	// color = normal * .5 + .5;

	gl_FragColor = vec4(color, 1);
}
