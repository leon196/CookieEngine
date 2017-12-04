
attribute float number;
uniform float time;
uniform vec3 cameraPos;

varying vec2 vUv;
varying vec3 vPos;
varying vec4 vColor;

void main()	{
	vUv = uv;
	vec3 pos = position;
	// pos.x += number;
	float range = 10.;
	float speed = 1. / range;
	float height = .1;
	float width = .2;
	float offset = number * width;

	float ratio = mod(number / 100. + time * speed, 1.);
	pos.z += range * (ratio * 2. - 1.);

	pos.z += number*width;
	pos.y += number;
	pos.y *= height;

	vPos = pos;

	vec3 view = normalize(cameraPos-pos);
	vColor = vec4(1.);
	vColor *= dot(normalize(normal), view)*.5+.5;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.);
}
