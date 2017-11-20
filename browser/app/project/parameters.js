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
		SpriteSize: 1.15,
		VelocitySpeed: .51,
		VelocityTargetBlend: -.26,
		VelocityOriginBlend: .1,
		VelocityNoiseBlend: .5,
		VelocityTornadoBlend: .35,
		VelocityDirectionBlend: .1,
		VelocityDamping: .1,
		SpriteVelocityStretch: .1,
		TurbulenceRangeMin: .1,
		TurbulenceRangeMax: .8,
		NoiseScale: .08,
		NoiseSpeed: 1.,
	}
};
