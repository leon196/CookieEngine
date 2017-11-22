uniform sampler2D cookieTexture;
varying vec2 vUv;

void main()	{
	gl_FragColor = texture2D(cookieTexture, vUv);
}
