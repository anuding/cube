import { Component, OnInit } from '@angular/core';
import * as THREE from 'three'
import Stats from 'stats.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import {FBXLoader} from 'three-fbx-loader'
// var FBXLoadera = require('three-fbx-loader');
@Component({
	selector: 'app-cube101',
	templateUrl: './cube101.component.html',
	styleUrls: ['./cube101.component.scss']
})
export class Cube101Component implements OnInit {
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

	public fpsInterval = 1000 / this.fps
	public last = new Date().getTime()
	private objLoader = new OBJLoader()
	constructor() { }

	ngOnInit() {
		this.cube = new THREE.Mesh(this.geometry, this.material);
		this.camera = new THREE.PerspectiveCamera(75, Cube101Component.width / Cube101Component.height, 0.1, 1000);
		this.renderer.setSize(Cube101Component.width, Cube101Component.height);
		this.scene.add(new THREE.AxesHelper(10));
		this.scene.add(new THREE.GridHelper(10, 10));
		// this.scene.add(this.cube)

		this.stats = new Stats();
		this.stats.showPanel(1);
		document.getElementById('scene').innerHTML = '';
		document.getElementById('scene').appendChild(this.renderer.domElement);
		document.getElementById('scene').appendChild(this.stats.domElement);
		this.camera.position.z = 7;
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);


		this.scene.add(new THREE.AmbientLight(0xcccccc, 2));
		this.scene.updateMatrixWorld();
	
		new MTLLoader()
			.setPath('assets/MagicCube/CubeModels/DDCube/')
			.load('Cube.mtl', materials => {
				materials.preload();
				new OBJLoader()
					.setMaterials(materials)
					.setPath('assets/MagicCube/CubeModels/DDCube/')
					.load('Cube.obj', object => {
						// object.position.y = - 95;
						object.scale.set(1 / 180, 1 / 180, 1 / 180)

						console.log(object)
						this.scene.add(object);
					});
			});
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
			// this.you.rotation.x += 0.01;
			// this.you.rotation.y += 0.01;
			this.cube.rotation.x += 0.01;
			this.cube.rotation.y += 0.01;

			// console.log(this.renderer.info.render)

			this.renderer.render(this.scene, this.camera);

			this.stats.end();

		}

	};



}
