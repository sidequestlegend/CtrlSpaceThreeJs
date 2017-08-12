/**
 * Created by shane harris on 04/08/2017.
 */

// Check for THREE global scope to be able to override.
if(!window.THREE){
	throw new Error("Three.js must be defined in the global scope i.e. THREE or window.THREE.");
}
// Main class constructor
var CtrlSpace = function(){};

CtrlSpace.prototype = {
	createWebsocketTransport: function(url){
		var that = this;
		this.transport = new WebSocket(url);
		this.transport.onopen = function(){
			that.transport.send(JSON.stringify({path:"browser"}));
		};
		this.transport.onmessage = function(message) {
			message = JSON.parse(message.data);
			if(message.path === "unityData"&&message.data === "start"){
				if(that.scene){
					that.scene.traverse(function(child){
						if(that.hasGeometry(child)){
							delete child.__last_position;
							delete child.__last_quaternion;
							delete child.__last_scale;
							delete child.__last_color;
						}
					});
				}
				that.itemIndex = [];
				that.renderer_ready = true;
			}
		};
		return this.transport;
	},
	sendData(data){
		this.transport.send(JSON.stringify({path:"browserData",data:data}));
	},
	load: function(type) {
		return function (url, onLoad, onProgress, onError) {
			var that = this;
			// Shim the three.js loaders and depending on the type save the url of the model file into the appropriate property of the object.
			return this.__load(url, function (object) {
				switch(type){
					case "OBJ":
						object.ctrl_space__obj = url;
						object.ctrl_space__mtl = that.ctrl_space__mtl;
						break;
					case "MTL":
						object.ctrl_space__obj = url;
						break;
					case "Collada":
						object.ctrl_space__collada = url;
						break;
					case "GLTF":
						object.ctrl_space__gltf = url;
						break;
				}
				// Add mtl to three.js object in the case of OBJ load.
				return onLoad(object);
			}, onProgress, onError);
		};
	},
	setMaterials: function() {
		// Override the setMaterials method of the OBJLoader object. Use this to store the material url temporarily.
		return function (materials) {
			this.ctrl_space__mtl = materials.ctrl_space__obj;
			return this.__setMaterials(materials);
		};
	},
	setIfChanged: function(old_obj,new_obj,key) {
		// Test an object property for changes against its last known property.
		var needsUpdate = false;
		Object.keys(old_obj).forEach(function(d){
			if(old_obj[d]!==new_obj[d]) {
				needsUpdate = true;
			}
		});
		// If the item has changed update the current object with the new value.
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
	},
	getObjectData: function(child){
		// Initialise output with object type and unique key.
		var output = {uuid:child.uuid,type:child.type};
		// Get the new color
		var child_color = child.material&&child.material.color?child.material.color:{r:1,g:1,b:1};
		// Update each property of the object if it has changed. This is sent to Unity/Unreal incrementally.
		if(!child.__last_color) {
			output.color = {r:child_color.r,g:child_color.g,b:child_color.b};
		}else {
			this.setIfChanged.call(output,child.__last_color,child_color,"color");
		}
		if(!child.__last_position) {
			output.position = {x:child.position.x,y:child.position.y,z:child.position.z};
		}else {
			this.setIfChanged.call(output,child.__last_position,child.position,"position");
		}
		if(!child.__last_quaternion) {
			output.quaternion = {w:child.quaternion.w,x:child.quaternion.x,y:child.quaternion.y,z:child.quaternion.z};
		}else {
			this.setIfChanged.call(output,child.__last_quaternion,child.quaternion,"quaternion");
		}
		if(!child.__last_scale) {
			output.scale = {x:child.scale.x,y:child.scale.y,z:child.scale.z};
		}else {
			this.setIfChanged.call(output,child.__last_scale,child.scale,"position");
		}
		// Store the latest point to test for changes on the next iteration.
		child.__last_position = child.position.clone();
		child.__last_quaternion = {w:child.quaternion.w,x:child.quaternion.x,y:child.quaternion.y,z:child.quaternion.z};
		child.__last_scale = child.scale.clone();
		child.__last_color = (child.material&&child.material.color?child.material.color:{r:1,g:1,b:1});
		return output;
	},
	hasGeometry: function(child){
		// Check if the object has a geometry or a model. We ignore other objects for now i.e scene, lights etc.
		return child.ctrl_space__obj||child.ctrl_space__collada||child.ctrl_space__gltf||child.geometry;
	},
	render: function(scene) {
		var that = this;
		// save the scene reference.
		this.scene = scene;
		return new Promise(function(resolve){
			if(that.renderer_ready){
				var current_objects = [];
				var new_objects = [];
				scene.traverse(function(child){
					if(that.hasGeometry(child)) {
						if (that.itemIndex.indexOf(child.uuid) === -1) {
							var new_output;
							// Store primitive geometries parameters and types. This allows for generating these geometries
							// on the Unity/Unreal side without having to transfer costly buffers over the wire.
							if (child.geometry && child.geometry.type && child.geometry.parameters) {
								if (that.itemIndex.indexOf(child.uuid) === -1) {
									if (!new_output) new_output = that.getObjectData(child);
									new_output.geometry = {
										parameters: child.geometry.parameters,
										type: child.geometry.type
									};
								}
							}
							// Grab textures and images. Canvas's are converted to a data uri and image urls are stored.
							var materialMap;
							if (child.material && child.material.map && child.material.map instanceof THREE.Texture) {
								if (child.material.map.canvas) {
									materialMap = {
										url: child.material.map.canvas.toDataURL("image/jpeg"),
										type: 'base64'
									};
								} else if (child.material.image && child.material.image instanceof Image) {
									materialMap = {url: child.material.map.image.src, type: 'url'};
								}
							}
							// Initialise the output object for the new item with the position, scale etc.
							if (!new_output) new_output = that.getObjectData(child);
							new_output.files = {};
							// Store the model urls for transport to Unity/Unreal
							if (child.ctrl_space__mtl) {
								new_output.files.mtl = child.ctrl_space__mtl;
							}
							if (child.ctrl_space__obj) {
								new_output.files.obj = child.ctrl_space__obj;
							}
							if (child.ctrl_space__collada) {
								new_output.files.collada = child.ctrl_space__collada;
							}
							if (child.ctrl_space__gltf) {
								new_output.files.gltf = child.ctrl_space__gltf;
							}
							// Store the material object with material map urls.
							new_output.material = {
								transparent: child.material ? child.material.transparent : false,
								visible: child.material ? child.material.visible : false,
								map: materialMap
							};
							// Save this new item's uuid to the index for later retrieval.
							that.itemIndex.push(child.uuid);
						}
						// Initialise the update output with the position, scale etc.
						var output = that.getObjectData(child);
					}
					// Add output only if item is not new.
					if (output && !new_output) current_objects.push(output);
					// Add new item
					if (new_output) new_objects.push(new_output);
				});
				resolve({current_objects:current_objects,new_objects:new_objects});
			}
		});
	}
};

var ctrl_space = new CtrlSpace();
ctrl_space.createWebsocketTransport("ws://localhost:3001");
// Override the three.js loaders to access the load methods etc.
if(THREE.OBJLoader) {
	CtrlSpace.OBJLoader = function (manager) {
		return this.constructor(manager);
	};
	CtrlSpace.OBJLoader.prototype = Object.create(THREE.OBJLoader.prototype);
	CtrlSpace.OBJLoader.prototype.__load = CtrlSpace.OBJLoader.prototype.load;
	CtrlSpace.OBJLoader.prototype.load = ctrl_space.load.call(CtrlSpace.OBJLoader.prototype,"OBJ");
	CtrlSpace.OBJLoader.prototype.__setMaterials = CtrlSpace.OBJLoader.prototype.setMaterials;
	CtrlSpace.OBJLoader.prototype.setMaterials = ctrl_space.setMaterials.call(CtrlSpace.OBJLoader.prototype);
	THREE.OBJLoader = CtrlSpace.OBJLoader;
}
if(THREE.MTLLoader) {
	CtrlSpace.MTLLoader = function (manager) {
		return this.constructor(manager);
	};
	CtrlSpace.MTLLoader.prototype = Object.create(THREE.MTLLoader.prototype);
	CtrlSpace.MTLLoader.prototype.__load = CtrlSpace.MTLLoader.prototype.load;
	CtrlSpace.MTLLoader.prototype.load = ctrl_space.load.call(CtrlSpace.MTLLoader.prototype,"MTL");
	CtrlSpace.MTLLoader.MaterialCreator = function (baseUrl, options) {
		return this.constructor(baseUrl, options);
	};
	CtrlSpace.MTLLoader.MaterialCreator.prototype = Object.create(THREE.MTLLoader.MaterialCreator.prototype);
	THREE.MTLLoader = CtrlSpace.MTLLoader;
}
if(THREE.ColladaLoader){
	CtrlSpace.ColladaLoader = function(manager){
		return this.constructor(manager);
	};
	CtrlSpace.ColladaLoader.prototype = Object.create(THREE.ColladaLoader.prototype);
	CtrlSpace.ColladaLoader.prototype.__load = CtrlSpace.ColladaLoader.prototype.load;
	CtrlSpace.ColladaLoader.prototype.load = ctrl_space.load.call(CtrlSpace.ColladaLoader.prototype,"Collada");
	THREE.ColladaLoader = CtrlSpace.ColladaLoader;
}
if(THREE.GLTF2Loader){
	CtrlSpace.GLTF2Loader = function(manager){
		return this.constructor(manager);
	};
	CtrlSpace.GLTF2Loader.prototype = Object.create(THREE.GLTF2Loader.prototype);
	CtrlSpace.GLTF2Loader.prototype.__load = CtrlSpace.GLTF2Loader.prototype.load;
	CtrlSpace.GLTF2Loader.prototype.load = ctrl_space.load.call(CtrlSpace.GLTF2Loader.prototype,"GLTF");
	THREE.ColladaLoader = CtrlSpace.GLTF2Loader;
}