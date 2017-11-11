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
import font_bebas_json from "../../asset/font/bebas.json!text";
import font_coffee_json from "../../asset/font/coffee.json!text";
import point_Chouchen_obj from "../../asset/point/Chouchen.obj!text";
import point_Jonathan10k_obj from "../../asset/point/Jonathan10k.obj!text";
import point_Jonathan1k_obj from "../../asset/point/Jonathan1k.obj!text";
import point_Mario_obj from "../../asset/point/Mario.obj!text";
import point_branch_obj from "../../asset/point/branch.obj!text";
import point_flash_obj from "../../asset/point/flash.obj!text";
import point_question_obj from "../../asset/point/question.obj!text";
import point_root_obj from "../../asset/point/root.obj!text";
import point_tree_obj from "../../asset/point/tree.obj!text";
import shader_filter_filter_frag from "../../asset/shader/filter/filter.frag!text";
import shader_filter_screen_vert from "../../asset/shader/filter/screen.vert!text";
import shader_pass_position_frag from "../../asset/shader/pass/position.frag!text";
import shader_pass_velocity_frag from "../../asset/shader/pass/velocity.frag!text";
import shader_scene_droplet_frag from "../../asset/shader/scene/droplet.frag!text";
import shader_scene_droplet_vert from "../../asset/shader/scene/droplet.vert!text";
import shader_scene_fire_frag from "../../asset/shader/scene/fire.frag!text";
import shader_scene_fire_vert from "../../asset/shader/scene/fire.vert!text";
import shader_scene_flash_frag from "../../asset/shader/scene/flash.frag!text";
import shader_scene_flash_vert from "../../asset/shader/scene/flash.vert!text";
import shader_scene_flying_frag from "../../asset/shader/scene/flying.frag!text";
import shader_scene_flying_vert from "../../asset/shader/scene/flying.vert!text";
import shader_scene_head_frag from "../../asset/shader/scene/head.frag!text";
import shader_scene_head_vert from "../../asset/shader/scene/head.vert!text";
import shader_scene_label_frag from "../../asset/shader/scene/label.frag!text";
import shader_scene_label_vert from "../../asset/shader/scene/label.vert!text";
import shader_scene_leaf_frag from "../../asset/shader/scene/leaf.frag!text";
import shader_scene_leaf_vert from "../../asset/shader/scene/leaf.vert!text";
import shader_scene_meshTunnel_frag from "../../asset/shader/scene/meshTunnel.frag!text";
import shader_scene_meshTunnel_vert from "../../asset/shader/scene/meshTunnel.vert!text";
import shader_scene_paper_frag from "../../asset/shader/scene/paper.frag!text";
import shader_scene_paper_vert from "../../asset/shader/scene/paper.vert!text";
import shader_scene_rain_frag from "../../asset/shader/scene/rain.frag!text";
import shader_scene_rain_vert from "../../asset/shader/scene/rain.vert!text";
import shader_scene_ribbonScreen_frag from "../../asset/shader/scene/ribbonScreen.frag!text";
import shader_scene_ribbonScreen_vert from "../../asset/shader/scene/ribbonScreen.vert!text";
import shader_scene_ribbonTunnel_frag from "../../asset/shader/scene/ribbonTunnel.frag!text";
import shader_scene_ribbonTunnel_vert from "../../asset/shader/scene/ribbonTunnel.vert!text";
import shader_scene_ribbon_frag from "../../asset/shader/scene/ribbon.frag!text";
import shader_scene_ribbon_vert from "../../asset/shader/scene/ribbon.vert!text";
import shader_scene_smoke_frag from "../../asset/shader/scene/smoke.frag!text";
import shader_scene_smoke_vert from "../../asset/shader/scene/smoke.vert!text";
import shader_scene_snow_frag from "../../asset/shader/scene/snow.frag!text";
import shader_scene_snow_vert from "../../asset/shader/scene/snow.vert!text";
import shader_scene_stars_frag from "../../asset/shader/scene/stars.frag!text";
import shader_scene_stars_vert from "../../asset/shader/scene/stars.vert!text";
import shader_scene_symbol_frag from "../../asset/shader/scene/symbol.frag!text";
import shader_scene_symbol_vert from "../../asset/shader/scene/symbol.vert!text";
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
const objLoader = new OBJLoader();
const plyLoader = new PLYLoader();
const fontLoader = new THREE.FontLoader();
const textureLoader = new THREE.TextureLoader();
const baseUrl = "asset/";
const materialNames = Object.keys(descriptors.materials);
const materials = {};
function load(callback) {
let pending = materialNames.length;
if (!pending)
	return callback();
else
	materialNames.forEach(name => {
		const textureUrl = descriptors.materials[name].texture;

		textureLoader.load(baseUrl + textureUrl, (texture) => {
			materials[name] = new THREE.MeshBasicMaterial({
				map: texture,
			});

			--pending;
			if (!pending)
				return callback();
		});
	});
}
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
branch: objLoader.parse(point_branch_obj),
flash: objLoader.parse(point_flash_obj),
question: objLoader.parse(point_question_obj),
Jonathan1k: objLoader.parse(point_Jonathan1k_obj),
Jonathan10k: objLoader.parse(point_Jonathan10k_obj),
Chouchen: objLoader.parse(point_Chouchen_obj),
Mario: objLoader.parse(point_Mario_obj),
tree: objLoader.parse(point_tree_obj),
root: objLoader.parse(point_root_obj),
},
fonts: {
coffee: fontLoader.parse(font_coffee_json),
bebas: fontLoader.parse(font_bebas_json),
},
materials,
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
symbol: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.symbol, {
vertexShader: shaderHeader + shader_scene_symbol_vert,
fragmentShader: shaderHeader + shader_scene_symbol_frag,
uniforms: uniforms,
})),
meshTunnel: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.meshTunnel, {
vertexShader: shaderHeader + shader_scene_meshTunnel_vert,
fragmentShader: shaderHeader + shader_scene_meshTunnel_frag,
uniforms: uniforms,
})),
ribbonTunnel: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.ribbonTunnel, {
vertexShader: shaderHeader + shader_scene_ribbonTunnel_vert,
fragmentShader: shaderHeader + shader_scene_ribbonTunnel_frag,
uniforms: uniforms,
})),
ribbonScreen: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.ribbonScreen, {
vertexShader: shaderHeader + shader_scene_ribbonScreen_vert,
fragmentShader: shaderHeader + shader_scene_ribbonScreen_frag,
uniforms: uniforms,
})),
paper: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.paper, {
vertexShader: shaderHeader + shader_scene_paper_vert,
fragmentShader: shaderHeader + shader_scene_paper_frag,
uniforms: uniforms,
})),
stars: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.stars, {
vertexShader: shaderHeader + shader_scene_stars_vert,
fragmentShader: shaderHeader + shader_scene_stars_frag,
uniforms: uniforms,
})),
flying: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.flying, {
vertexShader: shaderHeader + shader_scene_flying_vert,
fragmentShader: shaderHeader + shader_scene_flying_frag,
uniforms: uniforms,
})),
head: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.head, {
vertexShader: shaderHeader + shader_scene_head_vert,
fragmentShader: shaderHeader + shader_scene_head_frag,
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
ribbon: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.ribbon, {
vertexShader: shaderHeader + shader_scene_ribbon_vert,
fragmentShader: shaderHeader + shader_scene_ribbon_frag,
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
droplet: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.droplet, {
vertexShader: shaderHeader + shader_scene_droplet_vert,
fragmentShader: shaderHeader + shader_scene_droplet_frag,
uniforms: uniforms,
})),
velocity: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaderMaterials.velocity, {
vertexShader: shaderHeader + shader_filter_screen_vert,
fragmentShader: shaderHeader + shader_pass_velocity_frag,
uniforms: uniforms,
})),
},
load
};