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
    private pivot = new THREE.Object3D()

    private moving = false;

    public start() {
        this.render()
    }

    constructor() {
        this.initApp();
        this.initScene();
    }


    private initApp() {
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

        // document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
        // document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        // document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
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
        setTimeout(() => {
            this.pressed = true;
        }, 500);
    }

    private actionQueue = new ActionQueue();
    public doRotateAPI(faceName, degree, duration) {
        var action = { faceName: faceName, degree: degree, duration: duration };
        this.actionQueue.enqueue(action);
    }

    private faces;
    private normal;
    private targetQuaternion = new THREE.Quaternion();
    public doRotate(faceName, degree, duration) {
        if (!this.moving) {
            console.log(faceName)
            this.faces = Helper.getFace(faceName, this.cubes)
        }
        this.moving = true;
        this.normal = Helper.getNormalByFaceName(faceName, this.SimpleCubeScene)

        this.targetQuaternion.setFromAxisAngle(this.normal, Math.PI / 2);
        // console.log(THREE.Math.radToDeg(this.pivot.quaternion.angleTo(this.targetQuaternion)))

        if (THREE.Math.radToDeg(this.pivot.quaternion.angleTo(this.targetQuaternion)) > 0) {
            this.pivot.updateMatrixWorld();
            var active = []
            this.faces.forEach(f => { active.push(f) })
            active.forEach(f => { this.pivot.attach(f) })
            this.pivot.quaternion.slerp(this.targetQuaternion, 0.1);
            if (THREE.Math.radToDeg(this.pivot.quaternion.angleTo(this.targetQuaternion)) < 15) {
                this.pivot.quaternion.slerp(this.targetQuaternion, 1);
            }
            this.pivot.updateMatrixWorld();
            active.forEach(f => { this.SimpleCubeScene.attach(f) })
            // requestAnimationFrame(this.doRotate.bind(this, faceName, degree, duration));
        }
        else {
            //the rotation is over, should change name for every cube of this face
            Helper.renameCubes(faceName, this.faces)
            //update rotating status
            this.holdAction = false;
            this.moving = false;
            setTimeout(() => {
                this.pressed = true;
            }, 500);

        }

    }

    private currentAction;
    private holdAction = false;
    private render() {

        this.SimpleCubeScene.rotation.x += 0.01
        this.SimpleCubeScene.rotation.z += 0.01
        if (!this.actionQueue.isEmpty() && !this.holdAction && this.pressed) {
            this.currentAction = this.actionQueue.getFront();
            this.actionQueue.dequeue();
            this.holdAction = true;
            this.pressed = false;
        }
        if (this.holdAction) {
            this.doRotate(this.currentAction.faceName, this.currentAction.degree, this.currentAction.duration)
        }
        requestAnimationFrame(this.render.bind(this));
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }



    private pressed = false;
    public onBlank(event) {
        
    }
}
