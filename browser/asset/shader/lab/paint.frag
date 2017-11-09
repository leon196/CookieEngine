
uniform float time;
uniform float blendPaint;
uniform sampler2D frameText;

varying vec3 vDirection;
varying vec3 vView;
varying vec3 vNormal;
varying vec2 vAnchor;
varying vec2 vUv;
varying float vDepth;
varying float vRatio;
varying float vDisp;
varying float vSeed;

void main()	{
	vec2 anchor = vAnchor+.5;
	float dist = length(anchor);
	if (dist > 0.5) discard;
	vec3 color = vec3(1);// * (.9+.1*vSeed);
	// color = texture2D(frameText, vUv).rgb;
	// color.rgb = mix(vec3(1), vec3(0), color.g);//step(.1, color.g));
	// color *= step(.6,1.-dist);
	float shade = smoothstep(.5,.7,1.-abs(anchor.x));
	shade *= smoothstep(.5,.7,1.-abs(anchor.y));
	anchor.xy *= rot(PI/4.);
	// color.rgb *= step(.5,1.-clamp(abs(anchor.x)+abs(anchor.y),0.,1.));
	float depth = vDepth;
	gl_FragColor = vec4(color, (1.-vDisp) * blendPaint * shade);
}
