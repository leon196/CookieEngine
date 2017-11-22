
uniform sampler2D fireSceneTexture;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	vec2 uv = vUv;

	vec4 color = vec4(1.);//texture2D(fireSceneTexture, uv);

	// color.r = 1.;

	gl_FragColor = color;
}
