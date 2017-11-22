
uniform sampler2D sceneTexture;
uniform sampler2D feedbackTexture;
uniform vec2 resolution;
uniform vec3 cameraForward;
uniform vec3 cameraTarget;
uniform float time;
uniform float FilterFeedback;
varying vec2 vUv;

#define STEPS 100.
#define VOLUME 0.001

// tweak it
#define donut 30.
#define cell 4.
#define height 2.
#define thin .04
#define radius 15.
#define speed 1.

float amodIndex (vec2 p, float count) { float an = TAU/count; float a = atan(p.y,p.x)+an/2.; float c = floor(a/an); c = mix(c,abs(c),step(count*.5,abs(c))); return c; }

float map (vec3);
float getShadow (vec3 pos, vec3 at, float k) {
    vec3 dir = normalize(at - pos);
    float maxt = length(at - pos);
    float f = 01.;
    float t = VOLUME*50.;
    for (float i = 0.; i <= 1.; i += 1./15.) {
        float dist = map(pos + dir * t);
        if (dist < VOLUME) return 0.;
        f = min(f, k * dist / t);
        t += dist;
        if (t >= maxt) break;
    }
    return f;
}
vec3 getNormal (vec3 p) { vec2 e = vec2(.01,0); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx))); }

void camera (inout vec3 p) {
    p.xz *= rot(PI/8.);
    p.yz *= rot(PI/6.);
}

float windowCross (vec3 pos, vec4 size, float salt) {
    vec3 p = pos;
    float sx = size.x * (.6+salt*.4);
    float sy = size.y * (.3+salt*.7);
    vec2 sxy = vec2(sx,sy);
    p.xy = repeat(p.xy+sxy/2., sxy);
    float scene = sdBox(p, size.zyw*2.);
    scene = min(scene, sdBox(p, size.xzw*2.));
    scene = max(scene, sdBox(pos, size.xyw));
    return scene;
}

float window (vec3 pos, vec2 dimension, float salt) {
    float thinn = .008;
    float depth = .04;
    float depthCadre = .06;
    float padding = .08;
    float scene = windowCross(pos, vec4(dimension,thinn,depth), salt);
    float cadre = sdBox(pos, vec3(dimension, depthCadre));
    cadre = max(cadre, -sdBox(pos, vec3(dimension.x-padding, dimension.y-padding, depthCadre*2.)));
    scene = min(scene, cadre);
    return scene;
}

float boxes (vec3 pos, float salt) {
    vec3 p = pos;
    float ry = cell * .43*(.3+salt);
    float rz = cell * .2*(.5+salt);
    float salty = rng(vec2(floor(pos.y/ry), floor(pos.z/rz)));
    pos.y = repeat(pos.y, ry);
    pos.z = repeat(pos.z, rz);
    float scene = sdBox(pos, vec3(.1+.8*salt+salty,.1+.2*salt,.1+.2*salty));
    scene = max(scene, sdBox(p, vec3(cell*.2)));
    return scene;
}

float map (vec3 pos) {

    float scene = 1000.;
    vec3 p = pos;
    float segments = PI*radius;
    float indexX, indexY, salt;
    vec2 seed;

    // donut distortion
    vec3 pDonut = p;
    pDonut.x += donut;
    pDonut.y += radius;
    pDonut.xz = displaceLoop(pDonut.xz, donut);
    pDonut.z *= donut;
    pDonut.xzy = pDonut.xyz;
    pDonut.xz *= rot(time*.05*speed);

    // ground
    p = pDonut;
    scene = min(scene, sdCylinder(p.xz, radius-height));

    // walls
    p = pDonut;
    float py = p.y + time * speed;
    indexY = floor(py / (cell+thin));
    p.y = repeat(py, cell+thin);
    scene = min(scene, max(abs(p.y)-thin, sdCylinder(p.xz, radius)));
    amod(p.xz, segments);
    p.x -= radius;
    scene = min(scene, max(abs(p.z)-thin, p.x));

    // horizontal windot
    p = pDonut;
    p.xz *= rot(PI/segments);
    py = p.y + time * speed;
    indexY = floor(py / (cell+thin));
    p.y = repeat(py, cell+thin);
    indexX = amodIndex(p.xz, segments);
    amod(p.xz, segments);
    seed = vec2(indexX, indexY);
    salt = rng(seed);
    p.x -= radius;
    vec2 dimension = vec2(.75,.5);
    p.x +=  dimension.x * 1.5;
    scene = max(scene, -sdBox(p, vec3(dimension.x, .1, dimension.y)));
    scene = min(scene, window(p.xzy, dimension, salt));

    // vertical window
    p = pDonut;
    py = p.y + cell/2. + time * speed;
    indexY = floor(py / (cell+thin));
    p.y = repeat(py, cell+thin);
    indexX = amodIndex(p.xz, segments);
    amod(p.xz, segments);
    seed = vec2(indexX, indexY);
    salt = rng(seed);
    p.x -= radius;
    dimension.y = 1.5;
    p.x +=  dimension.x * 1.25;
    scene = max(scene, -sdBox(p, vec3(dimension, .1)));
    scene = min(scene, window(p, dimension, salt));

    // elements
    p = pDonut;
    p.xz *= rot(PI/segments);
    py = p.y + cell/2. + time * speed;
    indexY = floor(py / (cell+thin));
    p.y = repeat(py, cell+thin);
    indexX = amodIndex(p.xz, segments);
    amod(p.xz, segments);
    seed = vec2(indexX, indexY);
    salt = rng(seed);
    p.x -= radius - height;
    scene = min(scene, boxes(p, salt));

    return scene;
}

void main ()	{
	vec2 uv = vUv * 2. - 1.;
	uv.x *= resolution.x/resolution.y;
  vec3 eye = cameraPosition+cameraTarget/20.;
	vec3 forward = normalize(cameraForward);
	vec3 right = -normalize(cross(vec3(0,1,0), forward));
	vec3 up = -normalize(cross(forward, right));
  vec3 ray = normalize(forward + uv.x * right + uv.y * up);
  float dither = rng(uv+fract(time));
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
  vec3 light = vec3(40.,100.,-10.);
  float shadow = getShadow(pos, light, 4.);
  vec4 color = vec4(1);
  color *= shade;
  color *= shadow;
  color = smoothstep(.0, .5, color);
  color.rgb = pow(color.rgb, vec3(1./2.));
	color.a = length(eye-pos);
	gl_FragColor = color;
}
