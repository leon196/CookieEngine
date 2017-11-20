
varying vec2 vUv;
uniform vec2 resolution;
uniform float time;
uniform sampler2D fireSpawnTexture;

void main()	{
	// vec4 spawn = texture2D(spawnTexture, vUv);
	// spawn.xyz = displaceTree(spawn.xyz, time, blendStorm);
	// vec4 buffer = texture2D(frameBuffer, vUv);
	// vec4 velocity = texture2D(velocityTexture, vUv);
	// buffer.xyz += velocity.xyz;
	// // float shouldRespawn = sin(time*3.+noiseIQ(buffer.xyz*.3)*PI2*2.)*.5+.5;
	// float shouldRespawn = clamp(step(velocity.w, 0.0) + step(1.0, velocity.w),0.,1.);
	// shouldRespawn *= 1.-blendBurnOut;
	// gl_FragColor = mix(buffer, spawn, shouldRespawn);
	// gl_FragColor = velocity;
	vec4 position = texture2D(fireSpawnTexture, vUv);
	position.xyz *= 50.;
	gl_FragColor = position;
}
