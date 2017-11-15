
uniform vec2 resolution;
uniform sampler2D newFrame;
uniform sampler2D lastFrame;
uniform sampler2D opticalFlow;
uniform float OpticalFlowLambda;
uniform float OpticalFlowThreshold;
uniform float OpticalFlowForce;
uniform float OpticalFlowBlend;

varying vec2 vUv;

void main ()
{
	vec2 uv = vUv;
	vec2 offset = vec2(1.) / resolution;
	vec2 off_x = vec2(offset.x, 0.0);
	vec2 off_y = vec2(0.0, offset.y);

	//get the difference
	float scr_dif = texture2D(newFrame, uv).r - texture2D(lastFrame, uv).r;

	//calculate the gradient
	vec3 gradx; vec3 grady; vec3 gradmag; vec3 vx; vec3 vy;
	gradx = texture2D(lastFrame, uv + off_x).rgb - texture2D(lastFrame, uv - off_x).rgb;
	gradx += texture2D(newFrame, uv + off_x).rgb - texture2D(newFrame, uv - off_x).rgb;
	grady = texture2D(lastFrame, uv + off_y).rgb - texture2D(lastFrame, uv - off_y).rgb;
	grady += texture2D(newFrame, uv + off_y).rgb - texture2D(newFrame, uv - off_y).rgb;

	gradmag = sqrt((gradx*gradx)+(grady*grady)+OpticalFlowLambda);
	vx = scr_dif*(gradx/gradmag);
	vy = scr_dif*(grady/gradmag);

	vec2  flow = vec2(0.0, 0.0);
	flow.x = (vx.x + vx.y + vx.z) / 3.0;
	flow.y = (vy.x + vy.y + vy.z) / 3.0;

	float strength = length(flow);
	if (strength * OpticalFlowThreshold > 0.0) {
		if (strength < OpticalFlowThreshold) {
			flow = vec2(0.0, 0.0);
		}
		else {
			strength = (strength - OpticalFlowThreshold) / (1.0 - OpticalFlowThreshold);
			flow = normalize(flow) * strength;
		}
	}

	flow *= OpticalFlowForce;
	// flow.xy = mix(flow.xy, texture2D(opticalFlow, uv).xy, OpticalFlowBlend);
	flow.xy += texture2D(opticalFlow, uv).xy * OpticalFlowBlend;
	gl_FragColor = vec4(flow, 0, 1);
}
