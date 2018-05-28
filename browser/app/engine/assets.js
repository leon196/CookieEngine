/* eslint-disable */
/* This file is generated with "npm run assets", do not edit by hand. */
import descriptors from "../../asset/descriptors.json!";
import makeAnimations from "./make-animations";
import uniforms from "./uniforms";
import { OBJLoader } from "../libs/OBJLoader";
import { PLYLoader } from "../libs/PLYLoader";
import * as THREE from "three.js";
import shaderHeader from "../../asset/shader/header.glsl!text";
import animation_scene_json from "../../asset/animation/scene.json!text";
import mesh_tree_obj from "../../asset/mesh/tree.obj!text";
import shader_bloom_bloom_frag from "../../asset/shader/bloom/bloom.frag!text";
import shader_bloom_bloom_vert from "../../asset/shader/bloom/bloom.vert!text";
import shader_bloom_bright_frag from "../../asset/shader/bloom/bright.frag!text";
import shader_bloom_bright_vert from "../../asset/shader/bloom/bright.vert!text";
import shader_bloom_gaussian_blur_frag from "../../asset/shader/bloom/gaussian_blur.frag!text";
import shader_bloom_gaussian_blur_vert from "../../asset/shader/bloom/gaussian_blur.vert!text";
import shader_blur_frag from "../../asset/shader/blur.frag!text";
import shader_droplet_frag from "../../asset/shader/droplet.frag!text";
import shader_droplet_vert from "../../asset/shader/droplet.vert!text";
import shader_edge_frag from "../../asset/shader/edge.frag!text";
import shader_froot_frag from "../../asset/shader/froot.frag!text";
import shader_froot_vert from "../../asset/shader/froot.vert!text";
import shader_grass_frag from "../../asset/shader/grass.frag!text";
import shader_grass_vert from "../../asset/shader/grass.vert!text";
import shader_ground_frag from "../../asset/shader/ground.frag!text";
import shader_ground_vert from "../../asset/shader/ground.vert!text";
import shader_heightmap_frag from "../../asset/shader/heightmap.frag!text";
import shader_heightmap_vert from "../../asset/shader/heightmap.vert!text";
import shader_leaves_frag from "../../asset/shader/leaves.frag!text";
import shader_leaves_vert from "../../asset/shader/leaves.vert!text";
import shader_moon_frag from "../../asset/shader/moon.frag!text";
import shader_moon_vert from "../../asset/shader/moon.vert!text";
import shader_postprocess_frag from "../../asset/shader/postprocess.frag!text";
import shader_postprocess_vert from "../../asset/shader/postprocess.vert!text";
import shader_rain_frag from "../../asset/shader/rain.frag!text";
import shader_rain_vert from "../../asset/shader/rain.vert!text";
import shader_sky_frag from "../../asset/shader/sky.frag!text";
import shader_sky_vert from "../../asset/shader/sky.vert!text";
import shader_star_frag from "../../asset/shader/star.frag!text";
import shader_star_vert from "../../asset/shader/star.vert!text";
import shader_sun_frag from "../../asset/shader/sun.frag!text";
import shader_sun_vert from "../../asset/shader/sun.vert!text";
import shader_tree_frag from "../../asset/shader/tree.frag!text";
import shader_tree_vert from "../../asset/shader/tree.vert!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
tree: objLoader.parse(mesh_tree_obj),
},
fonts: {
},
shaders: {
tree: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.tree, {
vertexShader: shaderHeader + shader_tree_vert,
fragmentShader: shaderHeader + shader_tree_frag,
uniforms: uniforms,
})),
ground: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.ground, {
vertexShader: shaderHeader + shader_ground_vert,
fragmentShader: shaderHeader + shader_ground_frag,
uniforms: uniforms,
})),
sky: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.sky, {
vertexShader: shaderHeader + shader_sky_vert,
fragmentShader: shaderHeader + shader_sky_frag,
uniforms: uniforms,
})),
moon: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.moon, {
vertexShader: shaderHeader + shader_moon_vert,
fragmentShader: shaderHeader + shader_moon_frag,
uniforms: uniforms,
})),
sun: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.sun, {
vertexShader: shaderHeader + shader_sun_vert,
fragmentShader: shaderHeader + shader_sun_frag,
uniforms: uniforms,
})),
star: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.star, {
vertexShader: shaderHeader + shader_star_vert,
fragmentShader: shaderHeader + shader_star_frag,
uniforms: uniforms,
})),
leaves: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.leaves, {
vertexShader: shaderHeader + shader_leaves_vert,
fragmentShader: shaderHeader + shader_leaves_frag,
uniforms: uniforms,
})),
froot: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.froot, {
vertexShader: shaderHeader + shader_froot_vert,
fragmentShader: shaderHeader + shader_froot_frag,
uniforms: uniforms,
})),
grass: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.grass, {
vertexShader: shaderHeader + shader_grass_vert,
fragmentShader: shaderHeader + shader_grass_frag,
uniforms: uniforms,
})),
rain: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.rain, {
vertexShader: shaderHeader + shader_rain_vert,
fragmentShader: shaderHeader + shader_rain_frag,
uniforms: uniforms,
})),
droplet: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.droplet, {
vertexShader: shaderHeader + shader_droplet_vert,
fragmentShader: shaderHeader + shader_droplet_frag,
uniforms: uniforms,
})),
heightmap: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.heightmap, {
vertexShader: shaderHeader + shader_heightmap_vert,
fragmentShader: shaderHeader + shader_heightmap_frag,
uniforms: uniforms,
})),
postprocess: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.postprocess, {
vertexShader: shaderHeader + shader_postprocess_vert,
fragmentShader: shaderHeader + shader_postprocess_frag,
uniforms: uniforms,
})),
blur: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.blur, {
vertexShader: shaderHeader + shader_postprocess_vert,
fragmentShader: shaderHeader + shader_blur_frag,
uniforms: uniforms,
})),
edge: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.edge, {
vertexShader: shaderHeader + shader_postprocess_vert,
fragmentShader: shaderHeader + shader_edge_frag,
uniforms: uniforms,
})),
bloom: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.bloom, {
vertexShader: shaderHeader + shader_bloom_bloom_vert,
fragmentShader: shaderHeader + shader_bloom_bloom_frag,
uniforms: uniforms,
})),
bright: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.bright, {
vertexShader: shaderHeader + shader_bloom_bright_vert,
fragmentShader: shaderHeader + shader_bloom_bright_frag,
uniforms: uniforms,
})),
gaussianBlur: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.gaussianBlur, {
vertexShader: shaderHeader + shader_bloom_gaussian_blur_vert,
fragmentShader: shaderHeader + shader_bloom_gaussian_blur_frag,
uniforms: uniforms,
})),
},
load: function(callback) { return callback(); }
};