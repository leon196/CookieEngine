
uniform sampler2D jonathanTexture;
uniform float joOpacity;

uniform float time;
varying vec2 vUv;
varying vec3 vPos;

void main()	{
	// float margin = .9;
	// if (fract(length(vPos)*10.+time) > margin) discard;
	// if (fract(atan(vPos.z,vPos.x)*PI*10.+time) > margin) discard;
	vec4 color = texture2D(jonathanTexture, vUv);
	// color.a *= joOpacity;
	gl_FragColor = color;
}
