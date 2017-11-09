import * as dat from 'dat.gui/build/dat.gui.js';
import parameters from './parameters';
import uniforms from './uniforms';

export const gui = new dat.gui.GUI();

gui.remember(parameters);

Object.keys(parameters).forEach(keyRoot => {
	var folder = gui.addFolder(keyRoot);

	Object.keys(parameters[keyRoot]).forEach(key => {
		let item = folder.add(parameters[keyRoot], key);
		let name = key.toLowerCase();

		if (name.indexOf('blend') !== -1) {
			item.name(key.slice(5, key.length));
			item.min(0).max(1).step(0.01);
			uniforms[key] = { value: parameters[keyRoot][key] };
		}
	});


	folder.open();
});

// gui.close();
