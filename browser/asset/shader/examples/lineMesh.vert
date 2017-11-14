
attribute vec3 next;
attribute vec2 anchor;
uniform vec2 resolution;
uniform float time;
varying vec4 vColor;

void main()	{
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	float size = .05;
	vec3 pos = position;
	pos += (next - pos) * (anchor.y*.5+.5);
	pos.y += anchor.x*size;
	pos *= 2.;

	vColor = vec4(1);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	// gl_Position.xy += anchor * size * aspect;
}
