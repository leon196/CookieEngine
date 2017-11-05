
uniform sampler2D frame;
uniform sampler2D uTextureTitle;
uniform sampler2D uTextureDate;
uniform float fadeTransition;
uniform float blendLight;
uniform float blendLabelFire;
uniform float blendLabelAlpha;
uniform float blendHeat;
uniform vec2 resolution;
uniform vec3 cameraForward;
uniform float time;
varying vec2 vUv;

#define STEPS 50.
#define VOLUME_BIAS .01
#define STEP_MIN .1

float sdSphere (vec3 p, float r) { return length(p)-r; }
float sdCylinder (vec3 p, float r) { return length(p.xz)-r; }
float smin (float a, float b, float r) {
    float h = clamp(.5+.5*(b-a)/r,0.,1.);
    return mix(b,a,h)-r*h*(1.-h);
}

float map (vec3 p) {
	float scene = 1000.;
	float a = p.y + time;
	float r = 1.;
	// p.x += cos(a)*r;
	// p.z += sin(a)*r;
	vec3 pp;
	const float repeat = 4.;
	float count = 3.;
	float smoothBlend = .5;
	float c = 15.;
	for (float i = 1.; i <= repeat; ++i) {
		p.xz *= rot(clamp(p.y*.05*i, -1.,1.));
		float index = pModPolar(p.xz, count);
		a = (p.y*.01+sin(p.y*1.5+time*5.)*.01)*(1./i);
		p.xy *= rot(a);
		p.x -= 4./i;
		pp = p;
		vec2 seed = vec2(index/count, i/repeat);
		float rnd = rand(seed);
		float speed = (1.+rnd*10.) * mix(-1.,1.,step(.5,rnd));
		pp.y = mod(pp.y + time * speed + rnd*c + seed.x*c, c)-c*.5;
		float size = 1./i;
		scene = smin(scene, sdSphere(pp, .5), smoothBlend);
		scene = smin(scene, sdCylinder(p, size), smoothBlend);	
	}
	return scene;
}

void main ()	{
	vec2 uv = vUv*2.-1.;
	uv.x *= resolution.x/resolution.y;
	// uv.x += sin(uv.y*1000.+time*10.)*.001;
	// vec4 color = texture2D(frame, uv);
	vec3 eye = vec3(uv, 0.) + cameraPosition;
	vec3 forward = -normalize(cameraPosition);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(forward, right));
	// vec3 ray = normalize(vec3(uv, 1));
	vec3 ray = normalize(right * uv.x + up * uv.y + forward);
	vec3 pos = eye;
	vec2 seed = vUv + fract(time);
	float shade = 0.;
	for (float i = 0.; i < STEPS; ++i) {
		float dist = map(pos);
		if (dist < VOLUME_BIAS) {
			shade = 1. - i / STEPS;
			break;
			// shade += i / STEPS;
		}
		dist = abs(dist)*(.8+0.2*rand(seed*vec2(i)));
		dist = max(dist, STEP_MIN);
		pos += ray * dist;
	}
	vec4 color = vec4(1.);
	color.rgb *= shade;
	gl_FragColor = color;
}
