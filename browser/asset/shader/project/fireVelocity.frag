
varying vec2 vUv;
uniform vec2 resolution;
uniform float time;
uniform sampler2D fireVelocityTexture;
uniform sampler2D fireSpawnTexture;
uniform sampler2D firePositionTexture;
uniform sampler2D cookieTexture;
uniform sampler2D uvTexture;
uniform float FireVelocitySpeed;
uniform float FireVelocityTargetBlend;
uniform float FireVelocityOriginBlend;
uniform float FireVelocityNoiseBlend;
uniform float FireVelocityTornadoBlend;
uniform float FireVelocityDirectionBlend;
uniform float FireVelocityFrictionBlend;
uniform float FireVelocityDamping;
uniform float FireTurbulenceRangeMin;
uniform float FireTurbulenceRangeMax;
uniform float FireNoiseScale;
uniform float FireNoiseSpeed;


void main()	{
	vec4 spawn = texture2D(fireSpawnTexture, vUv);
	vec4 velocity = texture2D(fireVelocityTexture, vUv);
	vec4 position = texture2D(firePositionTexture, vUv);
	vec4 uv = texture2D(uvTexture, vUv);
	vec4 color = texture2D(cookieTexture, uv.xy);

	float spawnOffset = rand(vUv) * 0.01 + 0.01;
	// velocity.w = spawnOffset+time;
	// gl_FragColor.w = mix(mod(velocity.w, 1.0), -1.0, step(1.0, mod(velocity.w,1.)));
	gl_FragColor.w = mix(mod(velocity.w + spawnOffset, 1.0), -1.0, step(1.0, velocity.w + spawnOffset));
	// gl_FragColor.w = .5;

	vec3 epsilon = vec3(1)*0.00001;

	// target
	vec3 target = normalize(vec3(0) - position.xyz + epsilon) * FireVelocityTargetBlend;

	// noisey
	vec3 noisey = vec3(0.);
	vec4 seed = color+position+spawn+velocity;
	seed *= FireNoiseScale;
	seed.xyz = rotateY(seed.xyz, time*0.06*FireNoiseSpeed);
	// seed.xyz = rotateX(rotateY(seed.xyz, time*0.03*FireNoiseSpeed), time*0.06*FireNoiseSpeed);
	noisey.x += (noiseIQ(seed.xyz*2.5)*2.-1.);
	noisey.y += (noiseIQ(seed.xyz*1.4)*2.-1.);
	noisey.z += (noiseIQ(seed.xyz*3.3)*2.-1.);
	noisey.xyz *= FireVelocityNoiseBlend;

	// tornardo
	vec3 tornado = normalize(epsilon + position.xyz - (target + rotateY(position.xyz - target, abs(position.y )))) * FireVelocityTornadoBlend;

	// dir
	vec3 dir = vec3(0,0,-1.) * FireVelocityDirectionBlend;

	// origin
	vec3 origin = normalize(spawn.xyz - position.xyz + epsilon) * FireVelocityOriginBlend;

	// apply
	// spawn.xyz = rotateX(rotateY(spawn.xyz, time*0.2),time*0.1);
	float should = smoothstep(FireTurbulenceRangeMin,FireTurbulenceRangeMax,mod(noiseIQ(seed.xyz),1.0));
	vec3 offset = (tornado + dir + noisey + target) + origin * (1. - should);

	// offset = attractor * .1;


	gl_FragColor.xyz = velocity.xyz * FireVelocityDamping + offset * FireVelocitySpeed;
}
