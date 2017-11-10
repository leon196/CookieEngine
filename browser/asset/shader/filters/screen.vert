
varying vec2 vUv;

void main()	{
	vUv = uv;
	gl_Position = vec4(mix(-1., 1., uv.x), mix(-1., 1., uv.y), 0., 1.);
}