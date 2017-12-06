export default {
	Filter: {
		Glitch: 0.,
		Pixel: 1.,
		Feedback: .9,
	},
	OpticalFlow: {
		Enabled: true,
		Lambda: 0.1,
		Threshold: 0.01,
		Force: 1.,
		Blend: .9,
	},
	CurvedMesh: {
		Twist: .5,
		Speed: 2.,
		Radius: 2.,
		Height: 1.254,
		Range: 25.,
  	Offset: 8.3,
	},
	Fire: {
		SpriteSize: .04,
		VelocitySpeed: .06,
		VelocityTargetBlend: 0,
		VelocityOriginBlend: 0,
		VelocityNoiseBlend: .12,
		VelocityTornadoBlend: .0,
		VelocityDirectionBlend: .1,
		VelocityDamping: .1,
		SpriteVelocityStretch: 200,
		TurbulenceRangeMin: .1,
		TurbulenceRangeMax: .8,
		NoiseScale: 1.1,
		NoiseSpeed: 1.,
	}
};
