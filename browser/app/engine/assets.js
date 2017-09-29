/* eslint-disable */
/* This file is generated with "npm run assets", do not edit by hand. */
import descriptors from "../../asset/descriptors.json!";
import uniforms from "./uniforms";
import { OBJLoader } from "../libs/OBJLoader";
import { PLYLoader } from "../libs/PLYLoader";
import * as THREE from "three.js";
import shaderHeader from "../../asset/shader/header.glsl!text";
import font_coffee_json from "../../asset/font/coffee.json!text";
import point_branch_obj from "../../asset/point/branch.obj!text";
import point_flash_obj from "../../asset/point/flash.obj!text";
import point_tree_obj from "../../asset/point/tree.obj!text";
import shader_filter_filter_frag from "../../asset/shader/filter/filter.frag!text";
import shader_filter_screen_vert from "../../asset/shader/filter/screen.vert!text";
import shader_pass_position_frag from "../../asset/shader/pass/position.frag!text";
import shader_pass_velocity_frag from "../../asset/shader/pass/velocity.frag!text";
import shader_scene_fire_frag from "../../asset/shader/scene/fire.frag!text";
import shader_scene_fire_vert from "../../asset/shader/scene/fire.vert!text";
import shader_scene_flash_frag from "../../asset/shader/scene/flash.frag!text";
import shader_scene_flash_vert from "../../asset/shader/scene/flash.vert!text";
import shader_scene_label_frag from "../../asset/shader/scene/label.frag!text";
import shader_scene_label_vert from "../../asset/shader/scene/label.vert!text";
import shader_scene_leaf_frag from "../../asset/shader/scene/leaf.frag!text";
import shader_scene_leaf_vert from "../../asset/shader/scene/leaf.vert!text";
import shader_scene_rain_frag from "../../asset/shader/scene/rain.frag!text";
import shader_scene_rain_vert from "../../asset/shader/scene/rain.vert!text";
import shader_scene_smoke_frag from "../../asset/shader/scene/smoke.frag!text";
import shader_scene_smoke_vert from "../../asset/shader/scene/smoke.vert!text";
import shader_scene_snow_frag from "../../asset/shader/scene/snow.frag!text";
import shader_scene_snow_vert from "../../asset/shader/scene/snow.vert!text";
import shader_scene_tree_frag from "../../asset/shader/scene/tree.frag!text";
import shader_scene_tree_vert from "../../asset/shader/scene/tree.vert!text";
import shader_triangle_line_frag from "../../asset/shader/triangle/line.frag!text";
import shader_triangle_line_vert from "../../asset/shader/triangle/line.vert!text";
import shader_triangle_particle_frag from "../../asset/shader/triangle/particle.frag!text";
import shader_triangle_particle_vert from "../../asset/shader/triangle/particle.vert!text";
import shader_triangle_point_frag from "../../asset/shader/triangle/point.frag!text";
import shader_triangle_point_vert from "../../asset/shader/triangle/point.vert!text";
import shader_triangle_text_frag from "../../asset/shader/triangle/text.frag!text";
import shader_triangle_text_vert from "../../asset/shader/triangle/text.vert!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
geometries: {
branch: objLoader.parse(point_branch_obj),
flash: objLoader.parse(point_flash_obj),
tree: objLoader.parse(point_tree_obj),
},
fonts: {
coffee: fontLoader.parse(font_coffee_json),
},
shaderMaterials: {
flash: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.flash, {
vertexShader: shaderHeader + shader_scene_flash_vert,
fragmentShader: shaderHeader + shader_scene_flash_frag,
uniforms: uniforms,
})),
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
label: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.label, {
vertexShader: shaderHeader + shader_scene_label_vert,
fragmentShader: shaderHeader + shader_scene_label_frag,
uniforms: uniforms,
})),
leaf: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.leaf, {
vertexShader: shaderHeader + shader_scene_leaf_vert,
fragmentShader: shaderHeader + shader_scene_leaf_frag,
uniforms: uniforms,
})),
line: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.line, {
vertexShader: shaderHeader + shader_triangle_line_vert,
fragmentShader: shaderHeader + shader_triangle_line_frag,
uniforms: uniforms,
})),
particle: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.particle, {
vertexShader: shaderHeader + shader_triangle_particle_vert,
fragmentShader: shaderHeader + shader_triangle_particle_frag,
uniforms: uniforms,
})),
point: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.point, {
vertexShader: shaderHeader + shader_triangle_point_vert,
fragmentShader: shaderHeader + shader_triangle_point_frag,
uniforms: uniforms,
})),
position: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.position, {
vertexShader: shaderHeader + shader_filter_screen_vert,
fragmentShader: shaderHeader + shader_pass_position_frag,
uniforms: uniforms,
})),
rain: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.rain, {
vertexShader: shaderHeader + shader_scene_rain_vert,
fragmentShader: shaderHeader + shader_scene_rain_frag,
uniforms: uniforms,
})),
smoke: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.smoke, {
vertexShader: shaderHeader + shader_scene_smoke_vert,
fragmentShader: shaderHeader + shader_scene_smoke_frag,
uniforms: uniforms,
})),
snow: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.snow, {
vertexShader: shaderHeader + shader_scene_snow_vert,
fragmentShader: shaderHeader + shader_scene_snow_frag,
uniforms: uniforms,
})),
text: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.text, {
vertexShader: shaderHeader + shader_triangle_text_vert,
fragmentShader: shaderHeader + shader_triangle_text_frag,
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