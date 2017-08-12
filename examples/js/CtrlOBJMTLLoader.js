THREE = THREE||{};
var socket = new WebSocket("ws://localhost:7879");
socket.onopen = function(){
	socket.send(JSON.stringify({path:"browser"}));
};
var itemIndex = [];
var ok_to_render = false;
var scene_ref;
socket.onmessage = function(message) {
	message = JSON.parse(message.data);
	if(message.path == "unityData"&&message.data == "start"){
		if(scene_ref){
			scene_ref.traverse(function(child){
				if(hasGeometry(child)){
					delete child.__last_position;
					delete child.__last_quaternion;
					delete child.__last_scale;
					delete child.__last_color;
				}
			});
		}
		itemIndex = [];
		ok_to_render = true;
	}
};
var load = function() {
	return function (url, onLoad, onProgress, onError) {
		var that = this;
		return this.__load(url, function (object) {
			object.ctrl_space__obj = url;
			object.ctrl_space__mtl = that.ctrl_space__mtl;
			return onLoad(object);
		}, onProgress, onError);
	};
};
var setMaterials = function() {
	return function (materials) {
		console.log(this);
		this.ctrl_space__mtl = materials.ctrl_space__obj;
		return this.__setMaterials(materials);
	};
};
var setIfChanged = function(old_obj,new_obj,key) {
	var needsUpdate = false;
	Object.keys(old_obj).forEach(function(d){
		if(old_obj[d]!==new_obj[d]) {
			needsUpdate = true;
		}
	});
	if(needsUpdate){
		switch(key){
			case "scale":
			case "position":
				this[key] = {x:new_obj.x,y:new_obj.y,z:new_obj.z};
				break;
			case "color":
				this[key] = {r:new_obj.r,g:new_obj.g,b:new_obj.b};
				break;
			case "quaternion":
				this[key] = {w:new_obj.w,x:new_obj.x,y:new_obj.y,z:new_obj.z};
				break;
		}
	}
};
var getObjectData = function(child){
	var output = {uuid:child.uuid,type:child.type};
	var child_color = child.material&&child.material.color?child.material.color:{r:1,g:1,b:1};
	if(!child.__last_color) {
		output.color = {r:child_color.r,g:child_color.g,b:child_color.b};
	}else {
		setIfChanged.call(output,child.__last_color,child_color,"color");
	}
	if(!child.__last_position) {
		output.position = {x:child.position.x,y:child.position.y,z:child.position.z};
	}else {
		setIfChanged.call(output,child.__last_position,child.position,"position");
	}
	if(!child.__last_quaternion) {
		output.quaternion = {w:child.quaternion.w,x:child.quaternion.x,y:child.quaternion.y,z:child.quaternion.z};
	}else {
		setIfChanged.call(output,child.__last_quaternion,child.quaternion,"quaternion");
	}
	if(!child.__last_scale) {
		output.scale = {x:child.scale.x,y:child.scale.y,z:child.scale.z};
	}else {
		setIfChanged.call(output,child.__last_scale,child.scale,"position");
	}
	child.__last_position = child.position.clone();
	child.__last_quaternion = {w:child.quaternion.w,x:child.quaternion.x,y:child.quaternion.y,z:child.quaternion.z};
	child.__last_scale = child.scale.clone();
	child.__last_color = (child.material&&child.material.color?child.material.color:{r:1,g:1,b:1});
	//if(output.color||output.position||output.color||output.quaternion){
		return output;
	// }else{
	// 	return false;
	// }
};
var hasGeometry = function(child){
	return child.ctrl_space__obj||child.geometry;
	
	
}

var renderMe = function(scene) {
	scene_ref = scene;
	var current_objects = [];
	var new_objects = [];
	scene.traverse(function(child){
		if(hasGeometry(child)){
			if(itemIndex.indexOf(child.uuid)===-1) {
				var new_output;
				if(child.geometry){
					switch(child.geometry.type){
						case "BoxGeometry":
						case "BoxBufferGeometry":
							if(itemIndex.indexOf(child.uuid)===-1){
								if(!new_output)new_output=getObjectData(child);
								new_output.geometry = {
									parameters:child.geometry.parameters,
									type:child.geometry.type
								};
							}
							break;
					}
				}
				var materialMap;
				if(child.material && child.material.map && child.material.map instanceof THREE.Texture){
					if(child.material.map.canvas){
						materialMap = {url:child.material.map.canvas.toDataURL("image/jpeg"),type:'base64'};
					}else if(child.material.image&& child.material.image instanceof Image){
						materialMap = {url:child.material.map.image.src,type:'url'};
					}
				}
				if(!new_output)new_output=getObjectData(child);
				new_output.files = {};
				if(child.ctrl_space__mtl){
					new_output.files.mtl = child.ctrl_space__mtl;
				}
				if(child.ctrl_space__obj){
					new_output.files.obj = child.ctrl_space__obj;
				}
				new_output.material = {
					transparent: child.material?child.material.transparent:false,
					visible: child.material?child.material.visible:false,
					map: materialMap
				};
				itemIndex.push(child.uuid);
			}
			var output = getObjectData(child);
		}
		if(output&&!new_output)current_objects.push(output);
		if(new_output)new_objects.push(new_output);
	});
	socket.send(JSON.stringify({path:"browserData",data:{current_objects:current_objects,new_objects:new_objects}}));
	//console.log({path:"browserData",data:{current_objects:current_objects,new_objects:new_objects}});
	// this.__render(scene);
};
if(THREE.OBJLoader) {
	THREE.CtrlOBJLoader = function (manager) {
		return this.constructor(manager);
	};
	THREE.CtrlOBJLoader.prototype = Object.create(THREE.OBJLoader.prototype);
	THREE.CtrlOBJLoader.prototype.__load = THREE.CtrlOBJLoader.prototype.load;
	THREE.CtrlOBJLoader.prototype.load = load.call(THREE.CtrlOBJLoader.prototype);
	THREE.CtrlOBJLoader.prototype.__setMaterials = THREE.CtrlOBJLoader.prototype.setMaterials;
	THREE.CtrlOBJLoader.prototype.setMaterials = setMaterials.call(THREE.OBJLoader.prototype);
	THREE.OBJLoader = THREE.CtrlOBJLoader;
}
if(THREE.MTLLoader) {
	THREE.CtrlMTLLoader = function (manager) {
		return this.constructor(manager);
	};
	THREE.CtrlMTLLoader.prototype = Object.create(THREE.MTLLoader.prototype);
	THREE.CtrlMTLLoader.prototype.__load = THREE.CtrlMTLLoader.prototype.load;
	THREE.CtrlMTLLoader.prototype.load = load.call(THREE.CtrlMTLLoader.prototype);
	THREE.CtrlMTLLoader.MaterialCreator = function (baseUrl, options) {
		return this.constructor(baseUrl, options);
	};
	THREE.CtrlMTLLoader.MaterialCreator.prototype = Object.create(THREE.MTLLoader.MaterialCreator.prototype);
	THREE.MTLLoader = THREE.CtrlMTLLoader;
}
if(THREE.ColladaLoader){
	THREE.CtrlColladaLoader = function(manager){
		return this.constructor(manager);
	};
	THREE.CtrlColladaLoader.prototype = Object.create(THREE.ColladaLoader.prototype);
	THREE.CtrlColladaLoader.prototype.__load = THREE.CtrlColladaLoader.prototype.load;
	THREE.CtrlColladaLoader.prototype.load = load.call(THREE.CtrlColladaLoader.prototype);
	THREE.ColladaLoader = THREE.CtrlColladaLoader;
}
if(THREE.GLTF2Loader){
	THREE.CtrlGLTF2Loader = function(manager){
		return this.constructor(manager);
	};
	THREE.CtrlGLTF2Loader.prototype = Object.create(THREE.GLTF2Loader.prototype);
	THREE.CtrlGLTF2Loader.prototype.__load = THREE.CtrlGLTF2Loader.prototype.load;
	THREE.CtrlGLTF2Loader.prototype.load = load.call(THREE.CtrlGLTF2Loader.prototype);
	THREE.ColladaLoader = THREE.CtrlGLTF2Loader;
}

//
// if(THREE.WebGLRenderer){
// 	console.log('webgl renderer')
// 	THREE.CtrlRenderer = function(options){
// 		return this.constructor(options);
// 	};
// 	THREE.CtrlRenderer.prototype = Object.create(THREE.WebGLRenderer.prototype);
// 	THREE.CtrlRenderer.prototype.__render = THREE.CtrlRenderer.prototype.render;
// 	THREE.CtrlRenderer.prototype.render = render.call(THREE.CtrlRenderer.prototype);
// 	//THREE.WebGLRenderer = THREE.CtrlRenderer;
// }