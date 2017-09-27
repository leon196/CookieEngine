import actionDescriptors from '../../asset/animation/scene.json!json';
import blenderHTML5Animations from 'blender-html5-animations/js/dist/blender-html5-animations.js';

const actions = new blenderHTML5Animations.ActionLibrary(actionDescriptors);

function evaluate(matrix, actionName, time) {
	return actions[actionName].toWorld(matrix.elements, time, blenderHTML5Animations.Action.RotationMode.EULER_XYZ);
}

export default {
	actions,
	evaluate,
};
