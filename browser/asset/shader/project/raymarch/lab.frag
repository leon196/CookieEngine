
// http://lgdv.cs.fau.de/publications/publication/Pub.2015.tech.IMMD.IMMD9.spheri/

uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 cameraPos;
uniform vec3 cameraTarget;
uniform float time;
uniform float RoomMovement;
varying vec2 vUv;

#define STEPS 50.
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

vec3 spheroidal (vec2 p) {
  return vec3(cos(p.x)*cos(p.y),sin(p.x)*cos(p.y),sin(p.y));
}

float map (vec3 pos) {

    float scene = 1000.;
    vec3 p, pp;

    p = pos;
    // float n = pattern2(p*2.);
    // p.xz *= rot(n);
    // p.xz = toroidal(p.xz, 2.);
    // p.xy *= rot(p.z*4.+time);
    // p.z /= PI;
    // p.z *= 5.;
    float count = 6.;
    float index = amod(p.xy, count);
    float offset = PI*index/count;
    float size = .05;
    float bevel = .01;
    float thin = .01;
    vec3 boxSize = vec3(thin, 1./0., thin);
    float r = 2.;
    float d = time*.5;
    float t = time;
    // p.x -= .5;
    // p.z += -time*.5;
    p = repeat(p, r);
    p = abs(p);
    // thin = mix(thin, -1.,clamp(length(p)/150.,0.,1.));
    // p.xz *= rot(mouse.x*TAU);
    // p.xy *= rot(mouse.y*TAU);
    // p.zy *= rot(mouse.x*TAU);
    p.xz *= rot(PI/2.+t*.94695);
    p.xy *= rot(PI/2.+t*.654374);
    p.zy *= rot(PI/2.+t*.35474);
    // scene = sdBox(p, vec3(size));
    // scene = min(scene, sdIso(p, size));
    // scene = min(scene, sdist(p, size));
    scene = min(scene, sdist(p.xz, thin));
    scene = min(scene, sdist(p.xy, thin));
    scene = min(scene, sdist(p.zx, thin));
    pp = p;
    p.xz *= rot(PI/4.);
    scene = min(scene, sdist(p.yz, thin));
    scene = min(scene, sdist(p.zx, thin));
    p = pp;
    p.yz *= rot(PI/4.);
    scene = min(scene, sdist(p.xy, thin));
    scene = min(scene, sdist(p.yz, thin));
    p = pp;
    p.yx *= rot(PI/4.);
    scene = min(scene, sdist(p.xy, thin));
    scene = min(scene, sdist(p.yx, thin));

    scene = smin(scene, sdist(p, size), .05);

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
    dist *= .4 + .1 * dither;
    pos += ray * dist;
  }

  vec4 color = vec4(shade);
  color = step(.1,color);
  // vec3 normal = getNormal(pos);
  // color.rgb = normal*.5+.5;
  // color *= getLight(pos, eye);
  // color = smoothstep(.0, .5, color);
  // color = sqrt(color);
  return color;
}

void main () {
  gl_FragColor = raymarch();
}
