'use strict';

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
		console.log('Copying files');
		return copyFile(join(rootPath, 'browser', 'index-release.html'), join(buildPath, 'index.html'));
	})
	.then(() => {
		console.log('Bundling JSPM app');
		return bundleSFX('app/main-release.js', join(buildPath, 'index.js'), {
			minify: true,
		});
	});
