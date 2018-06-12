import * as dat from 'dat.gui/build/dat.gui.js';
import parameters from './parameters';

export var gui = {};

gui.gone = false;
gui.go = function() {
 	gui = new dat.gui.GUI();
	gui.remember(parameters);
	Object.keys(parameters).forEach(keyRoot => {
		var folder = gui.addFolder(keyRoot);
		var keys = Object.keys(parameters[keyRoot]);
		if (keys.length > 0) {
			keys.forEach(key => {
				const param = parameters[keyRoot][key];
				const item = folder.add(parameters[keyRoot], key).listen();
				const type = typeof(param);
				if (type == 'number') {
					item.step(0.01);
				}
				if (param == 0.) {
					item.min(0).max(1);
				}
			});
		} else {
		}
		folder.open();
	});
	// gui.close();
	gui.gone = true;
}