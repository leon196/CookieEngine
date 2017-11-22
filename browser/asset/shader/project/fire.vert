
attribute vec2 anchor;
attribute vec2 indexMap;

uniform sampler2D firePositionTexture;
uniform sampler2D fireVelocityTexture;
uniform float time;
uniform float FireSpriteSize;
uniform float FireSpriteVelocityStretch;
uniform vec2 resolution;

varying vec4 vColor;
varying vec2 vUv;

vec3 displace (vec3 p)
{
	// p.x += sin(p.y*.1 + time)*.5*clamp(p.y*.2,0.,1.);
	// p.z += cos(p.y*.2 + time)*.5*clamp(p.y*.2,0.,1.);
	return p;
}

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);

	vec4 pos = modelMatrix * vec4(texture2D(firePositionTexture, indexMap).xyz, 1.0 );
	vColor = vec4(.5);
	vUv = anchor;
	// vUv = uv;
	// vUv = vec2(0.);

	vec3 viewDir = normalize(pos.xyz - cameraPosition.xyz);
	vec4 velocity = texture2D(fireVelocityTexture, indexMap);
	float magnitude = length(velocity.xyz);
	vec3 normal = normalize(pos.xyz);

	float fade = smoothstep(0.0, 0.2, velocity.w) * (1. - smoothstep(0.8, 1.0, velocity.w));
	fade = mix(fade, 1., step(1., velocity.w));

	float stretch = (1.+magnitude*FireSpriteVelocityStretch);

	// world space
	vec3 tangent = normalize(cross(normalize(vec3(0,1,0.1)), normal));
	vec3 up = normalize(cross(tangent, normal));

	vec4 positionScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos.xyz,1.);
	vec4 velocityScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos.xyz + velocity.xyz,1.);
	// velocity space
	vec3 e = vec3(0.00001);
	velocity.xyz = normalize(velocity.xyz + e);
	float moving = smoothstep(0.0, 0.1, magnitude);
	// tangent = mix(tangent, normalize(cross(velocity.xyz, normal))*stretch*.2, moving);
	// up = mix(up, velocity.xyz*stretch, moving);


	vec2 size = vec2(FireSpriteSize) * (.1+.9*rand(indexMap*10.));
	size *= fade;
	// pos.xyz += anchor.x * tangent * size.x + anchor.y * up * size.y;
	// pos.xyz -= up * size / 2.5;

	float ratio = dot(normalize(viewDir), normalize(velocity.xyz))*.5+.5;
	vColor.rgb = mix(vec3(01, 0.898, 0.478), vec3(0.733, 0.160, 0.105), smoothstep(.1,.9,ratio));

	// vColor *= dot(normalize(vViewDir), normal)*.5+.5;

	// vColor.a = length(cameraPosition-pos.xyz);
	gl_Position = projectionMatrix * viewMatrix * pos;

	vec2 forward = normalize(velocityScreen - positionScreen).xy;
	vec2 right = vec2(forward.y, -forward.x);

	forward = mix(vec2(0,1), forward, moving);
	right = mix(vec2(1,0), right, moving);
	// screen space
	gl_Position.xy += right * anchor.x * size.x;
	gl_Position.xy += forward * anchor.y * size.y * stretch;
}
