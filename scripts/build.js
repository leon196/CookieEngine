'use strict';

const { readdirSync } = require('fs');
const { bundleSFX } = require('jspm');
const { join, resolve } = require('path');
const copyFile = require('quickly-copy-file');
const rimraf = require('rimraf-promise');

const rootPath = resolve(__dirname, '..');
const buildPath = resolve(rootPath, 'dist', 'and-the-crowd-gathered-at-cookie-by-ponk-koltes-fergus');

console.log('Cleaning build directories');
Promise.all([
	rimraf(join(buildPath, '*')),
])
	.then(() => {
		console.log('Copying index');
		return copyFile(join(rootPath, 'browser', 'index-release.html'), join(buildPath, 'index.html'));
	})
	.then(() => {
		console.log('Copying music');
		return copyFile(join(rootPath, 'browser', 'asset', 'music', 'cookie-invitro-2017.ogg'), join(buildPath, 'files', 'music.ogg'));
	})
	.then(() => {
		console.log('Copying static files');
		const staticDirectory = join(rootPath, 'browser', 'static');
		const files = readdirSync(staticDirectory);
		return Promise.all(files.map(file => copyFile(join(staticDirectory, file), join(buildPath, 'files', file))));
	})
	.then(() => {
		console.log('Bundling JSPM app');
		return bundleSFX('app/main-release.js', join(buildPath, 'files', 'demo.js'), {
			minify: false,
		});
	});
