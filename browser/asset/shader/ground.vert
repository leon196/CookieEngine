
uniform sampler2D noiseMap;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

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
	vec2 rg = texture2DLod( noiseMap, (uv+0.5)/256.0, 0.0).yx;
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

void displace (inout vec3 p) {
  float d = length(p);
	p.y += fbm2(p * .02) * 3. * (clamp(d / 10., 0., 1.) + smoothstep(10.,40.,d) * 4.);
}

void main () {
	vUv = uv;
	vNormal = normal;

	vec4 pos = modelMatrix * vec4(position, 1);


	vec2 e = vec2(1.,0);
	vec3 north = pos.xyz + e.yyx;
	vec3 south = pos.xyz - e.yyx;
	vec3 east = pos.xyz + e.xyy;
	vec3 west = pos.xyz - e.xyy;
	displace(north);
	displace(south);
	displace(east);
	displace(west);
	vNormal = cross(west - east, north - south);

	displace(pos.xyz);

	vPosWorld = pos.xyz;

	vView = pos.xyz - cameraPosition;

	gl_Position = projectionMatrix * viewMatrix * pos;
}