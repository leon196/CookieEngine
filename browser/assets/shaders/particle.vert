
attribute vec3 color;
attribute vec2 anchor;
attribute vec2 texcoord;
varying vec2 vTexcoord;
varying vec2 vUVMesh;
varying vec2 vAnchor;
varying vec2 vScreenUV;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vViewDir;
uniform sampler2D spawnTexture;
uniform sampler2D colorTexture;
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float time;
uniform vec2 resolution;

void main() {
	vTexcoord = texcoord;
	vAnchor = anchor;
	vColor = color;

	vec3 pos = texture2D(positionTexture, vTexcoord).xyz;
	// vec3 col = texture2D(colorTexture, vTexcoord).xyz;
	vec4 posWorld = modelMatrix * vec4( pos, 1.0 );
	
	vec3 viewDir = normalize(posWorld.xyz - cameraPosition.xyz);
	vec4 velocity = texture2D(velocityTexture, vTexcoord);
	float magnitude = length(velocity.xyz);
	// vColor = col;
	vNormal = normalize((modelMatrix * vec4(normal,0)).xyz);

	float fade = smoothstep(0.0, 0.1, velocity.w) * (1. - smoothstep(0.9, 1.0, velocity.w));
	fade = mix(fade, 1., step(1., velocity.w));

	// float stretch = (1.+magnitude*spriteVelocityStretch);

	// world space
	vec3 tangent = normalize(cross(normalize(vec3(0,1,0.1)), vNormal));
	vec3 up = normalize(cross(tangent, vNormal));

	// velocity space
	// vec3 e = vec3(0.00001);
	// velocity.xyz = normalize(velocity.xyz + e);
	// float moving = smoothstep(0.0, 0.1, magnitude);
	// tangent = mix(tangent, normalize(cross(velocity.xyz, normal))*stretch*.2, moving);
	// up = mix(up, velocity.xyz*stretch, moving);


	float size = 0.2;
	// posWorld.xyz += (anchor.x * tangent + anchor.y * up) * size;
	// posWorld.xyz -= up * size / 2.5;

	vViewDir = posWorld.xyz - cameraPosition;

	// vColor *= dot(normalize(vViewDir), vNormal)*.5+.5;

	gl_Position = projectionMatrix * viewMatrix * posWorld;

	// screen space
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.xy += anchor * size * aspect;
	gl_Position.y += size / 2.5;

	vScreenUV = (gl_Position.xy/gl_Position.w) * 0.5 + 0.5;
}