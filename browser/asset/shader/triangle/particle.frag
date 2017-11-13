
varying vec2 vUv;
varying vec2 vAnchor;
varying vec2 vIndexMap;

void main()	{
	gl_FragColor = vec4(fract(abs(vAnchor*.5+.5)), 0, 0);
}
