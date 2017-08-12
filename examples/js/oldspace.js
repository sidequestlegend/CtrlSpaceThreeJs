/**
 * Created by autoc on 05/08/2017.
 */
var OldSpace = function(){};
OldSpace.prototype = {
	initialize: function(){
		this.itemIndex = [];
	},
	render: function(scene){
		var current_objects = [];
		var that = this;
		scene.traverse(function(child){
			var materialMap = undefined;
			if(child.material.map && child.material.map instanceof THREE.Texture){
				materialMap = child.material.map.canvas.toDataURL("image/jpeg");
			}
			var output = {};
			switch(child.geometry.type){
				case "BoxGeometry":
				case "BoxBufferGeometry":
					output = {
						uuid:child.uuid,
						color:child.material.color,
						position:child.position,
						quaternion:child.quaternion,
						scale:child.scale
					};
					if(that.itemIndex.indexOf(child.uuid)===-1){
						output.geometry = {
							parameters:child.geometry.parameters,
							type:child.geometry.type
						};
						output.material = {
							transparent:child.material.transparent,
							visible:child.material.visible,
							map:materialMap
						};
						that.itemIndex.push(child.uuid);
					}
					break;
			}
			current_objects.push(output);
		});
	}
};

var oldSpace = new OldSpace().initialize();