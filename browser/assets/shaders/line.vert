
uniform vec2 resolution;
uniform float time;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vec4 pos = displace(modelMatrix * vec4(position, 1.), time);
	pos = viewMatrix * pos;
	vPos = pos.xyz;
	gl_Position = layer(pos, resolution, .2);
}