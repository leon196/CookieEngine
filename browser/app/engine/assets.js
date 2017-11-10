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
import shader_filters_filter_frag from "../../asset/shader/filters/filter.frag!text";
import shader_filters_raymarching_frag from "../../asset/shader/filters/raymarching.frag!text";
import shader_filters_screen_vert from "../../asset/shader/filters/screen.vert!text";
import shader_meshes_bubble_frag from "../../asset/shader/meshes/bubble.frag!text";
import shader_meshes_bubble_vert from "../../asset/shader/meshes/bubble.vert!text";
import shader_meshes_line_frag from "../../asset/shader/meshes/line.frag!text";
import shader_meshes_line_vert from "../../asset/shader/meshes/line.vert!text";
import shader_meshes_paper_frag from "../../asset/shader/meshes/paper.frag!text";
import shader_meshes_paper_vert from "../../asset/shader/meshes/paper.vert!text";
import shader_meshes_text_frag from "../../asset/shader/meshes/text.frag!text";
import shader_meshes_text_vert from "../../asset/shader/meshes/text.vert!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
},
fonts: {
},
shaderMaterials: {
bubble: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.bubble, {
vertexShader: shaderHeader + shader_meshes_bubble_vert,
fragmentShader: shaderHeader + shader_meshes_bubble_frag,
uniforms: uniforms,
})),
raymarching: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.raymarching, {
vertexShader: shaderHeader + shader_filters_screen_vert,
fragmentShader: shaderHeader + shader_filters_raymarching_frag,
uniforms: uniforms,
})),
paper: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.paper, {
vertexShader: shaderHeader + shader_meshes_paper_vert,
fragmentShader: shaderHeader + shader_meshes_paper_frag,
uniforms: uniforms,
})),
line: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.line, {
vertexShader: shaderHeader + shader_meshes_line_vert,
fragmentShader: shaderHeader + shader_meshes_line_frag,
uniforms: uniforms,
})),
text: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.text, {
vertexShader: shaderHeader + shader_meshes_text_vert,
fragmentShader: shaderHeader + shader_meshes_text_frag,
uniforms: uniforms,
})),
filter: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.filter, {
vertexShader: shaderHeader + shader_filters_screen_vert,
fragmentShader: shaderHeader + shader_filters_filter_frag,
uniforms: uniforms,
})),
},
load: function(callback) { return callback(); }
};