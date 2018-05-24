
uniform sampler2D noiseMap;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

const vec3 blue1 = vec3(0.165,0.329,0.431);
const vec3 blueLight = vec3(0.18,0.263,0.447);
const vec3 blue = vec3(0.306,0.388,0.557);

// https://www.shadertoy.com/view/4sfGzS
const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

float noiseIQ2( in vec3 x )
{
	vec3 p = floor(x);
	vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = texture2D( noiseMap, (uv+0.5)/256.0).yx;
	return mix( rg.x, rg.y, f.z );
}

float fbm2 ( in vec3 p ) {
  vec3 q = 8.0*p.xzy;
	float f = noiseIQ2( 16.0*p.xzy );
  f  = 0.5000*noiseIQ2(q); q = m*q*2.01;
  f += 0.2500*noiseIQ2(q); q = m*q*2.02;
  f += 0.1250*noiseIQ2(q); q = m*q*2.03;
  f += 0.0625*noiseIQ2(q); q = m*q*2.01;
  return f;
}

void main () {
	vec3 view = normalize(vView);
	vec3 color = view*.5+.5;
	float shade = abs(view.y);
	shade *= fbm(view * 3., 0., vec3(time,0,0) * .5);
	float lod = 32.;
	// float dither = rand(vUv);
	// shade += dither * .01;
	shade = ceil(shade * lod) / lod;
	color = mix(blue1, vec3(1), shade);
	gl_FragColor = vec4(color, length(vView));
}