
uniform float time, textVisible;
uniform sampler2D frameEdge, frameFlat, frameText;
uniform vec2 resolution;
varying vec2 vUv;

void main () {
	vec2 uv = vUv;
	// uv.x = .5-abs(uv.x-.5);
	// uv.y = .5-abs(uv.y-.5);
	// uv = 1.-uv;

	vec4 scene = texture2D(frameEdge, uv);

	// vec4 scene = texture2D(frameEdge, vUv);
	// scene *= smoothstep(.0, .1, abs(luminance(edge(frameEdge, vUv, resolution*4.).rgb)));

	vec4 sceneFlat = texture2D(frameFlat, uv);
	vec4 edgy = texture2D(frameEdge, vUv);
	edgy *= smoothstep(.0, .1, abs(luminance(edge(frameEdge, vUv, resolution*4.).rgb)));

	float aspect = resolution.x/resolution.y;

	uv.x = (uv.x-.5) * aspect + .5;
	vec4 text = texture2D(frameText, uv);

	vec2 p = uv-.5;
	float off = (1.-textVisible) * 2.5;
	text += smoothstep(1.-off, 1.1-off, sin(atan(p.y, p.x) * 20.));
	off *= .5;
	text += smoothstep(off, off*.98, length(p));
	text = clamp(text, 0., 1.);

	float depth = scene.a;
	depth = mix(depth, 1000.,step(depth,0.0001));
	float depthFlat = sceneFlat.a;
	depthFlat = mix(depthFlat, 1000.,step(depthFlat,0.0001));

	float offset = -.5;
	float scale = .5;
	float dof = saturate(smoothstep(0., 1., abs(depth+offset)*scale));

	float blend = step(.0001,luminance(sceneFlat.rgb));
	blend *= step(depthFlat, depth);
	vec4 color = edgy*.75 + scene * .25;
	color = mix(scene, color, dof);
	color = mix(color, sceneFlat, blend);
	// color = mix(color, text, text.a);
	color *= text;

	// float wave = sin(time*8.)*.5+.5;
	// vec4 rays = godRays(passEdge, vUv, .95 - .05 * wave);
	// color += rays * .2 * wave;


	// color = 1. - color;
	gl_FragColor = color;
}