
uniform float time;
uniform float blendPaint;
uniform sampler2D framePaint;

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
	float dist = length(vAnchor+.5);
	// if (dist > .5) discard;
	vec3 color = vec3(1);// * (.9+.1*vSeed);
	// color = texture2D(framePaint, vUv).rgb;
	// color *= step(.6,1.-dist);
	float depth = vDepth;
	gl_FragColor = vec4(color, (1.-vDisp) * blendPaint);
}
