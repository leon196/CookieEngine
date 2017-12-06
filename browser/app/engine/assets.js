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
import mesh_paper_obj from "../../asset/mesh/paper.obj!text";
import mesh_skullFlat_ply from "../../asset/mesh/skullFlat.ply!text";
import shader_generic_circle_frag from "../../asset/shader/generic/circle.frag!text";
import shader_generic_screen_vert from "../../asset/shader/generic/screen.vert!text";
import shader_project_datas_firePosition_frag from "../../asset/shader/project/datas/firePosition.frag!text";
import shader_project_datas_fireVelocity_frag from "../../asset/shader/project/datas/fireVelocity.frag!text";
import shader_project_filters_render_frag from "../../asset/shader/project/filters/render.frag!text";
import shader_project_meshes_building_frag from "../../asset/shader/project/meshes/building.frag!text";
import shader_project_meshes_building_vert from "../../asset/shader/project/meshes/building.vert!text";
import shader_project_meshes_cookie_frag from "../../asset/shader/project/meshes/cookie.frag!text";
import shader_project_meshes_cookie_vert from "../../asset/shader/project/meshes/cookie.vert!text";
import shader_project_meshes_paperSimple_frag from "../../asset/shader/project/meshes/paperSimple.frag!text";
import shader_project_meshes_paperSimple_vert from "../../asset/shader/project/meshes/paperSimple.vert!text";
import shader_project_meshes_skull_frag from "../../asset/shader/project/meshes/skull.frag!text";
import shader_project_meshes_skull_vert from "../../asset/shader/project/meshes/skull.vert!text";
import shader_project_meshes_text_frag from "../../asset/shader/project/meshes/text.frag!text";
import shader_project_meshes_text_vert from "../../asset/shader/project/meshes/text.vert!text";
import shader_project_particles_fire_vert from "../../asset/shader/project/particles/fire.vert!text";
import shader_project_particles_paper_frag from "../../asset/shader/project/particles/paper.frag!text";
import shader_project_particles_paper_vert from "../../asset/shader/project/particles/paper.vert!text";
import shader_project_raymarch_lab_frag from "../../asset/shader/project/raymarch/lab.frag!text";
import shader_project_raymarch_rooms_frag from "../../asset/shader/project/raymarch/rooms.frag!text";
import shader_project_raymarch_stairs_frag from "../../asset/shader/project/raymarch/stairs.frag!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
skull: plyLoader.parse(mesh_skullFlat_ply),
paper: objLoader.parse(mesh_paper_obj),
},
fonts: {
},
shaders: {
skull: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.skull, {
vertexShader: shaderHeader + shader_project_meshes_skull_vert,
fragmentShader: shaderHeader + shader_project_meshes_skull_frag,
uniforms: uniforms,
})),
paperSimple: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.paperSimple, {
vertexShader: shaderHeader + shader_project_meshes_paperSimple_vert,
fragmentShader: shaderHeader + shader_project_meshes_paperSimple_frag,
uniforms: uniforms,
})),
building: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.building, {
vertexShader: shaderHeader + shader_project_meshes_building_vert,
fragmentShader: shaderHeader + shader_project_meshes_building_frag,
uniforms: uniforms,
})),
raymarchLab: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.raymarchLab, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_raymarch_lab_frag,
uniforms: uniforms,
})),
raymarchRooms: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.raymarchRooms, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_raymarch_rooms_frag,
uniforms: uniforms,
})),
raymarchStairs: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.raymarchStairs, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_raymarch_stairs_frag,
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
paper: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.paper, {
vertexShader: shaderHeader + shader_project_particles_paper_vert,
fragmentShader: shaderHeader + shader_project_particles_paper_frag,
uniforms: uniforms,
})),
fire: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.fire, {
vertexShader: shaderHeader + shader_project_particles_fire_vert,
fragmentShader: shaderHeader + shader_generic_circle_frag,
uniforms: uniforms,
})),
firePosition: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.firePosition, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_datas_firePosition_frag,
uniforms: uniforms,
})),
fireVelocity: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.fireVelocity, {
vertexShader: shaderHeader + shader_generic_screen_vert,
fragmentShader: shaderHeader + shader_project_datas_fireVelocity_frag,
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