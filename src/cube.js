var scene;
var camera;
var renderer;
var controls;
var cubes = [];
var transparentCube;
var raycaster;
var colors = []


function initApp() {
    raycaster = new THREE.Raycaster();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbababa);

    var axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.mouseButtons = {
    //     LEFT: THREE.MOUSE.ROTATE,
    //     MIDDLE: THREE.MOUSE.DOLLY,
    //     RIGHT: THREE.MOUSE.PAN
    // }
    document.body.appendChild(renderer.domElement);
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


    var g = new THREE.BoxGeometry(3, 3, 3);
    var m = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.0 });
    transparentCube = new THREE.Mesh(g, m);
    transparentCube.material.transparent = true
    scene.add(transparentCube);
}

function getFace(face) {
    var plane;
    for (var i = 0; i < planeNames.length; i++) {
        if (face == planeNames[i]) {
            plane = planes[i]
            break;
        }
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
var planes = [
    new THREE.Plane(new THREE.Vector3(0, 1, 0), -1),//top
    new THREE.Plane(new THREE.Vector3(0, -1, 0), -1),//bottom
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), -1),//left
    new THREE.Plane(new THREE.Vector3(1, 0, 0), -1),//right
    new THREE.Plane(new THREE.Vector3(0, 0, 1), -1),//front
    new THREE.Plane(new THREE.Vector3(0, 0, -1), -1),//back
    new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),//rowmid
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),//colmid1
    new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)//colmid2

]
var planeNames = [
    'top', 'bottom', 'left', 'right', 'front', 'back', 'rowmid', 'colmid1','colmid2'
]
function doRotate(face, axis, clockwise) {
    moving = true;
    if (Math.abs(pivot.rotation[axis]) < Math.PI / 2) {
        var faces = getFace(face)
        pivot.updateMatrixWorld();
        var active = []
        faces.forEach(f => { active.push(f) })
        active.forEach(f => { pivot.attach(f) })
        pivot.rotation[axis] += (clockwise * 0.1)
        if (Math.abs(Math.abs(pivot.rotation[axis]) - Math.PI / 2) <= 0.2) {
            pivot.rotation[axis] += (clockwise * (Math.abs(Math.abs(pivot.rotation[axis]) - Math.PI / 2)))
        }
        console.log("rotating")
        pivot.updateMatrixWorld();
        active.forEach(f => { scene.attach(f) })
        requestAnimationFrame(function () { doRotate(face, axis, clockwise) });
    }
    else {
        pressed = false;
        moving = false;
    }

}

function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}




function getIntersect(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersectCube = null, normal = null;

    var intersects = raycaster.intersectObjects(cubes);
    if (intersects.length >= 1) {
        intersectCube = intersects[0];
    }
    var intersects = raycaster.intersectObjects([transparentCube]);
    if (intersects.length >= 1) {
        normal = intersects[0].face.normal;
    }
    return { intersect: intersectCube, normal: normal }
}

var sPos = new THREE.Vector3();
var moving = false;
var sIntersect;
var sIntersectNormal;

function onMouseDown(event) {
    if (moving)
        return
    var intersectObj = getIntersect(event)
    if (intersectObj.intersect) {
        sIntersect = intersectObj.intersect
        sIntersectNormal = intersectObj.normal
        sPos = sIntersect.point
        pressed = true;
        controls.enabled = false;
    }
}
function onMouseMove(event) {
    if (moving)
        return
    if (pressed) {
        var intersectObj = getIntersect(event)
        if (intersectObj.intersect) {
            var ePos = intersectObj.intersect.point
            var dragVector = ePos.sub(sPos)
            var rotateDir = getRotateDir(dragVector, sIntersectNormal)
            pivot.rotation.set(0, 0, 0)
            pressed = true;
            var face, axis, dir;
            //which face
            sIntersect.object.geometry.computeBoundingBox();
            var bbox = sIntersect.object.geometry.boundingBox.clone();
            sIntersect.object.updateMatrixWorld(true);
            bbox.applyMatrix4(sIntersect.object.matrixWorld);
            var dragDir = new THREE.Vector3(rotateDir.dragDir.axis == 'x' ? 1 : 0, rotateDir.dragDir.axis == 'y' ? 1 : 0, rotateDir.dragDir.axis == 'z' ? 1 : 0)
            for (var i = 0; i < planes.length; i++) {
                if (planes[i].normal.dot(sIntersectNormal) == 0 &&
                    planes[i].normal.dot(dragDir) == 0 &&
                    planes[i].intersectsBox(bbox)) {
                    
                    face = planeNames[i];
                    break;
                }
            }
            //which axis
            if (rotateDir.dragDir.axis == rotateDir.normalDir.axis)
                return
            if (rotateDir.dragDir.axis == 'x' && rotateDir.normalDir.axis == 'z')
                axis = "y"
            if (rotateDir.dragDir.axis == 'z' && rotateDir.normalDir.axis == 'x')
                axis = "y"
            if (rotateDir.dragDir.axis == 'x' && rotateDir.normalDir.axis == 'y')
                axis = "z"
            if (rotateDir.dragDir.axis == 'y' && rotateDir.normalDir.axis == 'x')
                axis = "z"
            if (rotateDir.dragDir.axis == 'y' && rotateDir.normalDir.axis == 'z')
                axis = "x"
            if (rotateDir.dragDir.axis == 'z' && rotateDir.normalDir.axis == 'y')
                axis = "x"

            //which dir
            dir = rotateDir.dragDir.dir
            if (!face || !axis || !dir) {
                console.log("error")
                console.log(face, axis, dir)

                return
            }
            console.log(face, axis, dir)
            doRotate(face, axis, dir)
            // doRotate('top', 'y', 1)
            // doRotate('front', 'z', 1)

            // console.log(rotateDir)
        }
    }

}
function onMouseUp(event) {
    pressed = false;
    controls.enabled = true;
}

function getMaxCompoent(vec3) {
    var absDx = Math.abs(vec3.x);
    var absDy = Math.abs(vec3.y);
    var absDz = Math.abs(vec3.z);
    var axis;
    var dir;
    switch (Math.max(absDx, absDy, absDz)) {
        case absDx:
            dir = vec3.x > 0 ? 1 : -1
            axis = 'x';
            break;
        case absDy:
            dir = vec3.y > 0 ? 1 : -1
            axis = 'y';
            break;
        case absDz:
            dir = vec3.z > 0 ? 1 : -1
            axis = 'z';
            break;
    }
    return { dir: dir, axis: axis }
}

function getRotateDir(dragVector, intersectNormal) {
    var dragDir = getMaxCompoent(dragVector)
    var normalDir = getMaxCompoent(intersectNormal)
    return { dragDir: dragDir, normalDir: normalDir }
}
initApp();
initScene();
render();
