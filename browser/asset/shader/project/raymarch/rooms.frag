
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

float map (vec3 pos) {

    float scene = 1000.;
    vec3 p = pos;
    vec3 pp = pos;
    vec3 ppp = pos;
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

    // walls
    p = pTorus;
    p.y = repeat(p.y, repeaty);
    vec2 wall = vec2(1000.);
    wall.x = max(abs(p.y)-roomThin, sdCylinder(p.xz, innerRadius));
    amod(p.xz, roomCount.x);
    p.x -= innerRadius;
    wall.y = max(abs(p.z)-roomThin, p.x);
    pWall = p;

    // room cell
    p = pTorus;
    p.xz *= rot(PI/roomCount.x);
    float py = p.y+repeaty/2.;
    seed.y = floor(py/repeaty);
    p.y = repeat(py, repeaty);
    seed.x = amod(p.xz, roomCount.x);
    p.x -= innerRadius-roomHeight/2.;

    pRoom = p;
    float chairSide = step(0., p.y);

    float lod = 100.;
    seed += floor(fract(time*.01)*lod)/lod;
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

    float table = 1000.;
    float tableHeight = .1+.2*salt;
    float tableThin = .01+.03*pepper;
    float tableWidth = .1+.2*spice;
    float tableDepth = .1+.1*salt;
    float tableLegThin = .005+.01*pepper;
    p = pRoom;
    p.x += roomHeight/2.-tableHeight;
    p.z += .5-tableDepth;
    pp = p;
    p.yz *= rot((salt*2.-1.)*.2);
    table = min(table, sdBox(p, vec3(tableThin, tableWidth, tableDepth)));
    p.yz = abs(p.yz)-vec2(tableWidth, tableDepth)+tableLegThin;
    p.x += tableHeight*.5;
    table = min(table, sdBox(p, vec3(tableHeight*.5, tableLegThin, tableLegThin)));

    float plate = 1000.;
    float plateRadius = .45 * min(tableDepth, tableWidth);
    float plateThin = .002;
    float plateCurveHeight = .01;
    float plateForkThin = .001;
    float plateForkHeight = .03+.03*salt;
    float plateForkWidth = .001+.003*salt;
    // plate
    p = pp;
    p.y = abs(p.y) - tableWidth * .5;
    p.x -= tableThin;
    pp = p;
    p.x -= plateThin+plateCurveHeight;
    p.x += cos(length(p.yz)*20.)*plateCurveHeight;
    plate = min(plate, max(sdist(p.yz, plateRadius), abs(p.x)-plateThin));
    // food
    float food = 1000.;
    float foodRadiusRatio = .3+.6*mix(pepper, spice, chairSide);
    float foodRepeat = .01;
    float foodEatenRatio = .1+.9*mix(salt, pepper, chairSide);
    ppp = p;
    p.yz = repeat(p.yz, foodRepeat);
    food = min(food, sdist(p, foodRepeat));
    p = ppp;
    food = max(food, sdist(p, plateRadius*foodRadiusRatio));
    food = max(food, step(foodEatenRatio, dot(normalize(p.yz), vec2(1,0))));
    // forks
    p = pp;
    p.x -= plateForkThin*2.;
    p.z = abs(p.z)-plateRadius*1.2;
    p.yz *= rot((spice*.5+.5)*.2);
    p.x -= (sin(p.y*50.)*.5+.5)*.01;
    plateForkWidth *= 1.+.5*sin(p.y*100.);
    plate = min(plate, sdBox(p, vec3(plateForkThin, plateForkHeight, plateForkWidth)));

    float chair = 1000.;
    p = pRoom;
    float chairHeight = .2+.1*mix(salt, pepper, chairSide);
    float chairWidth = .05+.1*mix(pepper, spice, chairSide);
    float chairLegThin = .002+.005*mix(spice, salt, chairSide);
    float chairSitThin = .01;
    float chairBackHeight = .05;
    p.z += .5-tableDepth;
    p.y = abs(p.y) - tableWidth - chairWidth*2.;
    p.yz *= rot(mix(salt, pepper, chairSide)*TAU);
    p.x -= chairHeight;
    p.x += roomHeight/2.;
    // sit
    chair = min(chair, sdBox(p, vec3(chairSitThin, chairWidth, chairWidth)));
    // back
    chair = min(chair, sdBox(p+vec3(-chairHeight+chairBackHeight,chairWidth-chairLegThin,0), vec3(chairBackHeight, chairLegThin, chairWidth)));
    // legs and arm
    float chairArm = step(0.,p.y);
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
    p.xz *= rot((salt*2.-1.)*.1);
    paint = min(paint, sdBox(p, vec3(paintHeight, paintDepth, paintWidth)));

    float door = 1000.;
    float doorWidth = .3;
    float doorHeight = .4;
    p = pRoom;
    p.x += roomHeight*.5-doorHeight;
    wall.x = max(wall.x, -sdBox(p, vec3(doorHeight, 2., doorWidth)));

    float window = 1000.;
    float windowHeight = .4;
    float windowWidth = .8;
    float windowThin = .03;
    float windowPadding = .02;
    float windowRepeatThin = .01;
    float windowRepeatWidth = .2;
    p = pTorus;
    p.y = repeat(p.y+repeaty/2., repeaty);
    amod(p.xz, roomCount.x);
    p.x -= innerRadius-roomHeight/2.;
    wall.y = max(wall.y, -sdBox(p, vec3(windowHeight, windowWidth, 1.)));
    window = min(window, sdBox(p, vec3(windowHeight, windowWidth, windowThin)));
    window = max(window, -sdBox(p, vec3(windowHeight-windowPadding, windowWidth-windowPadding, 1.)));
    p.y = repeat(p.y, windowRepeatWidth);
    p.yz *= rot(p.x*10.);
    window = min(window, sdBox(p, vec3(windowHeight, windowRepeatThin, windowRepeatThin)));

    scene = min(scene, min(wall.x, wall.y));
    scene = min(scene, window);
    scene = min(scene, door);
    scene = min(scene, lamp);
    scene = min(scene, chair);
    scene = min(scene, paint);
    scene = min(scene, table);
    scene = min(scene, plate);
    scene = min(scene, food);

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
