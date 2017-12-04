
#define PI 3.1415926535897932384626433832795
#define PI2 6.283185307179586476925286766559
#define TAU (2.*PI)
#define HALFPI 1.5707963267948966192313216916398
#define HALF3PI 4.7123889803846898576939650749194

#define repeat(v,s) (mod(v,s)-s/2.)
#define sdist(p,r) (length(p)-r)

// raymarch toolbox
float rng (vec2 seed) { return fract(sin(dot(seed*.1684,vec2(54.649,321.547)))*450315.); }
mat2 rot (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float sdSphere (vec3 p, float r) { return length(p)-r; }
float sdCylinder (vec2 p, float r) { return length(p)-r; }
float sdDisk (vec3 p, vec3 s) { return max(max(length(p.xz)-s.x, s.y), abs(p.y)-s.z); }
float sdIso(vec3 p, float r) { return max(0.,dot(p,normalize(sign(p))))-r; }
float sdBox( vec3 p, vec3 b ) { vec3 d = abs(p) - b; return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0)); }
float sdTorus( vec3 p, vec2 t ) { vec2 q = vec2(length(p.xz)-t.x,p.y); return length(q)-t.y; }
float amod (inout vec2 p, float count) { float an = PI2/count; float a = atan(p.y,p.x)+an/2.; float c = floor(a/an); c = mix(c,abs(c),step(count*.5,abs(c))); a = mod(a,an)-an/2.; p.xy = vec2(cos(a),sin(a))*length(p); return c; }
float amodIndex (vec2 p, float count) { float an = TAU/count; float a = atan(p.y,p.x)+an/2.; float c = floor(a/an); c = mix(c,abs(c),step(count*.5,abs(c))); return c; }
float smoo (float a, float b, float r) { return clamp(.5+.5*(b-a)/r, 0., 1.); }
float smin (float a, float b, float r) { float h = smoo(a,b,r); return mix(b,a,h)-r*h*(1.-h); }
float smax (float a, float b, float r) { float h = smoo(a,b,r); return mix(a,b,h)+r*h*(1.-h); }
vec2 toroidal (vec2 p, float r) { return vec2(length(p.xy)-r, atan(p.y,p.x)); }
float fOpUnionStairs(float a, float b, float r, float n) {
	float s = r/n, u = b-r;
  return min(min(a,b), 0.5 * (u + a + abs ((mod (u - a + s, 2. * s)) - s)));
}
// float map (vec3);
// vec3 getNormal (vec3 p) { vec2 e = vec2(.01,0); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx))); }

// mercury
float pModPolar(inout vec2 p, float repetitions) {
	float angle = 2.*PI/repetitions;
	float a = atan(p.y, p.x) + angle/2.;
	float r = length(p);
	float c = floor(a/angle);
	a = mod(a,angle) - angle/2.;
	p = vec2(cos(a), sin(a))*r;
	// For an odd number of repetitions, fix cell index of the cell in -x direction
	// (cell index would be e.g. -5 and 5 in the two halves of the cell):
	if (abs(c) >= (repetitions/2.)) c = abs(c);
	return c;
}

float colorDistance (vec4 a, vec4 b) {
  return (abs(a.r-b.r)+abs(a.g-b.g)+abs(a.b-b.b))/3.0;
}

float luminance ( vec3 color )
{
	return (color.r + color.g + color.b) / 3.0;
}

float range (float fromA, float toA, float fromB, float toB, float value)
{
	return smoothstep(fromA, toA, value) * (1. - smoothstep(fromB, toB, value));
}

// Sam Hocevar
vec3 rgb2hsv(vec3 c)
{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Sam Hocevar
vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 edge (sampler2D bitmap, vec2 uv, vec2 dimension)
{
	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

	color += -1.0 * texture2D(bitmap, uv + vec2(-2, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-2, -1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  2) / dimension);

	color += -1.0 * texture2D(bitmap, uv + vec2(-1, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-1, -1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  2) / dimension);

	color += -1.0 * texture2D(bitmap, uv + vec2( 0, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 0, -1) / dimension);
	color += 24.0 * texture2D(bitmap, uv + vec2( 0,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 0,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 0,  2) / dimension);

	color += -1.0 * texture2D(bitmap, uv + vec2( 1, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 1, -1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  2) / dimension);

	color += -1.0 * texture2D(bitmap, uv + vec2( 2, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 2, -1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  2) / dimension);

	return color;
}

float rand ( vec2 seed ){ return fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453); }

// hash based 3d value noise
// function taken from https://www.shadertoy.com/view/XslGRr
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// ported from GLSL to HLSL
float hash( float n )
{
	return fract(sin(n)*43758.5453);
}

float noiseIQ( vec3 x )
{
	// The noise function returns a value in the range -1.0f -> 1.0f
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);
	float n = p.x + p.y*57.0 + 113.0*p.z;
	return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
	 mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
	mix(mix( hash(n+113.0), hash(n+114.0),f.x),
	 mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

float fbm (vec3 p) {
    float value = 0.0;
    float amplitud = .5;
    for (float i = 1.; i <= 4.; i++) {
        value += amplitud * noiseIQ(p);
        p *= 2.;
        amplitud *= .5;
    }
    return value;
}

float pattern (vec3 p) {
  vec3 q = vec3(fbm(p), fbm(p+vec3(10.5,51.5,7.5423)), fbm(p+vec3(1501.24,1254.324,658.6)));
	// q.xz *= rot(iGlobalTime*.2);
  return fbm(p + 8. * q);
}

vec3 rotateY(vec3 v, float t)
{
	float cost = cos(t); float sint = sin(t);
	return vec3(v.x * cost + v.z * sint, v.y, -v.x * sint + v.z * cost);
}

vec3 rotateX(vec3 v, float t)
{
	float cost = cos(t); float sint = sin(t);
	return vec3(v.x, v.y * cost - v.z * sint, v.y * sint + v.z * cost);
}

vec3 rotateZ(vec3 p, float angle)
{
	float c = cos(angle);
	float s = sin(angle);
	return vec3(c*p.x+s*p.y, -s*p.x+c*p.y, p.z);
}

float reflectance(vec3 a, vec3 b) { return dot(normalize(a), normalize(b)) * 0.5 + 0.5; }
vec2 kaelidoGrid(vec2 p) { return vec2(step(mod(p, 2.0), vec2(1.0))); }

vec2 lightDirection (sampler2D bitmap, vec2 uv, vec2 dimension)
{
  vec2 force = vec2(0.0, 0.0);
  vec3 c = texture2D(bitmap, uv).rgb;
  float l = luminance(c);

  c = texture2D(bitmap, uv + vec2(-1.0, 0.0) / dimension).rgb;
  force.x += luminance(c) - l;

  c = texture2D(bitmap, uv + vec2(1.0, 0.0) / dimension).rgb;
  force.x += l - luminance(c);

  c = texture2D(bitmap, uv + vec2(0.0, -1.0) / dimension).rgb;
  force.y += luminance(c) - l;

  c = texture2D(bitmap, uv + vec2(0.0, 1.0) / dimension).rgb;
  force.y += l - luminance(c);

  c = texture2D(bitmap, uv + vec2(-1.0, -1.0) / dimension).rgb;
  force += luminance(c) - l;

  c = texture2D(bitmap, uv + vec2(-1.0, 1.0) / dimension).rgb;
  force += l - luminance(c);

  c = texture2D(bitmap, uv + vec2(1.0, -1.0) / dimension).rgb;
  force += luminance(c) - l;

  c = texture2D(bitmap, uv + vec2(1.0, 1.0) / dimension).rgb;
  force += l - luminance(c);

  return force;
}

vec3 displaceTree (vec3 p, float t, float blend)
{
    float a = noiseIQ(p/3.)*PI2;
    float intensity = .15*clamp(p.y*.2,0.,1.);
    p.z += sin(a + t * 3.)*intensity;
    p.z += cos(a + t * 3.)*intensity;

    float speed = 10.;
    intensity = 3.*clamp(p.y*.05,0.,1.) * blend;
    p.x += (-intensity + .2*cos(t * speed)) * intensity;
    p.y += .2*sin(-t * speed + length(p.xz)) * intensity;
    return p;
}
