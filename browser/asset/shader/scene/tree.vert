
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 color;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float blendTree;
uniform float blendStorm;
uniform float blendFlash;
uniform float blendLight;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vDirCamera;
varying vec2 vAnchor;
varying vec4 vPosScreen;

vec3 displaceTree2 (vec3 p, float t, float blend)
{
    float a = noiseIQ(p/3.)*PI2;
    float intensity = .15*clamp(p.y*.2,0.,1.);
    p.z += sin(a + t * 3.)*intensity;
    p.z += cos(a + t * 3.)*intensity;

    float speed = 10.;
    intensity = 3.*clamp(p.y*.05,0.,1.) * blend;
    p.x += (-intensity + .2*cos(t * speed)) * intensity;
    p.y += .2*sin(-t * speed + length(p.xz)) * intensity;

    // float lod = 10.;
		float scale = .5;
		float seedScale = .3;
    // p = mix(p, ceil(p*lod)/lod, blendFlash);
		p.x += (noiseIQ(p*5.*seedScale+time*speed*4.)*2.-1.)*scale * blendFlash;
		p.y += (noiseIQ(p*6.*seedScale+time*speed*2.)*2.-1.)*scale * blendFlash;
		p.z += (noiseIQ(p*7.*seedScale+time*speed*3.)*2.-1.)*scale * blendFlash;
    return p;
}


void main()	{
	vColor = color;
	vAnchor = anchor;

	vec3 pos = displaceTree2(position, time, blendStorm);
	vec3 end = displaceTree2(lineEnd, time, blendStorm);

	float dist = length(end - pos);
	vNormal = end - pos;
	vDirCamera = pos - cameraPosition;

	float fadeDist = (1.-clamp(length(pos.xz)*.3,0.,1.));
	fadeDist *= (1.-clamp(abs(pos.y)*.3,0.,1.));
	float size = .01 + .2 * fadeDist;
	fadeDist = 1.-fadeDist;
	vColor *= fadeDist;
	size *= blendTree;
	// float edge = .5+.5*sin(time);
	// size *= 1.-smoothstep(0.0, 30.*edge, length(pos));

	vec4 posScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	vec4 lineEndScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(end,1);
	vec2 forward = lineEndScreen.xy - posScreen.xy;
	vec2 right = normalize(vec2(forward.y, -forward.x));
	right.x *= resolution.y/resolution.x;
	gl_Position = mix(posScreen, lineEndScreen, anchor.y);
	gl_Position.xy += right * anchor.x * size;

	vPosScreen = gl_Position;
}