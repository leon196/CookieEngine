uniform sampler2D meshTexture;
varying vec2 vUv;

void main()	{
	gl_FragColor = texture2D(meshTexture, vUv);
}
