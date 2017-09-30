/* eslint-disable */
/* This file is generated with "npm run assets", do not edit by hand. */
import descriptors from "../../asset/descriptors.json!";
import uniforms from "./uniforms";
import { OBJLoader } from "../libs/OBJLoader";
import { PLYLoader } from "../libs/PLYLoader";
import * as THREE from "three.js";
import shaderHeader from "../../asset/shader/header.glsl!text";
import point_root_obj from "../../asset/point/root.obj!text";
import point_tree_obj from "../../asset/point/tree.obj!text";
import shader_filter_filter_frag from "../../asset/shader/filter/filter.frag!text";
import shader_filter_screen_vert from "../../asset/shader/filter/screen.vert!text";
import shader_pass_position_frag from "../../asset/shader/pass/position.frag!text";
import shader_pass_velocity_frag from "../../asset/shader/pass/velocity.frag!text";
import shader_scene_fire_frag from "../../asset/shader/scene/fire.frag!text";
import shader_scene_fire_vert from "../../asset/shader/scene/fire.vert!text";
import shader_scene_leaf_frag from "../../asset/shader/scene/leaf.frag!text";
import shader_scene_leaf_vert from "../../asset/shader/scene/leaf.vert!text";
import shader_scene_snow_frag from "../../asset/shader/scene/snow.frag!text";
import shader_scene_snow_vert from "../../asset/shader/scene/snow.vert!text";
import shader_scene_tree_frag from "../../asset/shader/scene/tree.frag!text";
import shader_scene_tree_vert from "../../asset/shader/scene/tree.vert!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
geometries: {
tree: objLoader.parse(point_tree_obj),
root: objLoader.parse(point_root_obj),
},
fonts: {
},
shaderMaterials: {
filter: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.filter, {
vertexShader: shaderHeader + shader_filter_screen_vert,
fragmentShader: shaderHeader + shader_filter_filter_frag,
uniforms: uniforms,
})),
fire: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.fire, {
vertexShader: shaderHeader + shader_scene_fire_vert,
fragmentShader: shaderHeader + shader_scene_fire_frag,
uniforms: uniforms,
})),
leaf: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.leaf, {
vertexShader: shaderHeader + shader_scene_leaf_vert,
fragmentShader: shaderHeader + shader_scene_leaf_frag,
uniforms: uniforms,
})),
position: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.position, {
vertexShader: shaderHeader + shader_filter_screen_vert,
fragmentShader: shaderHeader + shader_pass_position_frag,
uniforms: uniforms,
})),
snow: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.snow, {
vertexShader: shaderHeader + shader_scene_snow_vert,
fragmentShader: shaderHeader + shader_scene_snow_frag,
uniforms: uniforms,
})),
tree: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.tree, {
vertexShader: shaderHeader + shader_scene_tree_vert,
fragmentShader: shaderHeader + shader_scene_tree_frag,
uniforms: uniforms,
})),
velocity: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.velocity, {
vertexShader: shaderHeader + shader_filter_screen_vert,
fragmentShader: shaderHeader + shader_pass_velocity_frag,
uniforms: uniforms,
})),
},
load: function(callback) { return callback(); }
};