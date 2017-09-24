// from Greggman
// https://raw.githubusercontent.com/greggman/three-load-shaders/master/load.js

function loadFile (url, callback)
{
	var request = new XMLHttpRequest();
	if (request.overrideMimeType) {
		request.overrideMimeType("text/plain");
	}

	function handleLoad() {
		return callback(null, request.responseText);
	}

	function handleError(e) {
		return callback(e);
	}

	// request.open("get", url, true);
	request.open("get", url + "?t=" + (new Date()).getTime(), true);
	request.addEventListener("load", handleLoad, false);
	request.addEventListener("error", handleError, false);
	request.send();
}

function loadFiles (files, callback, callbackProgress) {
	var numToLoad = 0;
	var loadedFiles = {};

	if (callbackProgress) {
		callbackProgress(0);
	}

	function callbackOnce(err, content) {
		if (callback) {
			var cb = callback;
			callback = undefined;
			return cb(err, content);
		}
	}

	files.forEach(function(file) {
		++numToLoad;
		return loadFile(file, function(err, content) {
			if (err) {
				// make sure we only call this once!
				return callbackOnce(err);
			}
			loadedFiles[file] = content;
			--numToLoad;
			if (callbackProgress) {
				callbackProgress(1 - numToLoad / files.length);
			}
			if (numToLoad == 0) {
				callbackOnce(null, loadedFiles);
			}
		});
	});
}