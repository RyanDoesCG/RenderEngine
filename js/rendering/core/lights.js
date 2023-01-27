class DirectionalLight extends SceneObject
{
    constructor (name, transform, intensity)
    {
        super (name, null, transform, null, false)
        this.rotation = transform.rotation
        this.intensity = intensity

        this.projection = orthographic(60.0, 0.1, 32.0)
        this.view       = identity()
        this.view       = multiplym(rotate(transform.rotation[0], transform.rotation[1], transform.rotation[2]), this.view)
        this.view      = multiplym(translate(-transform.translation[0], -transform.translation[1], -transform.translation[2]), this.view);

        this.translation = transform.translation
        this.transform = identity()
        this.transform = multiplym(scale(5.0, 5.0, 5.0), this.transform)
        this.transform = multiplym(translate(this.translation[0] * 10.0, this.translation[1] * 10.0, this.translation[2] * 10.0), this.transform)
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
