
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

float shape (vec3 pos, float radius, float margin) {
	float shape = 1000.;
  vec3 p = pos;
  p.xy *= rot(p.z*.1 + time);
  radius += 2. * sin(p.z * .1 - time);
  shape = sdBox(p, vec3(radius,radius,1000));
  p.xy *= rot(PI/4.);
  shape = max(shape, -sdBox(p, vec3(radius*margin, radius*margin, 1000)));

  // p = pos;
  p.z = repeat(p.z, 2.);
  shape = smin(shape, max(sdCylinder(p.xz, .4), abs(length(p.xy))-radius*margin), 2.);
  return shape;
}

float map (vec3 pos) {
	float scene = 1000.;
  scene = shape(pos, 10., 1.1);
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
	for (float i = 0.; i <= 1.; i += 1./STEPS) {
		float dist = map(pos);
		if (dist < VOLUME_BIAS) {
			shade = 1.-i;
			break;
		}
		dist *= .9+.1*rand(seed*vec2(i));
		dist = max(dist, STEP_MIN);
		pos += ray * dist;
	}
	vec4 color = vec4(1.);
	color.rgb *= shade;
  color.a = length(eye-pos);
	gl_FragColor = color;
}
