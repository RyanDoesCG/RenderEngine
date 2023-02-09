class TonemappingPass extends RenderPass
{
    constructor(context, width, height)
    {
        const VertexSource =
           `#version 300 es
            precision lowp float;
            in vec3 vertex_position;
            in vec3 vertex_normal;
            in vec2 vertex_uvs;
            out vec2 frag_uvs;
            void main() 
            {
                gl_Position = vec4(vertex_position, 1.0);
                frag_uvs = vertex_uvs;
            }`
        const FragmentSource = 
            `#version 300 es
            precision lowp float;
 
            uniform sampler2D Scene;

            uniform float Gamma; // #expose min=0.0 max=10.0 step=0.1 default=0.8
            uniform float Gain;  // #expose min=0.0 max=10.0 step=0.1 default=2.2

            in vec2 frag_uvs;
            
            layout (location = 0) out vec4 out_colour;

            void main ()
            {
                out_colour.rgb = pow(texture(Scene, frag_uvs).rgb, vec3(1.0/Gamma)) * Gain;
                out_colour.a = 1.0;
            }`
        super(context, width, height, VertexSource, FragmentSource)
    }

    Render(ScreenPrimitive, inSceneTexture)
    {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.gl.useProgram(this.ShaderProgram);

        this.gl.uniform1f(this.uniforms.get("Gamma").location, this.uniforms.get("Gamma").value)
        this.gl.uniform1f(this.uniforms.get("Gain").location, this.uniforms.get("Gain").value)

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inSceneTexture);
        this.gl.uniform1i(this.uniforms.get("Scene").location, 0);

        ScreenPrimitive.draw()
    }
}