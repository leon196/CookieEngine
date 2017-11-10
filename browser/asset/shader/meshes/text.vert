
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform float blendTextIn, blendTextOut;
uniform vec2 resolution;
uniform sampler2D frameTextureText;

varying vec2 vAnchor;
varying float vFadeOut;

void main()	{
	vAnchor = anchor;
	vec2 pivot = anchor * rot(PI/4.);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 size = vec2(.025);

	// size from texture grayscale
	float lum = luminance(texture2D(frameTextureText, indexMap).rgb);
	size *= clamp(lum*3., 0., 1.);

	// position from index map
	vec3 pos = vec3(indexMap*2.-1., 0.1+lum*.5);
	float seed = rand(pos.xy);
	float a = seed*PI2*5.;

	size *= .5+.5*seed;

	float fadeIn = smoothstep(0., 1., pos.x + (blendTextIn*2.-1.)*2.);
	float fadeOut = smoothstep(0., 1., rand(pos.xy) + (blendTextOut*2.-1.)*2.);
	vFadeOut = fadeOut;

	// fall animation
	vec2 offset = vec2(cos(a),sin(a)) * .5 * fadeOut;
	offset.y += sin(fadeOut*PI)*.25;
	offset.y -= fadeOut*.25;
	pos.xy += offset;

	// bounce it
	float should = waveB * smoothstep(.9,1.,seed);
	pos.xy += .5 * normalize(pos.xy) * should * fadeIn * (1.-fadeOut);
	size *= 1.+2.*fadeOut+2.*waveB*should;

	// wave animation
	pos.y += .05 * sin(pos.x*5.+time*2.);

	// pos it and scale in animation
	pos.x *= aspect.x;
	gl_Position = vec4(pos, .6*fadeIn);

		// spread quad on screenspace
	gl_Position.x += pivot.x * aspect.x * size.x;
	gl_Position.y += pivot.y * aspect.y * size.y;
}
