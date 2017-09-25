
// vec4 displace (vec4 pos, float time)
// {
// 	float wave = sin(time + pos.x) * .5 + .5;
// 	wave = noiseIQ(pos.xyz * .4 + time);
// 	// pos.y += wave;
// 	return pos;
// }

// vec4 layer (vec4 pos, vec2 resolution, float index)
// {
// 	vec2 aspect = vec2(resolution.y/resolution.x, 1.);
// 	pos.x = pos.x * aspect.x;
// 	pos.y = pos.y * aspect.y;
// 	pos.z = index;
// 	return pos;
// }