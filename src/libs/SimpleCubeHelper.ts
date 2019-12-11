import * as THREE from 'three'
import { VecUtil } from './VecUtil'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';


export class SimpleCubeHelper {
    static width = 300;
    static height = 300;

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

    static getFace(scene, face, cubes, planeNames, planes) {
        var plane;
        for (var i = 0; i < planeNames.length; i++) {
            if (face == planeNames[i]) {
                plane = planes[i]
                break;
            }
        }
        var faces = []
        console.log(scene)
        scene.children.forEach(o => {
            if (o instanceof THREE.BoxHelper)
                scene.remove(o)
            if (o instanceof THREE.PlaneHelper)
                scene.remove(o)
        })

        var mat = scene.getObjectByName("sceneControl")
        console.log(mat)
        var afterPlane = plane.clone().applyMatrix4(mat.matrixWorld)

        scene.add(new THREE.PlaneHelper(afterPlane, 5, 0xffff00))
        cubes.forEach(cube => {
            var bbox;
            if (cube instanceof THREE.Mesh) {
                cube.geometry.computeBoundingBox();
                bbox = cube.geometry.boundingBox.clone();
            }
            if (cube instanceof THREE.Group) {
                bbox = new THREE.Box3().setFromObject(cube);

            }
            cube.updateMatrixWorld(true);
            // bbox.applyMatrix4(cube.matrixWorld);
            if (afterPlane.intersectsBox(bbox)) {
                faces.push(cube)
                scene.add(new THREE.BoxHelper(cube, new THREE.Color('red')))
            }
        })
        return {faces:faces,normal:afterPlane.normal}
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