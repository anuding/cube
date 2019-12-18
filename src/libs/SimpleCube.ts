import * as THREE from 'three'
import { SimpleCubeHelper as Helper } from './SimpleCubeHelper'
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ArrowHelper } from 'three';
import { ActionQueue } from './ActionQueue'

export class SimpleCube {
    private scene;
    private SimpleCubeScene;
    private camera;
    private renderer;
    private stats;
    private controls;
    private cubes = [];
    private transparentCube;
    private raycaster;
    private colors = []
    private pressed = false;
    private pivot = new THREE.Object3D()
    private planes = [
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
    private planeNames = [
        'top', 'bottom', 'left', 'right', 'front', 'back', 'rowmid', 'colmid1', 'colmid2'
    ]
    private sPos = new THREE.Vector3();
    private moving = false;
    private sIntersect;
    private sIntersectNormal;
    private cpuPanel;

    public start() {
        this.render()
    }

    constructor() {
        this.initApp();
        this.initScene();
    }


    private initApp() {
        this.raycaster = new THREE.Raycaster();
        this.scene = new THREE.Scene();
        var axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(300, 300);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // controls.mouseButtons = {
        //     LEFT: THREE.MOUSE.ROTATE,
        //     MIDDLE: THREE.MOUSE.DOLLY,
        //     RIGHT: THREE.MOUSE.PAN
        // }
        this.stats = new Stats();
        // this.cpuPanel = this.stats.addPanel(new Stats.Panel('cpu', '#ff8', '#221'));
        this.stats.showPanel(3);
        // this.stats.setMode(4);
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.left = "0px";
        this.stats.domElement.style.top = 20;
        document.getElementById('scene').innerHTML = '';
        document.getElementById('scene').appendChild(this.renderer.domElement);
        // document.getElementById('scene').appendChild(this.stats.domElement);

        document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
        document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        document.addEventListener("keydown", this.onBlank.bind(this), false);


    }

    private initScene() {
        this.scene.background = new THREE.Color(0xbababa);
        this.scene.add(new THREE.AmbientLight(0xcccccc, 2));
        this.SimpleCubeScene = new THREE.Group();
        this.SimpleCubeScene.name = "SimpleCubeScene"
        var model;
        var myPromise = Helper.loadModel("", "");
        myPromise.then(obj => {
            model = obj.clone()
            console.log(model)
            // model
            var faceMeshes = []
            faceMeshes = model.children;
            var map = new Map()

            faceMeshes.forEach(faceMesh => {
                var name = faceMesh.name.split('_')[0]

                faceMesh.scale.set(1 / 180, 1 / 180, 1 / 180)

                if (name == '0') {
                    console.log(name + " pass")
                    this.SimpleCubeScene.add(faceMesh.clone())
                    return
                }

                if (map.get(name)) {
                    map.get(name).add(faceMesh.clone())
                }
                else {
                    var group = new THREE.Group();
                    group.add(faceMesh.clone())
                    group.name = name
                    map.set(name, group)
                }
            })
            console.log(map)
            map.forEach(cube => {
                this.cubes.push(cube)
                this.SimpleCubeScene.add(cube)
            })
            this.SimpleCubeScene.attach(this.pivot)
            this.scene.add(this.SimpleCubeScene)
            this.SimpleCubeScene.rotation.set(Math.PI / 2, 0, 0)
        })

        var g = new THREE.BoxGeometry(3, 3, 3);
        var m = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.0 });
        this.transparentCube = new THREE.Mesh(g, m);
        this.transparentCube.material.transparent = true
        this.scene.add(this.transparentCube);
    }

    private actionQueue=new ActionQueue();
    public doRotateAPI(faceName, degree, duration) {
     
    }

    private faces;
    private normal;
    private targetQuaternion = new THREE.Quaternion();
    public doRotate(faceName, degree, duration) {
        if (!this.moving) {
            console.log("hi")
            this.faces = Helper.getFace(faceName, this.cubes)
        }
        console.log("kk")

        this.moving = true;
        this.normal = Helper.getNormalByFaceName(faceName, this.SimpleCubeScene)

        this.targetQuaternion.setFromAxisAngle(this.normal, Math.PI / 2);
        // console.log(THREE.Math.radToDeg(this.pivot.quaternion.angleTo(this.targetQuaternion)))

        if (THREE.Math.radToDeg(this.pivot.quaternion.angleTo(this.targetQuaternion)) > 0) {
            this.pivot.updateMatrixWorld();
            var active = []
            this.faces.forEach(f => { active.push(f) })
            active.forEach(f => { this.pivot.attach(f) })
            this.pivot.quaternion.slerp(this.targetQuaternion, 0.3);
            if (THREE.Math.radToDeg(this.pivot.quaternion.angleTo(this.targetQuaternion)) < 5) {
                this.pivot.quaternion.slerp(this.targetQuaternion, 1);
            }
            this.pivot.updateMatrixWorld();
            active.forEach(f => { this.SimpleCubeScene.attach(f) })
            requestAnimationFrame(this.doRotate.bind(this, faceName, degree, duration));
        }
        else {
            //the rotation is over, should change name for every cube of this face
            Helper.renameCubes(faceName, this.faces)
            //update rotating status
            this.pressed = false;
            this.moving = false;
        }

    }

    private render() {
        // this.SimpleCubeScene.rotation.x += 0.01
        // this.SimpleCubeScene.rotation.z += 0.01

        requestAnimationFrame(this.render.bind(this));
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    public onMouseDown(event) {
        if (this.moving)
            return
        var intersectObj = Helper.getIntersect(event, this.raycaster, this.camera, this.cubes, this.transparentCube)
        if (intersectObj.intersect) {
            this.sIntersect = intersectObj.intersect
            this.sIntersectNormal = intersectObj.normal
            this.sPos = this.sIntersect.point
            this.pressed = true;
            this.controls.enabled = false;
        }
    }
    public onMouseMove(event) {
        if (this.moving)
            return
        if (this.pressed) {
            var intersectObj = Helper.getIntersect(event, this.raycaster, this.camera, this.cubes, this.transparentCube)
            if (intersectObj.intersect) {
                console.log("hit")

                var ePos = intersectObj.intersect.point
                var dragVector = ePos.sub(this.sPos)
                var rotateDir = Helper.getRotateDir(dragVector, this.sIntersectNormal)
                this.pivot.rotation.set(0, 0, 0)
                this.pressed = true;
                var face, axis, dir;
                //which face
                this.sIntersect.object.geometry.computeBoundingBox();
                var bbox = this.sIntersect.object.geometry.boundingBox.clone();
                this.sIntersect.object.updateMatrixWorld(true);
                bbox.applyMatrix4(this.sIntersect.object.matrixWorld);
                var dragDir = new THREE.Vector3(rotateDir.dragDir.axis == 'x' ? 1 : 0, rotateDir.dragDir.axis == 'y' ? 1 : 0, rotateDir.dragDir.axis == 'z' ? 1 : 0)
                for (var i = 0; i < this.planes.length; i++) {
                    if (this.planes[i].normal.dot(this.sIntersectNormal) == 0 &&
                        this.planes[i].normal.dot(dragDir) == 0 &&
                        this.planes[i].intersectsBox(bbox)) {

                        face = this.planeNames[i];
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
                this.doRotate(face, axis, dir)
            }
        }

    }
    public onMouseUp(event) {
        this.pressed = false;
        this.controls.enabled = true;
    }

    private time = 0;
    public onBlank(event) {
        if (this.moving)
            return
        this.time++
        if (this.time % 2 == 1)
            this.doRotateAPI('F', 90, 200)
        else
            this.doRotateAPI('R', 90, 200)

    }





}
