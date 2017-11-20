
uniform vec2 resolution;
varying vec2 vUv;

void main()	{
	vUv = uv;
	vec2 pos = uv * 2. - 1.;
	pos.x *= resolution.y / resolution.x;
	gl_Position = vec4(pos, 0., 1.);
}
