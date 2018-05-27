
uniform float time;
uniform sampler2D frameEdge, passScene, passRender, passBlur, passEdge, passBloom, heightmap, heightNormalMap;
uniform vec2 resolution;
varying vec2 vUv;

void main () {
	vec2 uv = vUv;
	// uv.x = .5-abs(uv.x-.5);
	// uv.y = .5-abs(uv.y-.5);
	// uv = 1.-uv;

	vec4 scene = texture2D(frameEdge, uv);
	vec4 grass = texture2D(passScene, uv);
	vec4 bloom = texture2D(passBloom, uv);
	vec4 blur = texture2D(passBlur, uv);
	vec4 edge = texture2D(passEdge, uv);
	vec4 height = texture2D(heightmap, uv);
	vec4 normal = texture2D(heightNormalMap, uv);

	float depth = scene.a;
	depth = mix(depth, 1000.,step(depth,0.0001));
	float depthGrass = grass.a;
	depthGrass = mix(depthGrass, 1000.,step(depthGrass,0.0001));

	float offset = -.5;
	float scale = .5;
	float dof = saturate(smoothstep(0., 1., abs(depth+offset)*scale));

	float blendGrass = step(.0001,luminance(grass.rgb));
	blendGrass *= step(depthGrass, depth);
	vec4 color = edge*.75 + scene * .25;
	color = mix(scene, color, dof);
	color = mix(color, grass, blendGrass);

	// float wave = sin(time*8.)*.5+.5;
	// vec4 rays = godRays(passEdge, vUv, .95 - .05 * wave);
	// color += rays * .2 * wave;


	// color = 1. - color;
	gl_FragColor = color;
}