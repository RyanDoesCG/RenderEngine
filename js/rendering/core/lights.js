class DirectionalLight extends SceneObject
{
    constructor (name, transform, intensity)
    {
        super (name, null, transform, null, false)
        this.rotation = transform.rotation
        this.intensity = intensity

        this.transform = transform

        this.view       = identity()
        this.view       = multiplym(rotate(transform.rotation[0], transform.rotation[1], transform.rotation[2]), this.view)
        this.view       = multiplym(translate(-transform.translation[0], -transform.translation[1], -transform.translation[2]), this.view);

        this.projection = orthographic(80.0, 0.01, 32.0)
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
