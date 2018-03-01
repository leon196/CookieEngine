import * as dat from 'dat.gui/build/dat.gui.js';
import parameters from './parameters';

export const gui = new dat.gui.GUI();

gui.addUniforms = function (folder, name, parameters, uniforms) {
	var subfolder = folder.addFolder(name);
	Object.keys(parameters).forEach(key => {
		gui.addParameter(subfolder, parameters, key);
		gui.addUniform(uniforms, key, parameters, key);
	});
}

gui.addParameter = function (folder, parameters, key) {
	var param = parameters[key];
	var type = typeof(param);
	if (type == 'number') {
		folder.add(parameters, key).step(0.01);
	} else if (type == 'object') {
		if (param.length && param.length == 3) {
			folder.addColor(parameters, key);
		} else if (Object.keys(param).length > 0) {
			var subFolder = folder.addFolder(key);
			Object.keys(param).forEach(subkey => {
				gui.addParameter(subFolder, param, subkey);
			});
		}
	}
}

gui.addUniform = function (uniforms, unikey, parameters, paramkey) {
	var param = parameters[paramkey];
	var type = typeof(param);
	if (type == 'number') {
		uniforms[unikey] = { value: param };
	} else if (type == 'object') {
		if (param.length && param.length == 3) {
			uniforms[unikey] = { value: [param[0]/255,param[1]/255,param[2]/255] };
		} else if (Object.keys(param).length > 0) {
			Object.keys(param).forEach(subkey => {
				var newunikey = paramkey + subkey[0].toUpperCase() + subkey.substring(1, subkey.length);
				gui.addUniform(uniforms, newunikey, param, subkey);
			});
		}
	}
}

gui.updateUniforms = function (parameters, uniforms) {
	Object.keys(parameters).forEach(key => {
		gui.updateUniform(parameters, key, uniforms, key);
	});
}

gui.updateUniform = function (parameters, key, uniforms, unikey) {
	var param = parameters[key];
	var type = typeof(param);
	if (type == 'number') {
		uniforms[unikey].value = param;
	} else if (type == 'object') {
		if (param.length && param.length == 3) {
			for (var c = 0; c < 3; ++c) uniforms[unikey].value[c] = param[c]/255;
		} else if (Object.keys(param).length > 0) {
			Object.keys(param).forEach(subkey => {
				var newunikey = key + subkey[0].toUpperCase() + subkey.substring(1, subkey.length);
				gui.updateUniform(param, subkey, uniforms, newunikey);
			});
		}
	}
}