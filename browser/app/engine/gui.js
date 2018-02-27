import * as dat from 'dat.gui/build/dat.gui.js';
import parameters from './parameters';

export const gui = new dat.gui.GUI();

gui.addUniforms = function (name, parameters, uniforms) {
	var folder = gui.addFolder(name);
	Object.keys(parameters).forEach(key => {
		var param = parameters[key];
		var type = typeof(param);
		if (type == 'number') {
			var item = folder.add(parameters, key);
			item.step(0.01);
			uniforms[key] = { value: param };
		} else if (type == 'function') {
			folder.add(parameters, key);
		} else if (type == 'object') {
			if (param.length && param.length == 3) {
				uniforms[key] = { value: [param[0]/255,param[1]/255,param[2]/255] };
				folder.addColor(parameters, key);
			}
		}
	});
}

gui.updateUniforms = function (parameters, uniforms) {
	Object.keys(parameters).forEach(key => {
		var param = parameters[key];
		var type = typeof(param);
		if (type == 'number') {
			uniforms[key].value = param;
		} else if (type == 'object') {
			if (param.length && param.length == 3) {
				for (var c = 0; c < 3; ++c) uniforms[key].value[c] = param[c]/255;
			}
		}
	});
}