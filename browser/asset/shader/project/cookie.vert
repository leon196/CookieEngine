
varying vec2 vUv;

void main()	{
	vUv = uv;
	vec3 pos = position;
	// pos *= 10.;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.);
}
