import blenderHTML5Animations from 'blender-html5-animations/js/dist/blender-html5-animations.js';

export default function (actionDescriptors) {
	const actions = new blenderHTML5Animations.ActionLibrary(actionDescriptors);

	function evaluate(matrix, actionName, time) {
		return actions[actionName].toWorld(matrix.elements, time, blenderHTML5Animations.Action.RotationMode.EULER_XYZ);
	}

	function getPosition(actionName, time) {
		let position = actions[actionName].paths['location'].evaluate(time, blenderHTML5Animations.FCurveArray.DefaultValues.LOCATION);
		position = [-position[0], position[2], position[1]];
		return position;
	}

	function getRotation(actionName, time) {
		return actions[actionName].paths['rotation_euler'].evaluate(time, blenderHTML5Animations.FCurveArray.DefaultValues.ROTATION);
	}

	function getValue(actionName, time) {
		if (actions[actionName] !== undefined) {
			var pos = actions[actionName].paths['location'].evaluate(time, blenderHTML5Animations.FCurveArray.DefaultValues.LOCATION);
			return pos[2];
		} else {
			console.log(actionName + ' not foud');
			return 0.;
		}
	}

	return {
		actions,
		evaluate,
		getPosition,
		getRotation,
		getValue,
	};
}
