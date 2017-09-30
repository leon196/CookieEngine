
varying vec2 vUv;
uniform vec2 resolution;
uniform float time;
uniform float dt;
uniform float blendBurnOut;
uniform float blendStorm;
uniform sampler2D frameBuffer;
uniform sampler2D velocityTexture;
uniform sampler2D spawnTexture;

void main()	{
	vec4 spawn = texture2D(spawnTexture, vUv);
	spawn.xyz = displaceTree(spawn.xyz, time, blendStorm);
	vec4 buffer = texture2D(frameBuffer, vUv);
	vec4 velocity = texture2D(velocityTexture, vUv);
	buffer.xyz += velocity.xyz;
	// float shouldRespawn = sin(time*3.+noiseIQ(buffer.xyz*.3)*PI2*2.)*.5+.5;
	float shouldRespawn = clamp(step(velocity.w, 0.0) + step(1.0, velocity.w),0.,1.);
	// shouldRespawn *= 1.-blendBurnOut;
	gl_FragColor = mix(buffer, spawn, shouldRespawn);
	// gl_FragColor = velocity;
}