
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 color;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float blendTree;
uniform float blendStorm;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vDirScreen;
varying vec3 vDir;
varying vec3 vDirCamera;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vColor = color;

	vec3 pos = displaceTree(position, time, blendStorm);
	vec3 end = displaceTree(lineEnd, time, blendStorm);

	float dist = length(end - pos);
	vDir = end - pos;
	vDirCamera = pos - cameraPosition;

	float fadeDist = (1.-clamp(length(pos.xz)*.2,0.,1.));
	fadeDist *= (1.-clamp(pos.y*.05,0.,1.));
	float size = .01 + .1 * fadeDist;
	vColor *= 1.-fadeDist;
	size *= blendTree;
	// float edge = .5+.5*sin(time);
	// size *= 1.-smoothstep(0.0, 30.*edge, length(pos));

	vec4 posScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	vec4 lineEndScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(end,1);
	vDirScreen = lineEndScreen.xy - posScreen.xy;
	vec2 right = normalize(vec2(vDirScreen.y, -vDirScreen.x));
	right.x *= resolution.y/resolution.x;
	gl_Position = mix(posScreen, lineEndScreen, anchor.y);
	gl_Position.xy += right * anchor.x * size;
}