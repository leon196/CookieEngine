
#define PI 3.1415926535897932384626433832795
#define PI2 6.283185307179586476925286766559
#define TAU (2.*PI)
#define HALFPI 1.5707963267948966192313216916398
#define HALF3PI 4.7123889803846898576939650749194

mat2 rot (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

vec3 lookAt (vec3 eye, vec3 target, vec2 anchor)
{
	vec3 forward = normalize(target-eye);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	return normalize(forward + right * anchor.x + up * anchor.y);
}

void lookAtUp (inout vec3 pos, vec3 target, vec2 anchor)
{
	vec3 forward = normalize(target-pos);
	vec3 right = normalize(cross(vec3(0,1,0), forward));
	pos += right * anchor.x + vec3(0,1,0) * anchor.y;
}

vec3 lookAtRay (vec3 eye, vec3 target, vec2 uv) {
  vec3 forward = normalize(target-eye);
  vec3 right = normalize(cross(vec3(0,1,0), forward));
  vec3 up = normalize(cross(forward, right));
  return normalize(forward + uv.x * right + uv.y * up);
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc*axis.x*axis.x + c, oc*axis.x*axis.y - axis.z*s, oc*axis.z*axis.x + axis.y*s, 0.0,
                oc*axis.x*axis.y + axis.z*s, oc*axis.y*axis.y + c, oc*axis.y*axis.z - axis.x*s, 0.0,
                oc*axis.z*axis.x - axis.y*s, oc*axis.y*axis.z + axis.x*s, oc*axis.z*axis.z + c, 0.0,
                0.0, 0.0, 0.0, 1.0);
}
float fOpUnionStairs(float a, float b, float r, float n) {
	float s = r/n, u = b-r;
  return min(min(a,b), 0.5*(u + a + abs ((mod (u - a + s, 2. * s)) - s)));
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

// mrharicot
// https://www.shadertoy.com/view/XdfGDH
float normpdf(in float x, in float sigma)
{
	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}

vec4 blur (sampler2D bitmap, vec2 uv, vec2 dimension)
{
	//declare stuff
	const int mSize = 5;
	const int kSize = (mSize-1)/2;
	float kernel[mSize];
	vec4 final_colour = vec4(0.0);
	
	//create the 1-D kernel
	float sigma = 7.0;
	float Z = 0.0;
	for (int j = 0; j <= kSize; ++j)
	{
		kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
	}
	
	//get the normalization factor (as the gaussian has been clamped)
	for (int j = 0; j < mSize; ++j)
	{
		Z += kernel[j];
	}
	
	//read out the texels
	for (int i=-kSize; i <= kSize; ++i)
	{
		for (int j=-kSize; j <= kSize; ++j)
		{
			final_colour += kernel[kSize+j]*kernel[kSize+i]*texture2D(bitmap, uv.xy+vec2(float(i),float(j)) / dimension.xy);

		}
	}
	
	return final_colour/(Z*Z);
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

// float rand ( vec2 seed ){ return fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453); }

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

float fbm3 (vec3 p, float t, vec3 offset) {
    float value = 0.0;
    float amplitud = .5;
    for (float i = 3.; i >= 1.; --i) {
        value += amplitud * noiseIQ(p);
        p *= 2.;
        p.xz *= rot(t);
        p += offset;
        amplitud *= .5;
    }
    return value;
}

float fbm4 (vec3 p, float t, vec3 offset) {
    float value = 0.0;
    float amplitud = .5;
    for (float i = 4.; i >= 1.; --i) {
        value += amplitud * noiseIQ(p);
        p *= 2.;
        p.xz *= rot(t);
        p += offset;
        amplitud *= .5;
    }
    return value;
}

float fbm5 (vec3 p, float t, vec3 offset) {
    float value = 0.0;
    float amplitud = .5;
    for (float i = 5.; i >= 1.; --i) {
        value += amplitud * noiseIQ(p);
        p *= 2.;
        p.xz *= rot(t);
        p += offset;
        amplitud *= .5;
    }
    return value;
}

// float pattern (vec3 p) {
//   vec3 q = vec3(fbm(p), fbm(p+vec3(10.5,51.5,7.5423)), fbm(p+vec3(1501.24,1254.324,658.6)));
// 	// q.xz *= rot(iGlobalTime*.2);
//   return fbm(p + 8. * q);
// }

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


vec4 rgbOffset (sampler2D bitmap, vec2 uv, vec2 dimension, float scale)
{
	vec4 rgb = vec4(1.);
	float angle = 0.;
	float radius = scale/dimension.y;
	vec2 offset = vec2(cos(angle), sin(angle))*radius;
	rgb.r = texture2D(bitmap, uv-offset).r;
	angle += PI2/3.;
	offset = vec2(cos(angle), sin(angle))*radius;
	rgb.g = texture2D(bitmap, uv-offset).g;
	angle += PI2/3.;
	offset = vec2(cos(angle), sin(angle))*radius;
	rgb.b = texture2D(bitmap, uv-offset).b;
	return rgb;
}

vec4 godRays (sampler2D bitmap, vec2 uv, float scale)
{
	vec4 color = texture2D(bitmap, uv);
	const int count = 5;
	for (int i = 0; i < count; ++i) {
		uv -= .5;
		uv *= scale;
		uv += .5;
		color += texture2D(bitmap, uv);
	}
	return color;
}

#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )

float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}