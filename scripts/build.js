'use strict';

const { readdirSync } = require('fs');
const { bundleSFX } = require('jspm');
const { join, resolve } = require('path');
const copyFile = require('quickly-copy-file');
const rimraf = require('rimraf-promise');

const rootPath = resolve(__dirname, '..');
const buildPath = resolve(rootPath, 'dist', 'invitro-cookie-2017');

console.log('Cleaning build directories');
Promise.all([
	rimraf(join(buildPath, '*')),
])
	.then(() => {
		console.log('Copying index');
		return copyFile(join(rootPath, 'browser', 'index-release.html'), join(buildPath, 'index.html'));
	})
	.then(() => {
		console.log('Copying static files');
		const staticDirectory = join(rootPath, 'browser', 'static');
		const files = readdirSync(staticDirectory);
		return Promise.all(files.map(file => copyFile(join(staticDirectory, file), join(buildPath, 'static', file))));
	})
	.then(() => {
		console.log('Bundling JSPM app');
		return bundleSFX('app/main-release.js', join(buildPath, 'index.js'), {
			minify: false,
		});
	});
