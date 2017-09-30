
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
	vShade = sin(rnd2 * PI2)*.5+.5;
	float blendSize = smoothstep(.3, .7,noiseIQ(rotateY(rotateX(seed*.3, t), t*.5)));
	float blendType = smoothstep(.8,1.,vShade);

	vec3 pos = displaceTree(position, time, blendStorm);
	vec2 size = mix(vec2(.5,.6), vec2(1.5,.8)*.7, blendType);

	size *= .1+.9*rnd1;
	size *= blendSize * blendLeaf;

	vec2 pivot = vAnchor;
	pivot.y = mix(pivot.y, -pivot.y, blendType);
	pivot.y += mix(1.,-0.25, blendType);
	pivot.xy = mix(pivot.xy, pivot.xy*rot(sin(a)*.3),blendType);

	float x = cos(a) * .5 * clamp(pivot.y,0.,1.) * rnd1 * blendLeaf;
	float y = size.y*.5*mix(0.,-.1,blendType);

	pos.x += x * (1.-blendType);
	pos.y += y;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	gl_Position.x += pivot.x * size.x * aspect.x;
	gl_Position.y += pivot.y * size.y * aspect.y;
}