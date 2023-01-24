class DirectionalLight extends SceneObject
{
    constructor (name, transform, intensity)
    {
        super (name, null, transform, null, false)
        this.intensity = intensity
    }
}

class PointLight extends SceneObject
{
    constructor (name, transform, intensity)
    {
        super (name, null, transform, null, false)  
        this.intensity = intensity
    }
}

class SpotLight extends SceneObject
{
    constructor (name, transform)
    {
        super (name, null, transform, null, false)
        this.intensity = intensity
    }
}





    /*
    constructor (gl, rotation, intensity)
    {
        this.rotation = rotation
        this.intensity = intensity

        this.projection = orthographic(200.0, 0.01, 100.0)
        this.view       = identity()
        this.view       = multiplym(rotate(rotation[0], rotation[1], rotation[2]), this.view)

        let translationRotation =  multiplym(rotate(-rotation[0], -rotation[1], -rotation[2]), identity())
        this.translation = multiplyv([ 0.0, 0.0, 1.0, 0.0 ], translationRotation)
        this.translation = multiplys(this.translation, 40.0)

        this.view      = multiplym(translate(-this.translation[0], -this.translation[1], -this.translation[2]), this.view);

       // this.translation = translation
        this.transform = identity()
        this.transform = multiplym(scale(5.0, 5.0, 5.0), this.transform)
        this.transform = multiplym(translate(this.translation[0] * 10.0, this.translation[1] * 10.0, this.translation[2] * 10.0), this.transform)
        this.primitive = new Primitive(gl, SphereGeometry)
    }

    move (rotation)
    {
        this.view       = identity()
        this.view       = multiplym(rotate(rotation[0], rotation[1], rotation[2]), this.view)

        let translationRotation =  multiplym(rotate(-rotation[0], -rotation[1], -rotation[2]), identity())
        this.translation = multiplyv([ 0.0, 0.0, 1.0, 0.0 ], translationRotation)
        this.translation = multiplys(this.translation, 40.0)

        this.view      = multiplym(translate(-this.translation[0], -this.translation[1], -this.translation[2]), this.view);

        this.transform = identity()
        this.transform = multiplym(scale(5.0, 5.0, 5.0), this.transform)
        this.transform = multiplym(translate(this.translation[0] * 10.0, this.translation[1] * 10.0, this.translation[2] * 10.0), this.transform)
    }
    */