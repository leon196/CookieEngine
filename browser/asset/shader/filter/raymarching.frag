
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
uniform float blendRay;
varying vec2 vUv;

#define STEPS 30.
#define VOLUME_BIAS .01
#define STEP_MIN .001

float shape (vec3 pos, float radius, float margin) {
	float shape = 1000.;
  vec3 p = pos;
  p.xy *= rot(p.z*.1 + time * 2.);
  radius *= 1. + .5 * sin(p.z * .1 - time * 2.);
  shape = sdBox(p, vec3(radius,radius,1000));
  p.xy *= rot(PI/4.);
  shape = max(shape, -sdBox(p, vec3(radius*margin, radius*margin, 1000)));

  // p = pos;
  amod(p.yx, 4.);
  // p.y -= radius*margin;
  p.z = repeat(p.z+time*10., TAU);
  // shape = smin(shape, sdCylinder(p.xz, .4), 1.);
  shape = smin(shape, max(sdCylinder(p.xz, .4), abs(length(p.xy))-radius*margin), .25*radius);

  shape = smin(shape, sdSphere(p, .3 * radius), .25*radius);

  return shape;
}

float map (vec3 pos) {
	float scene = 1000.;
	float fade = smoothstep(0., 200., -pos.z - 200. * (blendRay*2.-1.));
  vec3 p = pos;
  scene = shape(p, 5., 1.2);
  p = pos;
	// amod(p.xy, 3.);
	// p.x -= 4.;
  scene = shape(p, 5., 1.2);
  // p /= 10.;
  p.yz *= rot(PI/2.);
  p.xz = displaceLoop(p.xz, 20.);
  p.z *= 20.;
  p.y = repeat(p.y+time*10., 50.);
  scene = min(scene, shape(p, 2., 1.1));

	// scene += fade * 10.;
	// scene = max(scene, -pos.z - 100. * (blendRay*2.-1.));

	return scene;
}

void main ()	{
	vec2 uv = vUv*2.-1.;
	uv.x *= resolution.x/resolution.y;
	vec3 eye = cameraPosition;
	vec3 forward = -normalize(cameraPosition);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	vec3 ray = normalize(right * uv.x + up * uv.y + forward);
	vec3 pos = eye;
	vec2 seed = vUv + fract(time);
	float shade = 0.;
	float dist = 0.;
	for (float i = 0.; i <= 1.; i += 1./STEPS) {
		float d = map(pos);
		if (d < VOLUME_BIAS) {
			shade = 1.-i;
			break;
		}
		d *= .9+.1*rand(seed*vec2(i));
		d = max(d, STEP_MIN);
		dist += d;
		if (dist > 100.) {
			shade = 0.;
			break;
		}
		pos = eye + ray * dist;
	}
	vec4 color = vec4(1.);
	// shade *= 1.-smoothstep(100.,200., color.a);
	color.rgb *= shade;
	color.a = dist;
	gl_FragColor = color;
}
