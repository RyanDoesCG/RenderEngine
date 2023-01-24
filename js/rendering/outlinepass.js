class OutlinePass extends RenderPass
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
             uniform sampler2D IDs;
             uniform float thickness; // #expose min=0.0 max=0.1 step=0.001 default=0.001
             uniform int selected;

             in vec2 frag_uvs;
            
             layout (location = 0) out vec4 out_colour;
             layout (location = 1) out vec4 out_position;
 
             void main ()
             {
                vec2 offsets[8];
                offsets[0] = vec2( 1.0,  0.0);
                offsets[1] = vec2(-1.0,  0.0);
                offsets[2] = vec2( 0.0,  1.0);
                offsets[3] = vec2( 0.0, -1.0);

                offsets[4] = vec2( 1.0,  1.0);
                offsets[5] = vec2(-1.0,  1.0);
                offsets[6] = vec2( 1.0, -1.0);
                offsets[7] = vec2(-1.0, -1.0);

                float SampleDiff = 0.0;
                float IDSample = texture(IDs, frag_uvs).r;

                if (IDSample * 255.0 == float(selected))
                {
                    for (int i = 0; i < 8; ++i)
                    {
                        vec2 offset_uvs = frag_uvs + offsets[i] * thickness;
                        bool isEdge = texture(IDs, offset_uvs).r != IDSample;
                        bool isOffScreen = offset_uvs.x <= 0.0 || offset_uvs.x >= 1.0 || offset_uvs.y <= 0.0 || offset_uvs.y >= 1.0;

                        if (isEdge || isOffScreen)
                        {
                            out_colour = vec4(1.0, 0.8, 0.0, 1.0); 
                            out_position = vec4(0.0, 0.0, 0.0, 0.0);
                            return;
                        }
                    }
                }

                out_colour = vec4(0.0); 
                out_position = vec4(0.0);
            }`

        super(context, width, height, VertexSource, FragmentSource)

      //  this.output = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
      //  this.framebuffer = createFramebuffer(this.gl, [ this.gl.COLOR_ATTACHMENT0 ], [ this.output ])
    }

    Render(ScreenPrimitive, inIDTexture, SelectedObject, framebuffer, toScreen)
    {
        if (toScreen)
        {
            this.gl.viewport(0, 0, this.width, this.height);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }
        else
        {
            this.gl.viewport(0, 0, this.width, this.height);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
            this.gl.drawBuffers([
                this.gl.COLOR_ATTACHMENT0, 
                this.gl.COLOR_ATTACHMENT1 ]);
        }

        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.useProgram(this.ShaderProgram);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inIDTexture);
        this.gl.uniform1i(this.uniforms.get("IDs").location, 1);

        this.gl.uniform1f(this.uniforms.get("thickness").location, this.uniforms.get("thickness").value);
        this.gl.uniform1i(this.uniforms.get("selected").location, SelectedObject)

        ScreenPrimitive.draw()

        this.gl.disable(this.gl.BLEND)
    }
}