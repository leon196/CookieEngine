
attribute vec2 anchor;
uniform vec2 resolution;
uniform float time;
uniform float blendStorm;
uniform float blendLeaf;
varying vec2 vAnchor;
varying float vShade;

void main()	{
	vAnchor = anchor;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec3 seed = vec3(position);
	float rnd1 = rand(seed.xy);
	float rnd2 = rand(seed.xz);
	float a = rnd2 * PI2 + time;
	float t = time * .6;
	vec2 size = vec2(.9,1.) * .5;
	vec3 pos = displaceTree(position, time, blendStorm);

	vShade = sin(a)*.5+.5;
	float blendSize = smoothstep(.3, .7,noiseIQ(rotateY(rotateX(seed*.3, t), t*.5)));
	float blendType = smoothstep(.7,.9,vShade);

	size *= .1+.9*rnd1;
	size *= blendSize * blendLeaf;

	float x = cos(a) * .5 * clamp(vAnchor.y,0.,1.) * rnd1 * blendLeaf;
	float y = size.y*.5*mix(1.,-1.,blendType);
	pos.x += x * (1.-blendType);
	pos.y += y;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	gl_Position.x += vAnchor.x * aspect.x * size.x;
	gl_Position.y += vAnchor.y * aspect.y * size.y;
}