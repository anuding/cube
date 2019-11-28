
var scene;
var camera;
var renderer;
var controls;
function initApp() {
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
    document.addEventListener("keydown", onDocumentKeyDown, false);
}


function initScene() {
    //init Cube
    var initPos = new THREE.Vector3(-1, 1, 1);
    var deltaX = 0;
    var deltaZ = 0;
    var deltaY = 0;
    var cube = new THREE.Object3D()
    cube.name = "cube"
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
        cube.add(_cube);
    }
    scene.add(cube)
    var cubes = cube.children
    var color;
    //top
    color = Math.random() * 0xffffff
    var topfaces = getTopface(cube)
    topfaces.forEach(f => {
        f.geometry.faces[4].color.setHex(color);
        f.geometry.faces[5].color.setHex(color);
    }
    )
    //bottom
    color = Math.random() * 0xffffff
    var bottomfaces = getBottomface(cube)
    bottomfaces.forEach(f => {
        f.geometry.faces[6].color.setHex(color);
        f.geometry.faces[7].color.setHex(color);
    }
    )
    //left
    color = Math.random() * 0xffffff
    var leftfaces = getLeftface(cube)
    leftfaces.forEach(f => {
        f.geometry.faces[2].color.setHex(color);
        f.geometry.faces[3].color.setHex(color);
    }
    )
    //right
    color = Math.random() * 0xffffff
    var rightfaces = getRightface(cube)
    rightfaces.forEach(f => {
        f.geometry.faces[0].color.setHex(color);
        f.geometry.faces[1].color.setHex(color);
    }
    )
    //front
    color = Math.random() * 0xffffff
    var frontfaces = getFrontface(cube)
    frontfaces.forEach(f => {
        f.geometry.faces[8].color.setHex(color);
        f.geometry.faces[9].color.setHex(color);
    }
    )
    //back
    color = Math.random() * 0xffffff
    var backfaces = getBackface(cube)
    backfaces.forEach(f => {
        f.geometry.faces[10].color.setHex(color);
        f.geometry.faces[11].color.setHex(color);
    }
    )
}
function getTopface(cube) {
    var cubes = cube.children
    var frontface = []
    for (var i = 0; i < 3; i++) {
        frontface.push(cubes[i])
        frontface.push(cubes[i + 3])
        frontface.push(cubes[i + 6])
    }
    return frontface
}
function getBottomface(cube) {
    var cubes = cube.children
    var frontface = []
    for (var i = 18; i < 21; i++) {
        frontface.push(cubes[i])
        frontface.push(cubes[i + 3])
        frontface.push(cubes[i + 6])
    }
    return frontface
}
function getLeftface(cube) {
    var cubes = cube.children
    var frontface = []
    for (var i = 0; i < 7; i += 3) {
        frontface.push(cubes[i])
        frontface.push(cubes[i + 9])
        frontface.push(cubes[i + 18])
    }
    return frontface
}
function getRightface(cube) {
    var cubes = cube.children
    var frontface = []
    for (var i = 2; i < 9; i += 3) {
        frontface.push(cubes[i])
        frontface.push(cubes[i + 9])
        frontface.push(cubes[i + 18])
    }
    return frontface
}
function getFrontface(cube) {
    var cubes = cube.children
    var frontface = []
    for (var i = 0; i < 3; i++) {
        frontface.push(cubes[i])
        frontface.push(cubes[i + 9])
        frontface.push(cubes[i + 18])
    }
    return frontface
}
function getBackface(cube) {
    var cubes = cube.children
    var frontface = []
    for (var i = 6; i < 9; i++) {
        frontface.push(cubes[i])
        frontface.push(cubes[i + 9])
        frontface.push(cubes[i + 18])
    }
    return frontface
}

function getMaterials() {
    var materials = []
    for (var i = 0; i < 6; i++) {
        var material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        materials.push(material);
    }
    return materials;
}

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

    if (pointIsWorld) {
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if (pointIsWorld) {
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

function onDocumentKeyDown(event) {
    var keycode = event.which;
    if (keycode == 87) {
        console.log("W")
        var cube = scene.getObjectByName("cube");
        var frontfaces = getFrontface(cube)
        frontfaces.forEach(f => {
            var center = new THREE.Vector3(0, 0, 1);
            rotateAboutPoint(f, center, new THREE.Vector3(0, 0, 1), -Math.PI / 2, true)
        })
        const cloneFaces = frontfaces.slice()
        console.log(cloneFaces[0].uuid)

        frontfaces[0] = cloneFaces[2]
        frontfaces[1] = cloneFaces[5]
        frontfaces[2] = cloneFaces[8]
        frontfaces[3] = cloneFaces[1]
        frontfaces[4] = cloneFaces[4]
        frontfaces[5] = cloneFaces[7]
        frontfaces[6] = cloneFaces[0]
        frontfaces[7] = cloneFaces[3]
        frontfaces[8] = cloneFaces[6]

        // const cloneSheeps = cube.children.slice();
        // cube.children[0]=cloneSheeps[18]
        // cube.children[2]=cloneSheeps[0]
        // cube.children[20]=cloneSheeps[2]
        // cube.children[18]=cloneSheeps[20]
        console.log(frontfaces[0].uuid)
    }
    else if (keycode == 83) {
        console.log("S")
        var cube = scene.getObjectByName("cube");
        var rightfaces = getRightface(cube)
        rightfaces.forEach(f => {
            var center = new THREE.Vector3(1, 0, 0);
            rotateAboutPoint(f, center, new THREE.Vector3(1, 0, 0), Math.PI / 2, true)
        })
    }
    else if (keycode == 32) {
        console.log("Blank")
    }

}
initApp();
initScene();
render();