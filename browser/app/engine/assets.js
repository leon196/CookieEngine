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
import shader_mesh_frag from "../../asset/shader/mesh.frag!text";
import shader_mesh_vert from "../../asset/shader/mesh.vert!text";
import shader_plant_frag from "../../asset/shader/plant.frag!text";
import shader_plant_vert from "../../asset/shader/plant.vert!text";
import shader_seed_frag from "../../asset/shader/seed.frag!text";
import shader_seed_vert from "../../asset/shader/seed.vert!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
},
fonts: {
},
shaders: {
mesh: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.mesh, {
vertexShader: shaderHeader + shader_mesh_vert,
fragmentShader: shaderHeader + shader_mesh_frag,
uniforms: uniforms,
})),
plant: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.plant, {
vertexShader: shaderHeader + shader_plant_vert,
fragmentShader: shaderHeader + shader_plant_frag,
uniforms: uniforms,
})),
seed: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.seed, {
vertexShader: shaderHeader + shader_seed_vert,
fragmentShader: shaderHeader + shader_seed_frag,
uniforms: uniforms,
})),
},
load: function(callback) { return callback(); }
};