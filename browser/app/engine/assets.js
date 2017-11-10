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
import shader_filter_buffer_frag from "../../asset/shader/filter/buffer.frag!text";
import shader_filter_filter_frag from "../../asset/shader/filter/filter.frag!text";
import shader_filter_raymarching_frag from "../../asset/shader/filter/raymarching.frag!text";
import shader_filter_screen_vert from "../../asset/shader/filter/screen.vert!text";
import shader_lab_feather_frag from "../../asset/shader/lab/feather.frag!text";
import shader_lab_feather_vert from "../../asset/shader/lab/feather.vert!text";
import shader_lab_lines_frag from "../../asset/shader/lab/lines.frag!text";
import shader_lab_lines_vert from "../../asset/shader/lab/lines.vert!text";
import shader_lab_paint_frag from "../../asset/shader/lab/paint.frag!text";
import shader_lab_paint_vert from "../../asset/shader/lab/paint.vert!text";
import shader_lab_paper_frag from "../../asset/shader/lab/paper.frag!text";
import shader_lab_paper_vert from "../../asset/shader/lab/paper.vert!text";
import shader_lab_sprite_frag from "../../asset/shader/lab/sprite.frag!text";
import shader_lab_sprite_vert from "../../asset/shader/lab/sprite.vert!text";
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
import shader_triangle_simple_frag from "../../asset/shader/triangle/simple.frag!text";
import shader_triangle_simple_vert from "../../asset/shader/triangle/simple.vert!text";
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
simple: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.simple, {
vertexShader: shaderHeader + shader_triangle_simple_vert,
fragmentShader: shaderHeader + shader_triangle_simple_frag,
uniforms: uniforms,
})),
paper: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.paper, {
vertexShader: shaderHeader + shader_lab_paper_vert,
fragmentShader: shaderHeader + shader_lab_paper_frag,
uniforms: uniforms,
})),
lines: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.lines, {
vertexShader: shaderHeader + shader_lab_lines_vert,
fragmentShader: shaderHeader + shader_lab_lines_frag,
uniforms: uniforms,
})),
feather: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.feather, {
vertexShader: shaderHeader + shader_lab_feather_vert,
fragmentShader: shaderHeader + shader_lab_feather_frag,
uniforms: uniforms,
})),
paint: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.paint, {
vertexShader: shaderHeader + shader_lab_paint_vert,
fragmentShader: shaderHeader + shader_lab_paint_frag,
uniforms: uniforms,
})),
sprite: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.sprite, {
vertexShader: shaderHeader + shader_lab_sprite_vert,
fragmentShader: shaderHeader + shader_lab_sprite_frag,
uniforms: uniforms,
})),
filter: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.filter, {
vertexShader: shaderHeader + shader_filter_screen_vert,
fragmentShader: shaderHeader + shader_filter_filter_frag,
uniforms: uniforms,
})),
buffer: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.buffer, {
vertexShader: shaderHeader + shader_filter_screen_vert,
fragmentShader: shaderHeader + shader_filter_buffer_frag,
uniforms: uniforms,
})),
raymarching: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.raymarching, {
vertexShader: shaderHeader + shader_filter_screen_vert,
fragmentShader: shaderHeader + shader_filter_raymarching_frag,
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