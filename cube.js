var scene;
var camera;
var renderer;
var controls;
var cubes = [];
var raycaster;
var mouse;
var colors = []
function initApp() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = -1;
    mouse.y = 1;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbababa);

    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    document.body.appendChild(renderer.domElement);
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("mousemove", onMouseMove, false);

}
function shading() {
    cubes.forEach(f => {
        f.geometry.colorsNeedUpdate = true;
        f.geometry.faces.forEach(c => {
            c.color.setRGB(1, 1, 1)
        })
    })
    //top
    var topfaces = getFace("top")
    topfaces.forEach(f => {
        f.geometry.faces[4].color.setHex(colors[0]);
        f.geometry.faces[5].color.setHex(colors[0]);
    }
    )
    //bottom
    var bottomfaces = getFace("bottom")
    bottomfaces.forEach(f => {
        f.geometry.faces[6].color.setHex(colors[1]);
        f.geometry.faces[7].color.setHex(colors[1]);
    }
    )
    //left
    var leftfaces = getFace("left")
    leftfaces.forEach(f => {
        f.geometry.faces[2].color.setHex(colors[2]);
        f.geometry.faces[3].color.setHex(colors[2]);
    }
    )
    //right
    var rightfaces = getFace("right")
    rightfaces.forEach(f => {
        f.geometry.faces[0].color.setHex(colors[3]);
        f.geometry.faces[1].color.setHex(colors[3]);
    }
    )
    //front
    var frontfaces = getFace("front")
    frontfaces.forEach(f => {
        f.geometry.faces[8].color.setHex(colors[4]);
        f.geometry.faces[9].color.setHex(colors[4]);
    }
    )
    //back
    var backfaces = getFace("back")
    backfaces.forEach(f => {
        f.geometry.faces[10].color.setHex(colors[5]);
        f.geometry.faces[11].color.setHex(colors[5]);
    }
    )
}

function initScene() {
    //init Cube
    var initPos = new THREE.Vector3(-1, 1, 1);
    var deltaX = 0;
    var deltaZ = 0;
    var deltaY = 0;
    for (var i = 1; i <= 27; i++) {
        var geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
        var _cube = new THREE.Mesh(geometry, material);
        _cube.position.set(initPos.x + deltaX, initPos.y + deltaY, initPos.z + deltaZ)
        deltaX += 1
        if (i % 3 == 0) {
            deltaZ -= 1
            deltaX = 0
        }
        if (i % 9 == 0) {
            deltaX = 0; deltaZ = 0
            deltaY -= 1
        }
        cubes.push(_cube);
        scene.add(_cube)
    }
    colors = [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff];
    shading()
}

function getFace(dir) {
    var plane;
    switch (dir) {
        case "top":
            plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1);
            break;
        case "bottom":
            plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1);
            break;
        case "left":
            plane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -1);
            break;
        case "right":
            plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -1);
            break;
        case "front":
            plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1);
            break;
        case "back":
            plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), -1);
            break;
    }
    var faces = []
    cubes.forEach(cube => {
        cube.geometry.computeBoundingBox();
        var bbox = cube.geometry.boundingBox.clone();
        cube.updateMatrixWorld(true);
        bbox.applyMatrix4(cube.matrixWorld);
        if (plane.intersectsBox(bbox))
            faces.push(cube)
    })
    return faces;
}

var pressed = false;
var pivot = new THREE.Object3D()
function doRotate(face, clockwise) {

    if (Math.abs(pivot.rotation.z) < Math.PI / 2) {
        var faces = getFace(face)
        pivot.updateMatrixWorld();
        var active = []
        faces.forEach(f => { active.push(f) })
        active.forEach(f => { pivot.attach(f) })
        pivot.rotateZ(clockwise * 0.1)
        if (Math.abs(Math.abs(pivot.rotation.z) - Math.PI / 2) <= 0.2) {
            pivot.rotateZ(clockwise * (Math.abs(Math.abs(pivot.rotation.z) - Math.PI / 2)))
        }
        console.log("rotating")
        pivot.updateMatrixWorld();
        active.forEach(f => { scene.attach(f) })
    }
    else {
        pressed = false;
    }

}

function render() {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(cubes);

    if (intersects.length >= 1) {
        var o = raycaster.intersectObject(intersects[0].object);
        if (o.length >= 1) {
            var i1 = 0, i2 = 0;

            if (o[0].faceIndex % 2 == 0) {
                i1 = o[0].faceIndex;
                i2 = o[0].faceIndex + 1;
            }
            else {
                i1 = o[0].faceIndex;
                i2 = o[0].faceIndex - 1;
            }
            var castedFace1 = o[0].object.geometry.faces[i1]
            var castedFace2 = o[0].object.geometry.faces[i2]
            o[0].object.geometry.colorsNeedUpdate = true;

            castedFace1.color.setRGB(1, 0, 0);
            castedFace2.color.setRGB(1, 0, 0);
            console.log(o[0])
        }

    }




    if (pressed) {
        doRotate("front", -1)
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
function onMouseDown(event) { }
function onMouseUp(event) { }
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    // console.log(mouse.x, mouse.y)
}

function onKeyDown(event) {
    var keycode = event.which;
    if (pressed)
        return;
    if (keycode == 87) {
        console.log("W")
        pivot.rotation.set(0, 0, 0)
        pressed = true;
    }
    else if (keycode == 83) {
        console.log("S")
        pivot.rotation.set(0, 0, 0)
        pressed = true;
    }
    else if (keycode == 32) {
        console.log("Blank")
    }

}
initApp();
initScene();
render();