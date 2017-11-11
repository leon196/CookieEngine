
uniform sampler2D jonathanTexture;
uniform float time;
varying vec2 vUv;

void main()	{
	vec4 color = texture2D(jonathanTexture, vUv);
	gl_FragColor = color;
}
