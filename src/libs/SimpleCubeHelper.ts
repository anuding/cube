import * as THREE from 'three'
import { VecUtil } from './VecUtil'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export class SimpleCubeHelper {
    static width = 300;
    static height = 300;

    static getNormalByFaceName(faceName, CubeScene) {
        var originVec;
        switch (faceName) {
            case "F":
                originVec = new THREE.Vector3(0, 0, 1)
                break;
        }
        var faceNormal = originVec.applyMatrix4(CubeScene.matrixWorld);
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
        console.log(cubes)
        var face = []
        cubes.forEach(cube => {
            if (cube.name.split('_')[1] == faceName)
                face.push(cube)
        });
        if (face.length != 9)
            throw "face doesn't have correct number of cubes"
        return face;
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