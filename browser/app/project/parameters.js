export default {
	Scene: {
		CurvedMesh: true,
		LineMesh: false,
		PointCloud: false,
		Ribbon: false,
		Sprite: false,
		Snow: false,
		Grid: false,
	},
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
};
