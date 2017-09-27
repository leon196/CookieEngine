
uniform sampler2D uTexture;
uniform float time;
uniform float blendFlash;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vDir;
varying vec2 vAnchor;

vec3 red = vec3(0.580, 0, 0);

void main()	{
	vec2 uv = vAnchor;
	// vec4 color = texture2D(uTexture, uv.xy);
	vec4 color = vec4(1);
	float fade = sin(uv.y*PI);
	vec3 seed = vPos;
	// float noisy = noiseIQ(seed*100.);
	float speed = 10.;
	float noisy = sin(uv.y*5.-time*speed)+sin(uv.y*20.);
	float scale = .1;
	// uv.x += fade * sin(uv.y*5.*sin(uv.y*3.+time)+time) * .1;
	uv.x += noisy * fade * scale;
	color *= .05/abs((uv.x));
	// color.rgb *= dot(normalize(vDir), vec3(0,1,0));
	// color.rg = uv;
	// if (color.a < 0.1) discard;
	color.a *= blendFlash;
	gl_FragColor = color;
}