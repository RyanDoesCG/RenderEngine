class RenderPass
{
    constructor(context, width, height, vertexSource, fragmentSource)
    {
        this.gl = context
        this.width = width
        this.height = height

        this.VertexShaderSource = vertexSource
        this.FragmentShaderSource = fragmentSource
        this.ShaderProgram = createProgram(this.gl,
            createShader(this.gl, this.gl.VERTEX_SHADER,   this.VertexShaderSource),
            createShader(this.gl, this.gl.FRAGMENT_SHADER, this.FragmentShaderSource))

        this.uniforms = extractUniforms(this.VertexShaderSource, this.FragmentShaderSource)
        for (const [name, uniform] of this.uniforms.entries())
        {
            uniform.location = this.gl.getUniformLocation(this.ShaderProgram, name)
        }

        this.on = true;
    }

    toggle()
    {
        this.on = !this.on
    }

    active()
    {
        return this.on
    }
}

class SubPass
{
    constructor(context, width, height, vertexSource, fragmentSource)
    {
        this.gl = context
        this.width = width
        this.height = height

        this.VertexShaderSource = vertexSource
        this.FragmentShaderSource = fragmentSource
        this.ShaderProgram = createProgram(this.gl,
            createShader(this.gl, this.gl.VERTEX_SHADER,   this.VertexShaderSource),
            createShader(this.gl, this.gl.FRAGMENT_SHADER, this.FragmentShaderSource))
        
        this.uniforms = extractUniforms(this.VertexShaderSource, this.FragmentShaderSource)
        for (const [name, uniform] of this.uniforms.entries())
        {
            uniform.location = this.gl.getUniformLocation(this.ShaderProgram, name)
        }
    }
}

class BasePass
{
    constructor(context, width, height)
    {
        this.gl = context
        this.width = width
        this.height = height
    }
}