export class VecUtil {
    
    static getMaxCompoent(vec3) {
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
}