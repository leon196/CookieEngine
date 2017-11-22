
varying vec2 vUv;
uniform vec2 resolution;
uniform float time;
uniform sampler2D fireSpawnTexture;
uniform sampler2D firePositionTexture;
uniform sampler2D fireVelocityTexture;

void main()	{
	vec4 spawn = texture2D(fireSpawnTexture, vUv);
	vec4 position = texture2D(firePositionTexture, vUv);
	vec4 velocity = texture2D(fireVelocityTexture, vUv);
	position.xyz += velocity.xyz;
	// float shouldRespawn = sin(time*3.+noiseIQ(position.xyz*.3)*PI2*2.)*.5+.5;
	float shouldRespawn = clamp(step(velocity.w, 0.0) + step(1.0, velocity.w),0.,1.);
	gl_FragColor = mix(position, spawn, shouldRespawn);
	// gl_FragColor = spawn;
	// vec4 position = texture2D(fireSpawnTexture, vUv);
	// position.xyz *= 50.;
	// gl_FragColor = position;
}
