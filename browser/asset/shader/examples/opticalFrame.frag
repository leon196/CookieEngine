
uniform sampler2D sceneTexture;
uniform vec2 resolution;
varying vec2 vUv;

void main ()	{
	// vec4 color = edge(sceneTexture, vUv, resolution);
	vec4 color = texture2D(sceneTexture, vUv);
	gl_FragColor = color;
}
