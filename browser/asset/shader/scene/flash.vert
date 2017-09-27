
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec2 vDirScreen;
varying vec3 vDir;
varying vec2 vAnchor;
varying vec3 vPos;

vec3 displace (vec3 p)
{
	float lod = 10.1;
	float speed = 10.;
	float scale = 2.;
	float seedScale = .3;
	p = ceil(p*lod)/lod;
	p.x += noiseIQ(p*5.*seedScale+time*speed*4.)*scale;
	p.y += noiseIQ(p*6.*seedScale+time*speed*2.)*scale;
	p.z += noiseIQ(p*7.*seedScale+time*speed*3.)*scale;
	// p.x += sin(p.y*.1 + time)*.5*clamp(p.y*.2,0.,1.);
	// p.z += cos(p.y*.2 + time)*.5*clamp(p.y*.2,0.,1.);
	return p;
}

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vAnchor = anchor;

	vec3 pos = displace(position);
	vec3 end = displace(lineEnd);

	vDir = normalize(end - pos);

	vPos = pos;

	vec4 posScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	vec4 lineEndScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(end,1);
	vDirScreen = lineEndScreen.xy - posScreen.xy;
	vec2 right = normalize(vec2(vDirScreen.y, -vDirScreen.x));
	right.x *= resolution.y/resolution.x;
	gl_Position = mix(posScreen, lineEndScreen, anchor.y);
	gl_Position.xy += right * anchor.x;
}