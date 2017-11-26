
attribute vec2 anchor;
attribute vec2 indexMap;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec4 vColor;

void main()	{
	vUv = anchor;
	vColor = vec4(1);
	float size = .4;
	float speed = .1;
	float range = 50.;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);

	vec3 pos = position;
	pos.y = repeat(pos.y-time*speed, 1.);
	size *= 1.-smoothstep(.0,.5,abs(pos.y));
	pos *= range;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	gl_Position.xy += anchor * size * aspect;
}
