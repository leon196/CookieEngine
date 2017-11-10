
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
#define VOLUME_BIAS .1
#define STEP_MIN .001

float shape (vec3 pos, float radius, float margin) {
	float shape = 1000.;
	float twist = .1;
	pos.xy *= rot(pos.z*twist + time * 3.);
  vec3 p = pos;
  radius *= 1. + .5 * sin(p.z * .05 - time * 2.);
  shape = sdBox(p, vec3(radius,radius,1000));
  p.xy *= rot(PI/4.);
  shape = max(shape, -sdBox(p, vec3(radius*margin, radius*margin, 1000)));

  // p = pos;
  amod(p.yx, 4.);
  // p.y -= radius*margin;
  p.z = repeat(p.z+time*10., TAU * 2.);
  // shape = smin(shape, sdCylinder(p.xz, .4), 1.);
  shape = smin(shape, max(sdCylinder(p.xz, .1*radius), abs(length(p.xy))-radius*margin), .25*radius);

  shape = smin(shape, sdIso(p, .5 * radius * (.5+.5*waveB)), .1*radius);
  shape = smin(shape, sdCylinder(p.xy, .2 * radius * (.5+.5*waveB)), .25*radius);

	p = pos;
	p.z = repeat(p.z, TAU);
	float a = p.z * .1;
	// p.xy += vec2(cos(a), sin(a)) * 5.;
	vec3 pp = p;
	amod(p.xy, 4.);
	p.x -= 1. * radius;
	shape = smin(shape, sdSphere(p, .25 * radius), .1 * radius);
	shape = smin(shape, max(sdCylinder(p.yz, .05 * radius), abs(length(pp.xy))-radius), .1 * radius);

  return shape;
}

float map (vec3 pos) {
	float scene = 1000.;
	float fade = smoothstep(0., 200., -pos.z - 300. * (blendRay*2.-1.));
  vec3 p = pos;
	// float salt = pattern(p);
	// pos.z += salt;
	// pos.xz *= rot(salt*.1);
	float shell = sdSphere(pos-cameraPosition, 10.);
	float a = pos.z* .05  + time;
	pos.xy += vec2(cos(a),sin(a)) * 10.;
	float margin = 1.3 - .1 * waveB;
  scene = shape(p, 5., margin);
  p = pos;
	// amod(p.xy, 3.);
	// p.x -= 4.;
  scene = shape(p, 5., margin);
  // p /= 10.;
  p.yz *= rot(PI/2.+sin(time)*.3);
  p.xz *= rot(sin(time)*.2);
  p.xz = displaceLoop(p.xz, 20.);
  p.z *= 20.;
  p.y = repeat(p.y+time*10., 60.);
  scene = min(scene, shape(p, 2., margin));

	p = pos;
  p.yz *= rot(PI/2.);
  p.xz = displaceLoop(p.xz, 100.);
  p.z *= 20.;
	// p.x *= 6.;
	p.y += p.z * PI;
  p.y = repeat(p.y+time*10., 100.);
  scene = min(scene, shape(p, 10., margin));

	scene += fade * 10.;
	// scene = max(scene, -pos.z - 100. * (blendRay*2.-1.));

	scene = max(scene, -shell);

	return scene;
}

vec3 getNormal (vec3 p) {
	vec2 e = vec2(.01,0.);
	return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx)));
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
		if (dist > 400.) {
			shade = 0.;
			break;
		}
		pos = eye + ray * dist;
	}
	vec4 color = vec4(1.);
	// vec3 normal = getNormal(pos);
	// vec3 view = normalize(eye-pos);
	// shade *= 1.-smoothstep(100.,200., color.a);
	// color.rgb *= dot(normal, view) * .5 + .5;
	color.rgb *= shade;
	// color += .5*sin((uv.x+uv.y)*100.);
	color.a = dist;
	// color.rgb = pow(color.rgb, vec3(1./2.));
	gl_FragColor = color;
}
