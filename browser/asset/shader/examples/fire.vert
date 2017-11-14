
attribute vec3 color;
attribute vec2 anchor;
attribute vec2 texcoord;
varying vec2 vTexcoord;
varying vec2 vUVMesh;
varying vec2 vAnchor;
varying vec2 vScreenUV;
varying vec3 vColor;
varying float vFade;
varying vec3 vNormal;
varying vec3 vVelocity;
varying vec3 vViewDir;
uniform sampler2D spawnTexture;
uniform sampler2D colorTexture;
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float time;
uniform vec2 resolution;
uniform float spriteVelocityStretch;
uniform float blendFire;

vec3 displace (vec3 p)
{
	// p.x += sin(p.y*.1 + time)*.5*clamp(p.y*.2,0.,1.);
	// p.z += cos(p.y*.2 + time)*.5*clamp(p.y*.2,0.,1.);
	return p;
}

void main() {
	vTexcoord = texcoord;
	vAnchor = anchor;
	vColor = color;

	vec3 pos = texture2D(positionTexture, vTexcoord).xyz;
	// vec3 col = texture2D(colorTexture, vTexcoord).xyz;
	vec4 posWorld = modelMatrix * vec4( displace(pos), 1.0 );
	
	vec3 viewDir = normalize(posWorld.xyz - cameraPosition.xyz);
	vec4 velocity = texture2D(velocityTexture, vTexcoord);
	float magnitude = length(velocity.xyz);
	// vColor = col;
	// vNormal = normalize((modelMatrix * vec4(normal,1)).xyz);
	vNormal = normalize(posWorld.xyz);

	float fade = smoothstep(0.0, 0.1, velocity.w) * (1. - smoothstep(0.8, 1.0, velocity.w));
	fade = mix(fade, 1., step(1., velocity.w));
	vFade = fade;

	float stretch = (1.+magnitude*spriteVelocityStretch);

	// world space
	vec3 tangent = normalize(cross(normalize(vec3(0,1,0.1)), vNormal));
	vec3 up = normalize(cross(tangent, vNormal));

	vec4 positionScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(posWorld.xyz,1.);
	vec4 velocityScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(posWorld.xyz + velocity.xyz,1.);
	// velocity space
	vec3 e = vec3(0.00001);
	velocity.xyz = normalize(velocity.xyz + e);
	vVelocity = velocity.xyz;
	float moving = smoothstep(0.0, 0.1, magnitude);
	// tangent = mix(tangent, normalize(cross(velocity.xyz, vNormal))*stretch*.2, moving);
	// up = mix(up, velocity.xyz*stretch, moving);


	vec2 size = .3 * vec2(0.4, 1.) * (.1+.9*rand(vTexcoord*10.));
	// posWorld.xyz += anchor.x * tangent * size.x + anchor.y * up * size.y;
	// posWorld.xyz -= up * size / 2.5;

	vViewDir = posWorld.xyz - cameraPosition;

	// vColor *= dot(normalize(vViewDir), vNormal)*.5+.5;

	gl_Position = projectionMatrix * viewMatrix * posWorld;

	vec2 forward = normalize(velocityScreen - positionScreen).xy;
	vec2 right = vec2(forward.y, -forward.x);

	forward = mix(vec2(0,1), forward * stretch, moving);
	right = mix(vec2(1,0), right * stretch, moving);

	// screen space
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	size *= blendFire * vFade;
	gl_Position.y += size.y;
	gl_Position.xy += right * anchor.x * size.x * aspect.x;
	gl_Position.xy += forward * anchor.y * size.y * aspect.y;

	vScreenUV = (gl_Position.xy/gl_Position.w) * 0.5 + 0.5;
}