
uniform vec2 resolution;
uniform sampler2D newFrame;
uniform sampler2D lastFrame;
uniform sampler2D opticalFlow;

varying vec2 vUv;

void main ()
{
	// vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 uv = vUv;
	// uv.y = 1.0 - uv.y;
	vec2 offset = vec2(1.) / resolution;
	vec2 off_x = vec2(offset.x, 0.0);
	vec2 off_y = vec2(0.0, offset.y);
	float lambda = 0.1;
	float threshold = 0.4;
	float force = 1.0;

	//get the difference
	float scr_dif = texture2D(newFrame, uv).r - texture2D(lastFrame, uv).r;

	//calculate the gradient
	float gradx; float grady; float gradmag; float vx; float vy;
	gradx = texture2D(lastFrame, uv + off_x).r - texture2D(lastFrame, uv - off_x).r;
	gradx += texture2D(newFrame, uv + off_x).r - texture2D(newFrame, uv - off_x).r;
	grady = texture2D(lastFrame, uv + off_y).r - texture2D(lastFrame, uv - off_y).r;
	grady += texture2D(newFrame, uv + off_y).r - texture2D(newFrame, uv - off_y).r;

	gradmag = sqrt((gradx*gradx)+(grady*grady)+lambda);
	vx = scr_dif*(gradx/gradmag);
	vy = scr_dif*(grady/gradmag);

	vec2  flow = vec2(0.0, 0.0);
	flow.x = -vx;//(vx.x + vx.y + vx.z) / 3.0;// * inverseX;
	flow.y = -vy;//(vy.x + vy.y + vy.z) / 3.0;// * inverseY;

	// apply treshold
	float strength = length(flow);
	if (strength * threshold > 0.0) {
		if (strength < threshold) {
			flow = vec2(0.0, 0.0);
		}
		else {
			strength = (strength - threshold) / (1.0 - threshold);
			flow = normalize(flow) * strength;
		}
	}

	// apply force
	flow *= force;

	// float angle = atan(flow.y, flow.x);
	// float radius = smoothstep(0.0, 1.0, length(flow));
	// flow.x = (angle / 3.1416) * 0.5 + 0.5;
	// flow.y = radius;

	// flow.x = mix(flow.x, texture2D(opticalFlow, uv).x, 0.9);
	// flow.y += texture2D(opticalFlow, uv).y * 0.99;
	// flow.xy = clamp(flow.xy, 0., 1.);
	flow.xy += texture2D(opticalFlow, uv).xy * 0.99;
	// flow.xy = mix(flow.xy, texture2D(opticalFlow, uv).xy * 0.99, 0.9);

	// vec4 color = vec4(1.);
	// color.r = luminance(texture2D(newFrame, uv).rgb);
	// color.g = luminance(texture2D(lastFrame, uv).rgb);
	// color.b = 0.;
	// gl_FragColor = color;
	gl_FragColor = vec4(flow, 0, 1);
}
