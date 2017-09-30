
attribute vec2 anchor, texcoord;
varying vec3 vVelocity, vViewDir;
varying vec2 vAnchor;
uniform sampler2D spawnTexture, colorTexture, positionTexture, velocityTexture;
uniform float time, spriteVelocityStretch, blendFire, blendHeat;
uniform vec2 resolution;

void main() {
	vAnchor = anchor;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);

	vec3 pos = texture2D(positionTexture, texcoord).xyz;
	vec4 posWorld = modelMatrix * vec4( pos, 1.0 );
	vViewDir = posWorld.xyz - cameraPosition;
	
	vec4 velocity = texture2D(velocityTexture, texcoord);
	float magnitude = length(velocity.xyz);
	float moving = smoothstep(0.0, 0.1, magnitude);
	float stretch = (1.+magnitude*spriteVelocityStretch);
	vec3 e = vec3(0.00001);
	velocity.xyz = normalize(velocity.xyz + e);
	vVelocity = velocity.xyz;

	vec2 size = .3 * vec2(0.4, 1.) * (.1+.9*rand(texcoord*10.));
	float fade = smoothstep(0.0, 0.1, velocity.w) * (1. - smoothstep(0.8, 1.0, velocity.w));
	fade = mix(fade, 1., step(1., velocity.w));
	size *= fade * blendHeat;

	// world space
	vec3 normal = -normalize(posWorld.xyz);
	vec3 tangent = normalize(cross(normalize(vec3(0,1,0.1)), normal));
	vec3 up = normalize(cross(tangent, normal));

	gl_Position = projectionMatrix * viewMatrix * posWorld;

	// screen space
	vec4 positionScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(posWorld.xyz,1.);
	vec4 velocityScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(posWorld.xyz + velocity.xyz,1.);
	vec2 forward = normalize(velocityScreen - positionScreen).xy;
	vec2 right = vec2(forward.y, -forward.x);
	forward = mix(vec2(0,1), forward * stretch, moving);
	right = mix(vec2(1,0), right * stretch, moving);

	gl_Position.xy += right * anchor.x * size.x * aspect.x;
	gl_Position.xy += forward * anchor.y * size.y * aspect.y;
}