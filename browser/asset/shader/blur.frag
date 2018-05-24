
uniform sampler2D passScene, passEdge;
uniform vec2 resolution;
varying vec2 vUv;

// mrharicot
// https://www.shadertoy.com/view/XdfGDH
vec4 blur2 (sampler2D bitmap, vec2 uv, vec2 dimension)
{
	//declare stuff
	const int mSize = 9;
	const int kSize = (mSize-1)/2;
	float kernel[mSize];
	vec4 final_colour = vec4(0.0);
	
	//create the 1-D kernel
	float sigma = 7.0;
	float Z = 0.0;
	for (int j = 0; j <= kSize; ++j)
	{
		kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
	}
	
	//get the normalization factor (as the gaussian has been clamped)
	for (int j = 0; j < mSize; ++j)
	{
		Z += kernel[j];
	}
	
	//read out the texels
	for (int i=-kSize; i <= kSize; ++i)
	{
		for (int j=-kSize; j <= kSize; ++j)
		{
			final_colour += kernel[kSize+j]*kernel[kSize+i]*texture2D(bitmap, uv.xy+vec2(float(i),float(j)) / dimension.xy);

		}
	}
	
	return final_colour/(Z*Z);
}

void main () {
	vec4 color = texture2D(passEdge, vUv);
	vec4 blur = blur2(passEdge, vUv, resolution);
	// float offset = -1.;
	// float scale = .5;
	// float dof = saturate(smoothstep(0., 1., abs(color.a+offset)*scale));
	// color = mix(color, blur, dof);
	gl_FragColor = blur;
}