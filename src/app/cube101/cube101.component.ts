import { Component, OnInit } from '@angular/core';
import * as THREE from 'three'
import Stats from 'stats.js'
@Component({
  selector: 'app-cube101',
  templateUrl: './cube101.component.html',
  styleUrls: ['./cube101.component.scss']
})
export class Cube101Component implements OnInit {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  private renderer = new THREE.WebGLRenderer();

  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  private cube;
  private stats;
  public fps = 60
  public fpsInterval = 1000 / this.fps
  public last = new Date().getTime()
  constructor() { }

  ngOnInit() {
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
    this.scene.add(this.cube);
    this.stats = new Stats();
    this.stats.showPanel(1);
    document.getElementById('scene').innerHTML = '';
    document.getElementById('scene').appendChild(this.renderer.domElement);
    document.getElementById('scene').appendChild(this.stats.domElement);
    this.camera.position.z = 5;
    this.animate();
  }
  public animate() {
    requestAnimationFrame(this.animate.bind(this));
    // 执行时的时间
    var now = new Date().getTime()
    var elapsed = now - this.last;
    // 经过了足够的时间
    if (elapsed > this.fpsInterval) {
      this.last = now - (elapsed % this.fpsInterval); //校正当前时间

      this.stats.begin();

      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);

      this.stats.end();

    }

  };



}
