
varying vec2 vUv;
uniform vec2 resolution;
uniform float time;
uniform sampler2D frameBuffer;
uniform sampler2D positionTexture;

void main()	{
	vec4 spawn = texture2D(positionTexture, vUv);
	vec4 buffer = texture2D(frameBuffer, vUv);
	float intensity = 0.1;
	buffer.xyz += intensity*(vec3(
		noiseIQ(buffer.xyz*3.123),
		noiseIQ(buffer.xyz),
		noiseIQ(buffer.xyz/3.56))*2.-1.);
	float shouldRespawn = sin(time*3.+noiseIQ(buffer.xyz*.3)*PI2*2.)*.5+.5;
	gl_FragColor = mix(buffer, spawn, shouldRespawn);
}