
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float blendSnow;
uniform float blendStorm;
uniform float dimension;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;
varying vec4 vPosScreen;
varying vec2 vDirScreen;
varying vec2 vAnchor;
varying vec2 vSpotTarget;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vAnchor = anchor;
	vSpotTarget = vec2(0);
	float x = position.x*.5+.5;
	float y = position.y*.5+.5;
	float index = x * dimension + y * dimension * dimension;
	float range = 20.;
	float radius = index / (dimension*dimension);
	float angle = radius * 20.;
	// angle = mix(angle, mod(angle + time * 5., PI2), blendStorm);
	radius = mod(radius + time *.03, 1.);
	x = cos(angle) * radius;
	y = sin(angle) * radius;
	float height = 30.;
	vec3 pos = vec3(x, 0, y) * range;
	pos.y = height-mod(noiseIQ(position.xyy*10.)*10.+time*.01, 1.)*height;
	float ground = noiseIQ(vec3(x,y,0)*10.);
	float ratio = clamp(abs(pos.y / height), 0., 1.);
	pos.y = height * (1.-smoothstep(0.,.5,1.-ratio));
	pos.y = max(pos.y, ground);

	angle = rand(position.xz) * PI2;
	angle = mix(angle, mod(angle + time, PI2), blendStorm);
	radius = noiseIQ(position * 10.) * 5.;
	pos.x += cos(angle) * radius;
	pos.z += sin(angle) * radius;
	pos = normalize(pos) * min(length(pos), range);
	// pos.xz = mix(pos.xz, pos.xz*rot(time), blendStorm);
	float a = atan(pos.z, pos.x);
	float r = length(pos.xz);
	float shade = sin(r+a+time*10.)*.5+.5;
	shade = smoothstep(.0,.5,shade);
	pos.y += shade * rand(position.xz) * 10. * blendStorm * (1.-clamp(r*.1+a,0.,1.));
	vPos = pos;
	vPosScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	gl_Position = vPosScreen;
	float size = .04;// + .01 * rand(uv);
	size *= smoothstep(.0,.5,ratio);
	size += blendStorm*.02;
	// size *= (1.-smoothstep(.8,1.,1.-ratio));
	// size *= (1.-smoothstep(.8,1.,length(pos)/range));
	size *= blendSnow;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += anchor.x * size * aspect.x;
	gl_Position.y += anchor.y * size * aspect.y;

	vSpotTarget = gl_Position.xy;
	// vSpotTarget = (projectionMatrix * viewMatrix * modelMatrix * vec4(pos.x,pos.y+cameraPosition.y,pos.z,1)).xy;
}