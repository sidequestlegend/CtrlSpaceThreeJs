# CtrlSpaceThreeJs
The javascript shims required to scrape three.js scene properties and pass them over to a game engine like unity or unreal.


This is just one side of the component but feel free to explore to see how it works. 

npm start will fire up an example. 

```
npm start

```


To implement this in your existing projects simply include examples/CtrlSpace/src.js in your index.html.


```
<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@r84/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@r84/examples/js/loaders/MTLLoader.js"></script>
<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@r84/examples/js/loaders/OBJLoader.js"></script>
<script src="examples/dist/altspace.js"></script>
<script src="examples/CtrlSpace/src.js"></script>
<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
```

Then initialise and create a transport. Use with Altspace Simulation/AltRenderer by adding a behavior to the scene.

```

var ctrl_space = new CtrlSpace(); // Before any other initialisation to properly establish the shims before they are used by anything else.

...


ctrl_space.createWebsocketTransport("ws://localhost:3001");
ctrl_space.addBehavior(sim.scene,true);// Debug flag for logging data.

```

If you are not using the altspace SDK at all simply render inside your requestAnimationFrame.


```

var ctrl_space = new CtrlSpace();

...


ctrl_space.createWebsocketTransport("ws://localhost:3001");

function animate(delta){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
    ctrl_space.render(scene,true);// Debug

}

```

CtrlSpace uses JSON data structures to store scene properties for passing over the selected transport to your unity/unreal/ any other engine really.
It passes an object with two properties `current_objects` and `new_objects`. As objects are added to the scene they appear in `new_objects` but on every
consecutive frame they appear in `current_objects` unless they are removed from the scene.

`new_objects` will contain 3D properties of each object in the scene, i.e position, quaternion, scale and color but also the material info, geometry
properties and type aswell as a files object with a list of any model/material files loaded in the scene. Currently supports OBJ, MTL, GLTF and Collada.

`current_objects` will contain only 3D properties of each object.


The javascript side will only send updates to objects that have changed i.e if position does not change then there will not be a position property on the object.
For this reason you can force a reset of the cache from the game engine side by sending the following JSON string over the selected transport to javascript;

```
{"path":"unityData","data":"start"}
```

Here is some sample 1st frame output from the serialisation of the scene in CtrlSpace after the start command is recieved ( there is a lot )

```
{
   "current_objects":[

   ],
   "new_objects":[
      {
         "uuid":"B89C4D98-DC31-4DF7-BFE7-4976C953D434",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.6599999999999999,
            "y":0.6599999999999999,
            "z":0.6599999999999999
         },
         "files":{
            "obj":"models/solar-system/sun.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"B3C9BB0E-9DB8-4000-999F-0D7747746F4A",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"6ABDFCC4-3A57-48F1-99E0-D667A4BE69F8",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.05279999999999999,
            "y":0.05279999999999999,
            "z":0.05279999999999999
         },
         "files":{
            "obj":"models/solar-system/mercury.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"F8276339-57AB-4F30-8C08-22DC493C5F60",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"E045090B-56E3-4CAE-B60F-ABB3832AD008",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.132,
            "y":0.132,
            "z":0.132
         },
         "files":{
            "obj":"models/solar-system/venus.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"46061B0C-EAA3-4FC5-B5EE-84F45D57969E",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"67D69153-19FA-4AEC-B83F-1BA725867C16",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.1386,
            "y":0.1386,
            "z":0.1386
         },
         "files":{
            "obj":"models/solar-system/earth.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"0F721416-0AB3-41C0-BDF2-F94D071533C5",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"6325E920-C614-4318-8923-86CB89C263DC",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.0726,
            "y":0.0726,
            "z":0.0726
         },
         "files":{
            "obj":"models/solar-system/mars.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"CB336FB1-8273-46B2-ACB2-425492F99472",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"61DA849F-4506-4486-9769-51117489E511",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.308,
            "y":0.308,
            "z":0.308
         },
         "files":{
            "obj":"models/solar-system/jupiter.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"EF265239-CF51-4EEB-97A3-1DEFBBC5932F",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"92A683D2-CC66-4756-92B0-6E6EFBAE039C",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.264,
            "y":0.264,
            "z":0.264
         },
         "files":{
            "obj":"models/solar-system/saturn.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"E8DB0A22-B35B-4BDB-BDCC-C0E17768E369",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"2F7D9B0B-B634-45D5-97FB-F5AB440922DA",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"3DF07940-7F91-4DEF-8446-024D11DE3E52",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"28C1E835-698D-459B-BE91-4F3900FEF899",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.21999999999999997,
            "y":0.21999999999999997,
            "z":0.21999999999999997
         },
         "files":{
            "obj":"models/solar-system/uranus.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"A43A4ECE-9F44-4CD4-AFC8-1495956FD06E",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      },
      {
         "uuid":"344E9583-27E4-42D4-B39F-B4545FC0D3C6",
         "type":"Group",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":10,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":0.176,
            "y":0.176,
            "z":0.176
         },
         "files":{
            "obj":"models/solar-system/neptune.obj"
         },
         "material":{
            "transparent":false,
            "visible":false
         }
      },
      {
         "uuid":"1061175C-E509-4567-B641-CE3A56EDCE36",
         "type":"Mesh",
         "color":{
            "r":1,
            "g":1,
            "b":1
         },
         "position":{
            "x":0,
            "y":0,
            "z":0
         },
         "quaternion":{
            "w":1,
            "x":0,
            "y":0,
            "z":0
         },
         "scale":{
            "x":1,
            "y":1,
            "z":1
         },
         "files":{

         },
         "material":{
            "transparent":false,
            "visible":true
         }
      }
   ]
}
```



Here is a sample second frame with `current_objects` filled rather than `new_objects`.


```
{
   "current_objects":[
      {
         "uuid":"B89C4D98-DC31-4DF7-BFE7-4976C953D434",
         "type":"Group",
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"B3C9BB0E-9DB8-4000-999F-0D7747746F4A",
         "type":"Mesh"
      },
      {
         "uuid":"6ABDFCC4-3A57-48F1-99E0-D667A4BE69F8",
         "type":"Group",
         "position":{
            "x":5.568477730695649,
            "y":10,
            "z":17.117010713402813
         },
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"F8276339-57AB-4F30-8C08-22DC493C5F60",
         "type":"Mesh"
      },
      {
         "uuid":"E045090B-56E3-4CAE-B60F-ABB3832AD008",
         "type":"Group",
         "position":{
            "x":16.688734818057807,
            "y":10,
            "z":-21.224658540776225
         },
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"46061B0C-EAA3-4FC5-B5EE-84F45D57969E",
         "type":"Mesh"
      },
      {
         "uuid":"67D69153-19FA-4AEC-B83F-1BA725867C16",
         "type":"Group",
         "position":{
            "x":5.276509825025624,
            "y":10,
            "z":35.611212336375296
         },
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"0F721416-0AB3-41C0-BDF2-F94D071533C5",
         "type":"Mesh"
      },
      {
         "uuid":"6325E920-C614-4318-8923-86CB89C263DC",
         "type":"Group",
         "position":{
            "x":42.10795315473856,
            "y":10,
            "z":-15.871996759020051
         },
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"CB336FB1-8273-46B2-ACB2-425492F99472",
         "type":"Mesh"
      },
      {
         "uuid":"61DA849F-4506-4486-9769-51117489E511",
         "type":"Group",
         "position":{
            "x":64.91002954612385,
            "y":10,
            "z":-31.15586725355801
         },
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"EF265239-CF51-4EEB-97A3-1DEFBBC5932F",
         "type":"Mesh"
      },
      {
         "uuid":"92A683D2-CC66-4756-92B0-6E6EFBAE039C",
         "type":"Group",
         "position":{
            "x":89.94575947804401,
            "y":10,
            "z":3.1241561929354678
         },
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"E8DB0A22-B35B-4BDB-BDCC-C0E17768E369",
         "type":"Mesh"
      },
      {
         "uuid":"2F7D9B0B-B634-45D5-97FB-F5AB440922DA",
         "type":"Mesh"
      },
      {
         "uuid":"3DF07940-7F91-4DEF-8446-024D11DE3E52",
         "type":"Mesh"
      },
      {
         "uuid":"28C1E835-698D-459B-BE91-4F3900FEF899",
         "type":"Group",
         "position":{
            "x":13.96396119468417,
            "y":10,
            "z":-107.09345352426243
         },
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"A43A4ECE-9F44-4CD4-AFC8-1495956FD06E",
         "type":"Mesh"
      },
      {
         "uuid":"344E9583-27E4-42D4-B39F-B4545FC0D3C6",
         "type":"Group",
         "position":{
            "x":97.82462598399475,
            "y":10,
            "z":79.41248359730062
         },
         "quaternion":{
            "w":0.9999998750000026,
            "x":0,
            "y":0.0004999999791666669,
            "z":0
         }
      },
      {
         "uuid":"1061175C-E509-4567-B641-CE3A56EDCE36",
         "type":"Mesh"
      }
   ],
   "new_objects":[

   ]
}
```
