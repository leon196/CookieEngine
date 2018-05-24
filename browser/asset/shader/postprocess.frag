
uniform float time;
uniform sampler2D passScene, passRender, passBlur, passEdge, passBloom, heightmap;
uniform vec2 resolution;
varying vec2 vUv;

void main () {
	vec2 uv = vUv;
	// uv.x += sin(uv.y*10.)*.1;
	vec4 scene = texture2D(passScene, uv);
	vec4 bloom = texture2D(passBloom, uv);
	vec4 blur = texture2D(passBlur, uv);
	vec4 edge = texture2D(passEdge, uv);
	vec4 height = texture2D(heightmap, uv);

	vec4 color = bloom;

	// float wave = sin(time*8.)*.5+.5;
	// vec4 rays = godRays(passEdge, vUv, .95 - .05 * wave);
	// color += rays * .2 * wave;
	
	// float edgy = smoothstep(.0, .1, abs(luminance(edge(passRender, vUv, resolution*4.).rgb)));
	// color *= edgy;

	// float offset = -1.;
	// float scale = .25;
	// float dof = saturate(smoothstep(0., 1., abs(color.a+offset)*scale));
	// color = mix(color, bloom, dof);

	// color = 1. - color;
	gl_FragColor = color;
}