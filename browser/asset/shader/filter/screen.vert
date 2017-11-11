
varying vec2 vUv;
varying vec3 vPos;

void main()	{
	vUv = uv;
	gl_Position = vec4(mix(-1., 1., uv.x), mix(-1., 1., uv.y), 0., 1.);
	vPos = gl_Position.xyz;
}
