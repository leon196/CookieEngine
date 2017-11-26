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
import font_coffee_json from "../../asset/font/coffee.json!text";
import mesh_Cookie_obj from "../../asset/mesh/Cookie.obj!text";
import mesh_jonathan_obj from "../../asset/mesh/jonathan.obj!text";
import mesh_plantPoints_ply from "../../asset/mesh/plantPoints.ply!text";
import mesh_title_obj from "../../asset/mesh/title.obj!text";
import mesh_treeCurves_obj from "../../asset/mesh/treeCurves.obj!text";
import shader_generic_circle_frag from "../../asset/shader/generic/circle.frag!text";
import shader_generic_screen_vert from "../../asset/shader/generic/screen.vert!text";
import shader_project_filters_render_frag from "../../asset/shader/project/filters/render.frag!text";
import shader_project_meshes_cookie_frag from "../../asset/shader/project/meshes/cookie.frag!text";
import shader_project_meshes_cookie_vert from "../../asset/shader/project/meshes/cookie.vert!text";
import shader_project_meshes_text_frag from "../../asset/shader/project/meshes/text.frag!text";
import shader_project_meshes_text_vert from "../../asset/shader/project/meshes/text.vert!text";
import shader_project_particles_firePosition_frag from "../../asset/shader/project/particles/firePosition.frag!text";
import shader_project_particles_fireVelocity_frag from "../../asset/shader/project/particles/fireVelocity.frag!text";
import shader_project_particles_fire_vert from "../../asset/shader/project/particles/fire.vert!text";
import shader_project_raymarch_rooms_frag from "../../asset/shader/project/raymarch/rooms.frag!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
treeCurves: objLoader.parse(mesh_treeCurves_obj),
jonathan: objLoader.parse(mesh_jonathan_obj),
plantPoints: plyLoader.parse(mesh_plantPoints_ply),
cookie: objLoader.parse(mesh_Cookie_obj),
title: objLoader.parse(mesh_title_obj),
},
fonts: {
coffee: fontLoader.parse(font_coffee_json),
},
shaders: {
raymarchRooms: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.raymarchRooms, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_raymarch_rooms_frag,
uniforms: uniforms,
})),
cookie: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.cookie, {
vertexShader: shaderHeader + shader_project_meshes_cookie_vert,
fragmentShader: shaderHeader + shader_project_meshes_cookie_frag,
uniforms: uniforms,
})),
render: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.render, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_filters_render_frag,
uniforms: uniforms,
})),
lines: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.lines, {
vertexShader: shaderHeader + shader_project_particles_fire_vert,
fragmentShader: shaderHeader + shader_generic_circle_frag,
uniforms: uniforms,
})),
fire: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.fire, {
vertexShader: shaderHeader + shader_project_particles_fire_vert,
fragmentShader: shaderHeader + shader_generic_circle_frag,
uniforms: uniforms,
})),
firePosition: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.firePosition, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_particles_firePosition_frag,
uniforms: uniforms,
})),
fireVelocity: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.fireVelocity, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_particles_fireVelocity_frag,
uniforms: uniforms,
})),
text: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.text, {
vertexShader: shaderHeader + shader_project_meshes_text_vert,
fragmentShader: shaderHeader + shader_project_meshes_text_frag,
uniforms: uniforms,
})),
},
load: function(callback) { return callback(); }
};