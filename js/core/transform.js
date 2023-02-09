class Transform 
{
    constructor (scaling, translation, rotation)
    {
        this.scale       = scaling
        this.translation = translation
        this.rotation    = rotation

        this.matrix = identity()
        this.matrix = multiplym(scale(scaling[0], scaling[1], scaling[2]), this.matrix)
        this.matrix = multiplym(rotate(rotation[0], rotation[1], rotation[2]), this.matrix)
        this.matrix = multiplym(translate(translation[0], translation[1], translation[2]), this.matrix)

        this.invMatrix = identity()
        this.invMatrix = multiplym(translate(-translation[0], -translation[1], -translation[2]), this.invMatrix)
        this.invMatrix = multiplym(rotateRev(-rotation[0], -rotation[1], -rotation[2]), this.invMatrix)
        this.invMatrix = multiplym(scale(-scaling[0], -scaling[1], -scaling[2]), this.invMatrix)
    }
}

function Scale       (x, y, z) { return [x, y, z] }
function Translation (x, y, z) { return [x, y, z] }
function Rotation    (x, y, z) { return [x, y, z] }