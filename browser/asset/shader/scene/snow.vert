
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float dimension;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec2 vDirScreen;
varying vec2 vAnchor;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vAnchor = anchor;
	float x = position.x*.5+.5;
	float y = position.y*.5+.5;
	float index = x * dimension + y * dimension * dimension;
	float range = 6.;
	float radius = index / (dimension*dimension);
	float angle = radius * 30.;
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
	radius = noiseIQ(position.xzz * 10.);
	pos.x += cos(angle) * radius;
	pos.z += sin(angle) * radius;
	pos = normalize(pos) * min(length(pos), range);
	vec4 posScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	gl_Position = posScreen;
	float size = .03 + .02 * rand(uv);
	size *= (1.-smoothstep(.8,1.,1.-ratio));
	size *= (1.-smoothstep(.8,1.,length(pos)/range));
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += anchor.x * size * aspect.x;
	gl_Position.y += anchor.y * size * aspect.y;
}