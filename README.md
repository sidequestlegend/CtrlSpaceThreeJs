# CtrlSpaceThreeJs
The javascript shims required to scrape three.js scene properties and pass them over to a game engine like unity or unreal.


This is just one side of the component but feel free to explore to see how it works. 

npm start will fire up an example. 

```
npm start

```


To implement this in your existing projects simply include examples/CtrlSpace/src.js in your index.html.


```
<script src="https://cdn.rawgit.com/mrdoob/three.js/r84/build/three.min.js"></script>
<script src="https://cdn.rawgit.com/mrdoob/three.js/r84/examples/js/loaders/MTLLoader.js"></script>
<script src="https://cdn.rawgit.com/mrdoob/three.js/r84/examples/js/loaders/OBJLoader.js"></script>
<script src="examples/dist/altspace.js"></script>
<script src="examples/CtrlSpace/src.js"></script>
<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
```

Then initialise and create a transport. Use with Altspace Simulation/AltRenderer by adding a behavior to the scene.

```

var ctrl_space = new CtrlSpace();
ctrl_space.createWebsocketTransport("ws://localhost:3001");
ctrl_space.addBehavior(sim.scene,true);// Debug flag for logging data.

```

If you are not using the altspace SDK at all simply render inside your requestAnimationFrame.


```

var ctrl_space = new CtrlSpace();
ctrl_space.createWebsocketTransport("ws://localhost:3001");

function animate(delta){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
    ctrl_space.render(scene,true);// Debug

}

```