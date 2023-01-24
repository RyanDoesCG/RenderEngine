class FogPass extends RenderPass
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

            uniform sampler2D SceneTexture;
            uniform sampler2D PositionTexture;
            uniform sampler2D BlueNoise;
            uniform sampler2D ShadowTexture;
            uniform float Time;

            uniform float FogDistance; // #expose min=0.0 max=1000.0  step=1.0 default=200.0
            uniform float FogFalloff;  // #expose min=0.01 max=20.0 step=0.001 default=1.0
            uniform float FogMax;      // #expose min=0.0 max=1.0  step=0.01 default=0.96

            #define FOG_COLOUR vec4(0.3, 0.3, 0.3, 1.0)

            in vec2 frag_uvs;
            out vec4 out_colour;

            float random ()
            {
                return -1.0 + texture(BlueNoise, frag_uvs * 2.0).r * 2.0;
            }

            void main()
            {
                vec4 Scene = texture(SceneTexture, frag_uvs);
                vec4 Position = texture(PositionTexture, frag_uvs);
                float t = Position.w;

                if (t == 0.0)
                {
                    t = FogDistance;
                }

                float linearFog = clamp(0.0, FogDistance, t) / FogDistance;
                linearFog = min(pow(linearFog, FogFalloff), FogMax);

                out_colour = mix(Scene, FOG_COLOUR, linearFog);
            }`

        super(context, width, height, VertexSource, FragmentSource)

        this.output = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
        this.framebuffer = createFramebuffer(this.gl, [this.gl.COLOR_ATTACHMENT0], [this.output])
    }

    Render (ScreenPrimitive, scene, view, inSceneTexture, inPositionTexture, inShadowTexture, BlueNoise, time, toScreen)
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

        this.gl.uniform1f(this.uniforms.get("Time").location, time)

        this.gl.uniform1f(this.uniforms.get("FogDistance").location, this.uniforms.get("FogDistance").value)
        this.gl.uniform1f(this.uniforms.get("FogFalloff").location, this.uniforms.get("FogFalloff").value)
        this.gl.uniform1f(this.uniforms.get("FogMax").location, this.uniforms.get("FogMax").value)

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inSceneTexture);
        this.gl.uniform1i(this.uniforms.get("SceneTexture").location, 0);
        
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inPositionTexture);
        this.gl.uniform1i(this.uniforms.get("PositionTexture").location, 1);

        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, BlueNoise);
        this.gl.uniform1i(this.uniforms.get("BlueNoise").location, 2);

        this.gl.activeTexture(this.gl.TEXTURE3);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inShadowTexture);
        this.gl.uniform1i(this.uniforms.get("ShadowTexture").location, 3);

        ScreenPrimitive.draw() 
    }
}