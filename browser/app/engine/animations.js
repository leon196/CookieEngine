import actionDescriptors from '../../asset/src/animations/icicles';
// import actionDescriptors from '../../asset/animation/scene.json!json';
import blenderHTML5Animations from 'blender-html5-animations/js/dist/blender-html5-animations.js';

const actions = new blenderHTML5Animations.ActionLibrary(actionDescriptors);

function evaluate(matrix, actionName, time) {
	return actions[actionName].toWorld(matrix.elements, time, blenderHTML5Animations.Action.RotationMode.EULER_XYZ);
}

function getValue(actionName, time) {
	var pos = actions[actionName].paths['location'].evaluate(time, blenderHTML5Animations.FCurveArray.DefaultValues.LOCATION);
	return pos[2];
}

export default {
	actions,
	evaluate,
	getValue,
};
