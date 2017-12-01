
uniform vec2 resolution;
uniform vec3 cameraPos;
uniform vec3 cameraTarget;
uniform float time;
uniform float RoomMovement;
varying vec2 vUv;

#define STEPS 100.
#define VOLUME 0.001

float map (vec3);
float softShadow (vec3 pos, vec3 dir, float k) {
    float maxt = 100.;
    float f = 1.;
    float t = .01;
    for (float i = 0.; i <= 1.; i += 1./40.) {
        float dist = map(pos + dir * t);
        if (dist < .001) return 0.;
        f = min(f, k * dist / t);
        t += dist;
        if (t >= maxt) break;
    }
    return f;
}
float hardShadow (vec3 pos, vec3 dir) {
    float maxt = 100.;
    float t = .01;
    for (float i = 0.; i <= 1.; i += 1./40.) {
        float dist = map(pos + dir * t);
        if (dist < .001) return 0.;
        t += dist;
        if (t >= maxt) break;
    }
    return 1.;
}
vec3 getNormal (vec3 p) { vec2 e = vec2(.001,0); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx))); }

float fbm2 (vec3 p) {
    float value = 0.0;
    float amplitud = .5;
    for (float i = 1.; i <= 2.; i++) {
        value += amplitud * noiseIQ(p);
        p *= 2.;
        amplitud *= .5;
    }
    return value;
}

float pattern2 (vec3 p) {
  vec3 q = vec3(fbm2(p), fbm2(p+vec3(10.5,51.5,7.5423)), fbm2(p+vec3(1501.24,1254.324,658.6)));
	q.xz *= rot(time*.2);
  return fbm(p + 8. * q);
}

float map (vec3 pos) {

    float scene = 1000.;
    vec3 p, pp;

    p = pos;
    // float n = pattern2(p*2.);
    // p.xz *= rot(n);
    float count = 12.;
    float index = amod(p.xz, count);
    float offset = PI*index/count;
    float size = .1;
    float bevel = .01;
    float thin = .01;
    float r = .5;
    p.x -= 1.;
    float d = length(p)*.5+time*.5;
    p = abs(p);
    p.xz *= rot(d+PI/2.);//+time*.94695
    p.xy *= rot(d+PI/4.);//+time*.654374
    p.zy *= rot(d+PI/4.);//+time*.35474
    p = repeat(p, r);
    scene = sdBox(p, vec3(size));
    scene = max(scene, sdIso(p, size-bevel));
    // scene = min(scene, sdist(p, size));
    // scene = min(scene, sdist(p.xz, thin));
    // scene = min(scene, sdist(p.xy, thin));
    // scene = min(scene, sdist(p.zy, thin));

    return scene;
}

vec3 getCamera (vec3 eye, vec3 lookAt, vec2 uv) {
  float fov = .65;
  vec3 forward = normalize(lookAt - eye);
  vec3 right = normalize(cross(forward, vec3(0,1,0)));
  vec3 up = normalize(cross(right, forward));
  return normalize(fov * forward + uv.x * right + uv.y * up);
}

float getLight (vec3 pos, vec3 eye) {
  vec3 light = normalize(vec3(1,2.,-1));
  vec3 normal = getNormal(pos);
  vec3 view = normalize(eye-pos);
  float shade = clamp(dot(normal, view),0.,1.);
  // shade *= hardShadow(pos, light);
  return shade;
}

vec4 raymarch () {
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
  float dither = rng(uv+fract(time));
  vec3 eye = cameraPos;
  vec3 ray = getCamera(eye, cameraTarget, uv);
  vec3 pos = eye;
  float shade = 0.;
  for (float i = 0.; i <= 1.; i += 1./STEPS) {
    float dist = map(pos);
		if (dist < VOLUME) {
			shade = 1.-i;
			break;
		}
    dist *= .5 + .1 * dither;
    pos += ray * dist;
  }

  vec4 color = vec4(shade);
  vec3 normal = getNormal(pos);
  // color.rgb = normal*.5+.5;
  color *= getLight(pos, eye);
  // color = smoothstep(.0, .5, color);
  color = sqrt(color);
  return color;
}

void main () {
  gl_FragColor = raymarch();
}
