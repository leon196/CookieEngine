
varying vec2 vUv;
uniform vec2 resolution;
uniform float time;
uniform sampler2D frameBuffer;
uniform sampler2D positionTexture;
// uniform sampler2D velocityTexture;

void main()	{
	vec4 spawn = texture2D(positionTexture, vUv);
	// vec4 velocity = texture2D(velocityTexture, vUv);
	// vec4 buffer = texture2D(frameBuffer, vUv);
	// buffer.xyz += velocity.xyz;
	// buffer.xyz += normalize(buffer.xyz)*0.1;
	// spawn.xyz = rotateX(rotateY(spawn.xyz, time*0.2),time*0.1);
	// float shouldRespawn = clamp(step(velocity.w, 0.0) + step(1.0, velocity.w),0.,1.);
	gl_FragColor = spawn;//mix(buffer, spawn, shouldRespawn);
	// gl_FragColor = spawn;
}