
uniform vec2 resolution;
uniform vec3 cameraPos;
uniform vec3 cameraTarget;
uniform float time;
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

// float windowCross (vec3 pos, vec4 size, float salt) {
//     vec3 p = pos;
//     float sx = size.x * (.6+salt*.4);
//     float sy = size.y * (.3+salt*.7);
//     vec2 sxy = vec2(sx,sy);
//     p.xy = repeat(p.xy+sxy/2., sxy);
//     float scene = sdBox(p, size.zyw*2.);
//     scene = min(scene, sdBox(p, size.xzw*2.));
//     scene = max(scene, sdBox(pos, size.xyw));
//     return scene;
// }
//
// float window (vec3 pos, vec2 dimension, float salt) {
//     float roomThinn = .008;
//     float depth = .04;
//     float depthCadre = .06;
//     float padding = .08;
//     float scene = windowCross(pos, vec4(dimension,roomThinn,depth), salt);
//     float cadre = sdBox(pos, vec3(dimension, depthCadre));
//     cadre = max(cadre, -sdBox(pos, vec3(dimension.x-padding, dimension.y-padding, depthCadre*2.)));
//     scene = min(scene, cadre);
//     return scene;
// }
//
// float boxes (vec3 pos, float salt) {
//     vec3 p = pos;
//     float ry = roomCount * .43*(.3+salt);
//     float rz = roomCount * .2*(.5+salt);
//     float salty = rng(vec2(floor(pos.y/ry), floor(pos.z/rz)));
//     pos.y = repeat(pos.y, ry);
//     pos.z = repeat(pos.z, rz);
//     float scene = sdBox(pos, vec3(.1+.8*salt+salty,.1+.2*salt,.1+.2*salty));
//     scene = max(scene, sdBox(p, vec3(roomCount*.2)));
//     return scene;
// }

float map (vec3 pos) {

    float scene = 1000.;
    vec3 p = pos;
    vec3 pp = pos;
    vec3 pRoom = pos;
    vec3 pWall = pos;

    float toroidalRadius = 30.;
    float innerRadius = 15.;
    float speed = 0.01;

    vec2 roomCount = vec2(58., 90.);
    float roomHeight = 1.;
    float roomThin = .01;

    vec2 seed;
    float repeaty = toroidalRadius*TAU/roomCount.y;

    // toroidal distortion
    vec3 pTorus = p;
    pTorus.y += innerRadius - roomHeight / 2.;
    pTorus.x += toroidalRadius;
    pTorus.xz = toroidal(pTorus.xz, toroidalRadius);
    // pTorus.z += time*speed;
    pTorus.z *= toroidalRadius;
    pTorus.xzy = pTorus.xyz;
    // pTorus.xz *= rot(time*.05*speed);

    // rooms
    p = pTorus;
    p.y = repeat(p.y, repeaty);
    vec2 wall = vec2(1000.);
    wall.x = max(abs(p.y)-roomThin, sdCylinder(p.xz, innerRadius));
    amod(p.xz, roomCount.x);
    p.x -= innerRadius;
    wall.y = max(abs(p.z)-roomThin, p.x);
    pWall = p;

    // // horizontal window
    p = pTorus;
    p.xz *= rot(PI/roomCount.x);
    float py = p.y+repeaty/2.;
    seed.y = floor(py/repeaty);
    p.y = repeat(py, repeaty);
    seed.x = amod(p.xz, roomCount.x);
    p.x -= innerRadius-roomHeight/2.;
    vec2 size = vec2(.25,roomHeight*.5);
    wall.x = max(wall.x, -max(abs(p.x+.2)-size.y, abs(p.z)-size.x));
    size = vec2(.65,roomHeight*.35);
    wall.y = max(wall.y, -max(abs(p.x)-size.y, abs(p.y)-size.x));
    // scene = min(scene, window(p.xzy, dimension, salt));

    pRoom = p;

    // float lod = 100.;
    // seed += floor(fract(time*.1)*lod)/lod;
    float salt = rng(seed);
    float pepper = rng(seed+vec2(.132,0.9023));
    float spice = rng(seed+vec2(.672,0.1973));

    // ground
    scene = min(scene, p.x+roomHeight*.5);

    float lamp = 1000.;
    float lampHeight = .3+.6*salt;
    float lampThin = .007;
    float lampFootThin = .005;
    float lampHeadRadius = .04+.08*pepper;
    float lampHeadHeight = .03+.1*salt;
    float lampHeadCoef = .1+.3*pepper;
    float lampFootHeight = .03+.08*spice;
    float lampFootCoef = .1+.5*pepper;
    float lampFootCount = 3.+floor(5.*spice);
    float smoothFactor = .02;
    // lamp trunk
    p.y -= .75;
    p.z -= .5;
    p.x += roomHeight*.5;
    lamp = min(lamp, max(sdist(p.yz, lampThin), abs(p.x-lampHeight*.5-lampFootHeight*lampFootCoef)-lampHeight*.5));
    pp = p;
    p.x -= lampHeight;
    // lamp head
    lamp = min(lamp, max(sdist(p.yz, lampHeadRadius+p.x*lampHeadCoef), abs(p.x)-lampHeadHeight));
    // lamp foot
    p = pp;
    p.x -= lampFootThin*2.;
    amod(p.yz, lampFootCount);
    p.y -= lampFootHeight;
    pp = p;
    p.x += (p.y-lampFootHeight)*lampFootCoef;
    lamp = smin(lamp, max(sdist(p.xz, lampFootThin), abs(p.y)-lampFootHeight), smoothFactor);
    p = pp;
    // lamp foot balls
    p.y -= lampFootHeight;
    lamp = smin(lamp, sdist(p, lampFootThin*2.), smoothFactor);

    float chair = 1000.;
    float chairHeight = .2+.1*salt;
    float chairWidth = .05+.1*pepper;
    float chairLegThin = .002+.005*spice;
    float chairSitThin = .01;
    float chairBackHeight = .05;
    p = pRoom;
    p.y -= .75;
    p.z += .5;
    p.yz *= rot(salt*TAU);
    p.x -= chairHeight;
    p.x += roomHeight/2.;
    // sit
    chair = min(chair, sdBox(p, vec3(chairSitThin, chairWidth, chairWidth)));
    // back
    chair = min(chair, sdBox(p+vec3(-chairHeight+chairBackHeight,chairWidth-chairLegThin,0), vec3(chairBackHeight, chairLegThin, chairWidth)));
    // legs and arm
    float chairArm = step(0.,sign(p.y));
    p.yz = abs(p.yz)-chairWidth+chairLegThin;
    p.x += chairArm * chairHeight * .5;
    chair = min(chair, sdBox(p, vec3(chairHeight*mix(1.,.5,chairArm), chairLegThin, chairLegThin)));

    float paint = 1000.;
    float paintWidth = .05+0.1*salt;
    float paintHeight = .1+.2*pepper;
    float paintDepth = .001;
    p = pRoom;
    p.y -= 1.03;
    p.z += .5;
    paint = min(paint, sdBox(p, vec3(paintHeight, paintDepth, paintWidth)));

    float table = 1000.;


    scene = min(scene, min(wall.x, wall.y));
    scene = min(scene, lamp);
    scene = min(scene, chair);
    scene = min(scene, paint);
    // // vertical window
    // p = pTorus;
    // py = p.y + roomCount/2. + time * speed;
    // indexY = floor(py / (roomCount+roomThin));
    // p.y = repeat(py, roomCount+roomThin);
    // indexX = amodIndex(p.xz, roomCount);
    // amod(p.xz, roomCount);
    // seed = vec2(indexX, indexY);
    // salt = rng(seed);
    // p.x -= radius;
    // dimension.y = 1.5;
    // p.x +=  dimension.x * 1.25;
    // scene = max(scene, -sdBox(p, vec3(dimension, .1)));
    // scene = min(scene, window(p, dimension, salt));
    //
    // // elements
    // p = pTorus;
    // p.xz *= rot(PI/roomCount);
    // py = p.y + roomCount/2. + time * speed;
    // indexY = floor(py / (roomCount+roomThin));
    // p.y = repeat(py, roomCount+roomThin);
    // indexX = amodIndex(p.xz, roomCount);
    // amod(p.xz, segments);
    // seed = vec2(indexX, indexY);
    // salt = rng(seed);
    // p.x -= radius - roomHeight;
    // scene = min(scene, boxes(p, salt));

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
  vec3 light = normalize(vec3(-1,2.,-1));
  vec3 normal = getNormal(pos);
  vec3 view = normalize(eye-pos);
  float shade = dot(normal, view);
  shade *= hardShadow(pos, light);
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
  color *= getLight(pos, eye);
  color = smoothstep(.0, .5, color);
  color = sqrt(color);
  return color;
}

void main () {
  gl_FragColor = raymarch();
}
