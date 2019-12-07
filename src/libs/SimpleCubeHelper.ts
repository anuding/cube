import * as THREE from 'three'
import {VecUtil} from './VecUtil'

export class SimpleCubeHelper {
     static width = 300;
     static height = 300;

    static getRotateDir(dragVector, intersectNormal) {
        var dragDir = VecUtil.getMaxCompoent(dragVector)
        var normalDir = VecUtil.getMaxCompoent(intersectNormal)
        return { dragDir: dragDir, normalDir: normalDir }
    }

    
    static getFace(face, cubes, planeNames,planes) {
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
    static getIntersect(event,raycaster,camera,cubes,transparentCube) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX /SimpleCubeHelper.width) * 2 - 1;
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