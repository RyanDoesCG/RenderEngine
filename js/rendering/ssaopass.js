class SSAOPass extends RenderPass
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

            uniform sampler2D BlueNoise;
            uniform sampler2D Depth;
            uniform float near;
            uniform float far;

            uniform float Radius;    // #expose min=0.001 max=0.1  step=0.001 default=0.083
            uniform float Intensity; // #expose min=0.001 max=10.0 step=0.01  default=0.831
            uniform float Cutoff;    // #expose min=0.0 max=100.0 step=0.1 default=100.0

            in vec2 frag_uvs;

            out vec4 out_colour;

            float LinearizeDepth (float d)
            {
                float z = d * 2.0 - 1.0; //  NDC 
                return (2.0 * near * far) / (far + near - z * (far - near));
            }

            float seedx = 0.0;
            float seedy = 0.0;
            float factor = 1.0;
            float random ()
            {
                seedx += 0.011242 * factor;
                seedy += 0.009425 * factor;
                //factor *= -1.0;
                return texture(BlueNoise, (frag_uvs.xy + vec2(seedx, seedy)) * 4.0).x;
            }

            void main ()
            {
                float NSamples = 16.0;
                float AO = 0.0;
                float thisDepth = LinearizeDepth(texture(Depth, frag_uvs).r);
                for (int i = 0; i < int(NSamples); ++ i)
                {

                    vec2  offsetUVs = frag_uvs + vec2(
                        -1.0 + random() * 2.0,
                        -1.0 + random() * 2.0) * Radius;

                    float sampleDepth = LinearizeDepth(texture(Depth, offsetUVs).r);
                    if (sampleDepth < thisDepth)
                    {
                        float depthDiff = abs(thisDepth - sampleDepth);
                        if (depthDiff < Cutoff)
                        {
                            AO += 1.0;  
                        } 
                    }
                }

                AO /= NSamples;

                out_colour = vec4(1.0 - vec3(AO * Intensity), 1.0);
            }`

        super(context, width, height, VertexSource, FragmentSource)

        this.output = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
        this.framebuffer = createFramebuffer(this.gl, [ this.gl.COLOR_ATTACHMENT0 ], [ this.output ])
    }

    Render(ScreenPrimitive, inBlueNoise, inDepthTexture, near, far, toScreen)
    {
        if (toScreen)
        {
            this.gl.viewport(0, 0, this.width, this.height);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }
        else
        {

            this.gl.viewport(0, 0, this.width, this.height);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.ShaderProgram);

        this.gl.uniform1f(this.uniforms.get("near").location, near);
        this.gl.uniform1f(this.uniforms.get("far").location, far);
        this.gl.uniform1f(this.uniforms.get("Radius").location, this.uniforms.get("Radius").value)
        this.gl.uniform1f(this.uniforms.get("Intensity").location, this.uniforms.get("Intensity").value)
        this.gl.uniform1f(this.uniforms.get("Cutoff").location, this.uniforms.get("Cutoff").value)

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inDepthTexture);
        this.gl.uniform1i(this.uniforms.get("Depth").location, 0);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inBlueNoise);
        this.gl.uniform1i(this.uniforms.get("BlueNoise").location, 1);

        ScreenPrimitive.draw()
    }

    Clear ()
    {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}