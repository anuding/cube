import * as THREE from 'three'
import { VecUtil } from './VecUtil'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export class SimpleCubeHelper {
    static width = 300;
    static height = 300;

    static vecF = new THREE.Vector3(0, 0, 1);
    static vecB = new THREE.Vector3(0, 0, -1)
    static vecL = new THREE.Vector3(1, 0, 0)
    static vecR = new THREE.Vector3(-1, 0, 0)
    static vecU = new THREE.Vector3(0, 1, 0)
    static vecD = new THREE.Vector3(0, -1, 0)

    static originVec;
    static getNormalByFaceName(faceName, CubeScene) {

        switch (faceName) {
            case "F":
                this.originVec = this.vecF
                break;
            case "B":
                this.originVec = this.vecB
                break;
            case "L":
                this.originVec = this.vecL
                break;
            case "R":
                this.originVec = this.vecR
                break;
            case "U":
                this.originVec = this.vecU
                break;
            case "D":
                this.originVec = this.vecD
                break;
        }
        var faceNormal = this.originVec
        // var faceNormal = faceNormal.applyMatrix4(CubeScene.matrixWorld);
        return faceNormal
    }

    static getRotateDir(dragVector, intersectNormal) {
        var dragDir = VecUtil.getMaxCompoent(dragVector)
        var normalDir = VecUtil.getMaxCompoent(intersectNormal)
        return { dragDir: dragDir, normalDir: normalDir }
    }

    static loadModel(mtlPath, objPath) {
        var progress = console.log;
        return new Promise<THREE.Group>(function (resolve, reject) {
            var obj;
            var mtlLoader = new MTLLoader();
            mtlLoader.setPath('assets/MagicCube/CubeModels/DDCube/')
            mtlLoader.load("Cube.mtl", function (materials) {
                materials.preload();
                var objLoader = new OBJLoader()
                objLoader.setMaterials(materials);
                objLoader.setPath('assets/MagicCube/CubeModels/DDCube/');
                objLoader.load("Cube.obj", resolve, progress, reject);
            }, progress, reject)
        })

    }

    static getFace(faceName, cubes) {
        var face = []
        cubes.forEach(cube => {
            if (cube.name.indexOf(faceName) != -1)
                face.push(cube)
        });
        if (face.length != 9) {
            console.log(face)
            throw "face doesn't have correct number of cubes"

        }
        return face;
    }
    static replaceAt(str, index, replacement) {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }
    static orderF = new Map([['U', 'R'], ['R', 'D'], ['D', 'L'], ['L', 'U']])
    static orderB = new Map([['U', 'L'], ['L', 'D'], ['D', 'R'], ['R', 'U']])
    static orderL = new Map([['U', 'F'], ['F', 'D'], ['D', 'B'], ['B', 'U']])
    static orderR = new Map([['U', 'B'], ['B', 'D'], ['D', 'F'], ['F', 'U']])
    static orderU = new Map([['B', 'R'], ['R', 'F'], ['F', 'L'], ['L', 'B']])
    static orderD = new Map([['F', 'R'], ['R', 'B'], ['B', 'L'], ['L', 'F']])
    static order = new Map()
    static renameCubes(faceName, cubes) {

        switch (faceName) {
            case "F":
                this.order = this.orderF
                break;
            case "B":
                this.order = this.orderB
                break;
            case "L":
                this.order = this.orderL
                break;
            case "R":
                this.order = this.orderR
                break;
            case "U":
                this.order = this.orderU
                break;
            case "D":
                this.order = this.orderD
                break;
        }
        cubes.forEach(cube => {
            var name = cube.name
            for (var i = 0; i < name.length; i++) {
                if (this.order.get(name[i])) {
                    name = this.replaceAt(name, i, this.order.get(name[i]))
                }
            }
            cube.name = name
        })
    }
    static getIntersect(event, raycaster, camera, cubes, transparentCube) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / SimpleCubeHelper.width) * 2 - 1;
        mouse.y = -(event.clientY / SimpleCubeHelper.height) * 2 + 1;

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

}