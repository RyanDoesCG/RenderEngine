class ShadowPass extends RenderPass
{
    constructor(context, width, height)
    {
        const VertexSource = 
           `#version 300 es

            precision lowp float;

            uniform mat4 Projection;
            uniform mat4 View;
            uniform mat4 Transform;

            in vec3 vertex_position;
            in vec3 vertex_normal;
            in vec2 vertex_uv;

            void main ()
            {
                gl_Position = Projection * View * Transform * vec4(vertex_position, 1.0);
            }`

        const FragmentSource = 
           `#version 300 es
            precision lowp float;
            void main()
            {

            }`

        super(context, width, height, VertexSource, FragmentSource)

        this.output = createDepthTexture(this.gl, this.width, this.height)
        this.framebuffer = createFramebuffer(this.gl, [ this.gl.DEPTH_ATTACHMENT ], [ this.output ])
    }

    Render(scene)
    {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

        this.gl.clearColor(0.0, 0.0, 0.0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(this.ShaderProgram);

        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.enable(this.gl.CULL_FACE)
        this.gl.cullFace(this.gl.FRONT)

      //  this.gl.uniformMatrix4fv(this.uniforms.get("Projection").location, false, scene.directionalLight.projection)
      //  this.gl.uniformMatrix4fv(this.uniforms.get("View").location, false, scene.directionalLight.view)

        for (var i = 0; i < scene.objects.length; ++i)
        {
            if (scene.objects[i].primitive != null)
            {
                if (!scene.objects[i].editorOnly)
                {
                    this.gl.uniformMatrix4fv(this.uniforms.get("Transform").location, false, scene.objects[i].transform.matrix)
                    scene.objects[i].primitive.draw()
                }
            }
        }

        this.gl.disable(this.gl.DEPTH_TEST)
        this.gl.disable(this.gl.CULL_FACE)
    }

    Clear ()
    {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    }
}