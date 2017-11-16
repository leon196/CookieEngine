
varying vec2 vUv;
varying vec4 vColor;

void main()	{
	if (length(vUv) > 0.5) discard;
	gl_FragColor = vColor;
}
