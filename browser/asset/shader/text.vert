
uniform vec2 resolution;
uniform float time;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;

vec4 displace (vec4 pos, float time)
{
	float wave = sin(time + pos.x) * .5 + .5;
	wave = noiseIQ(pos.xxx *.5 + time);
	pos.y *= wave * 10.;
	float a = -pos.x * .8;
	float radius = 4. + sin(pos.y * .5 + time);
	pos.x = cos(a + time) * radius;
	pos.y += a * .5;
	pos.z = sin(a + time) * radius;
	return pos;
}

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vec4 pos = displace(modelMatrix * vec4(position, 1.), time);
	pos = projectionMatrix * viewMatrix * pos;
	gl_Position = pos;
}