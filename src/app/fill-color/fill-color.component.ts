import { Component, OnInit } from '@angular/core';
import * as THREE from 'three'
import Stats from 'stats.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ColorPickerService, Cmyk } from 'ngx-color-picker';

@Component({
  selector: 'app-fill-color',
  templateUrl: './fill-color.component.html',
  styleUrls: ['./fill-color.component.scss']
})
export class FillColorComponent implements OnInit {
  private scene = new THREE.Scene();

  private renderer = new THREE.WebGLRenderer({ antialias: true });
  private controls;

  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  private cube;
  private you;

  private stats;
  public fps = 60
  // static width = window.innerWidth;
  // static height = window.innerHeight;
  static width = 500
  static height = 500;
  private camera;
  private raycaster;
  public fpsInterval = 1000 / this.fps
  private newmat;
  private cpService = new ColorPickerService();
  public last = new Date().getTime()
  private objLoader = new OBJLoader()
  constructor() { }

  ngOnInit() {
    this.raycaster = new THREE.Raycaster()
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.camera = new THREE.PerspectiveCamera(75, FillColorComponent.width / FillColorComponent.height, 0.1, 1000);
    this.renderer.setSize(FillColorComponent.width, FillColorComponent.height);
    this.scene.add(new THREE.AxesHelper(10));
    this.scene.add(new THREE.GridHelper(10, 10));
    // this.scene.add(this.cube)

    this.stats = new Stats();
    this.stats.showPanel(1);
    document.getElementById('scene').innerHTML = '';
    document.getElementById('scene').appendChild(this.renderer.domElement);
    // document.getElementById('scene').appendChild(this.stats.domElement);
    document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    this.camera.position.z = 7;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);


    this.scene.add(new THREE.AmbientLight(0xcccccc, 2));
    this.scene.updateMatrixWorld();

    var texture = new THREE.TextureLoader().load("assets/MagicCube/CubeModels/DDCube/white.png");
    this.newmat = new THREE.MeshLambertMaterial({
      map: texture
    });
    new MTLLoader()
      .setPath('assets/MagicCube/CubeModels/DDCube/')
      .load('Cube.mtl', materials => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath('assets/MagicCube/CubeModels/DDCube/')
          .load('Cube.obj', object => {
            // object.position.y = - 95;
            object.name = "obj"
            object.scale.set(1 / 180, 1 / 180, 1 / 180)
            this.scene.add(object);
          });
      });
    this.animate();
  }
  public animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.stats.begin();
    // this.you.rotation.x += 0.01;
    // this.you.rotation.y += 0.01;
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  };

  public onMouseDown(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / FillColorComponent.width) * 2 - 1;
    mouse.y = -(event.clientY / FillColorComponent.height) * 2 + 1;

    this.raycaster.setFromCamera(mouse, this.camera);

    var intersectCube = null, normal = null;

    var intersects = this.raycaster.intersectObjects(this.scene.getObjectByName("obj").children);
    if (intersects.length >= 1) {
      intersectCube = intersects[0];
      var color = this.cpService.hsvaToRgba(this.cpService.stringToHsva(this.color16, true));
      this.newmat.color.r = 0.58*color.r;
      this.newmat.color.g = 0.58*color.g;
      this.newmat.color.b = 0.58*color.b;
      this.newmat.color.a = 0.58*color.a;

      intersectCube.object.material = this.newmat.clone()
    }
  }
  public color16: string = '#ffffffff';
  public onChangeColorHex8(color: string): string {
    const hsva = this.cpService.stringToHsva(color, true);

    if (hsva) {
      return this.cpService.outputFormat(hsva, 'rgba', null);
    }

    return '';
  }

}
