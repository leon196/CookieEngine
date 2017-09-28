
uniform vec2 resolution;
uniform float time;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vPos;

vec4 displace (vec4 pos, float time)
{
	// float wave = sin(time + pos.x) * .5 + .5;
	// float wave = noiseIQ(pos.xxx *.5 + time * .15);
	// pos.y *= 1.+wave * 2.;
	// float a = -pos.x * .8;
	// float radius = 4. + sin(pos.y * .5 + time);
	// pos.x = cos(a + time) * radius;
	// pos.y += a * .5;
	// pos.z = sin(a + time) * radius;
	return pos;
}

void main()	{
	vTexcoord = uv;
	vNormal = normal;

	vec4 pos = modelMatrix * vec4(position, 1.);
	vPos = pos.xyz;
	vViewDir = pos.xyz - cameraPosition;

	pos = displace(pos, time);

	// pos = projectionMatrix * viewMatrix * pos;
	vec2 aspectRatio = vec2(resolution.y/resolution.x, 1.);
	gl_Position = vec4(pos.xy*.1*aspectRatio,0.,1.);
}