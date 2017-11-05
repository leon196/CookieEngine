
uniform sampler2D frame;
uniform sampler2D buffer;
uniform sampler2D uTextureTitle;
uniform sampler2D uTextureDate;
uniform float fadeTransition;
uniform float blendLight;
uniform float blendLabelFire;
uniform float blendLabelAlpha;
uniform float blendHeat;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	vec4 color = texture2D(frame, vUv);
	vec2 uv = vUv;
	// vec2 unit = 1./resolution;
	// uv -= normalize(uv-vec2(.5))*unit;
	// vec4 colorBuffer = texture2D(buffer, uv);
	// gl_FragColor = mix(color, colorBuffer, .9);
	gl_FragColor = color;
}