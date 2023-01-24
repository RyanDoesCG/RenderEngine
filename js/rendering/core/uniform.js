class Uniform
{
    constructor(name, type, location, exposed)
    {
        this.name = name
        this.type = type
        this.location = location
        this.exposed = exposed
    }
}

class UniformFloat extends Uniform
{
    constructor(name, type, location, exposed, min, max, step, value)
    {
        super (name, type, location, exposed)
        this.min = min
        this.max = max
        this.step = step
        this.value = value
    }
}