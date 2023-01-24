class VolumetricsPass extends RenderPass
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
            precision lowp sampler3D;
            precision lowp float;
    
            uniform sampler2D WorldPositionTexture;
            uniform sampler2D ShadowTexture;
            uniform sampler3D VolumeTexture;
            uniform sampler2D BlueNoise;
    
            uniform mat4 LightProjection;
            uniform mat4 LightView;
            uniform vec4 CameraPosition;
            uniform float Time;

            uniform float NShadowSamples; // #expose min=1.0 max=128.0 step=1.0 default=1.0
            uniform float NRaySteps;      // #expose min=1.0 max=128.0 step=1.0 default=8.0
    
            in vec2 frag_uvs;
    
            out vec4 out_colour;
    
            float seed = 0.0;
            float random ()
            {
                seed += 0.01;
                return texture(BlueNoise, frag_uvs.xy * 4.0 + vec2(0.0, seed)).r;
    
            }
    
            float ShadowmapLookup (vec4 position, vec4 normal, float blur)
            {
                float s = 0.0;
                for (int i = 0; i < int(NShadowSamples); ++i)
                {
                    vec4 fragPosLightSpace = LightProjection * LightView * (vec4(position.xyz + normal.xyz * (-1.0 + random() * 2.0), 1.0));
                    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
                    projCoords = projCoords * 0.5 + 0.5;
    
                    float x = -1.0 + random() * 2.0;
                    float y = -1.0 + random() * 2.0;
                    vec2 offset = vec2(x, y) * blur;
    
                    vec2 shadowUV = clamp(projCoords.xy + offset, 0.0, 1.0);

                    float closestDepth = texture(ShadowTexture, shadowUV).r; 
                    float currentDepth = projCoords.z;
    
                    float bias = 0.00;
                    float shadow = currentDepth - bias > closestDepth  ? 0.0 : 1.0;
                    s += shadow;
                }
    
                return s / NShadowSamples;
            } 
    
            void main ()
            {
                vec4 Position = texture(WorldPositionTexture, frag_uvs);
                float t = Position.w;
        
                float s = 0.0;
                float step = 10.0 / NRaySteps;
                vec3 origin = CameraPosition.xyz;
                vec3 direction = normalize(Position.xyz - CameraPosition.xyz);
                for (float rayT = 0.0; rayT < t; rayT += step)
                {
                    vec4 position = vec4(origin + direction * rayT, 1.0);
                    float Noise = 1.0; //texture(VolumeTexture, position.xyz * 0.08 + vec3(Time * 0.01, 0.0, Time * 0.01)).r;
                    float shadow = ShadowmapLookup(position, vec4(0.0), 0.00);
                    s += shadow * Noise;
                }
                s /= NRaySteps;
                s = min(s, 1.0);
        
                out_colour = vec4(s, s, s, 1.0);
            }`

        super(context, width, height, VertexSource, FragmentSource)
        
        this.output = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
        this.framebuffer = createFramebuffer(this.gl, [ this.gl.COLOR_ATTACHMENT0 ], [ this.output ])
    }

     Render(ScreenPrimitive, scene, view, inWorldPositionTexture, inShadowTexture, inVolumeTexture, inBlueNoiseTexture, frameID)
     {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

        this.gl.clearColor(0.0, 0.0, 0.0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.ShaderProgram);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inWorldPositionTexture);
        this.gl.uniform1i(this.uniforms.get("WorldPositionTexture").location, 0);
        
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inShadowTexture);
        this.gl.uniform1i(this.uniforms.get("ShadowTexture").location, 1);

        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_3D, inVolumeTexture);
        this.gl.uniform1i(this.uniforms.get("VolumeTexture").location, 2);

        this.gl.activeTexture(this.gl.TEXTURE3);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inBlueNoiseTexture);
        this.gl.uniform1i(this.uniforms.get("BlueNoise").location, 3);

       // this.gl.uniformMatrix4fv(this.uniforms.get("LightProjection").location, false, scene.directionalLight.projection)
       // this.gl.uniformMatrix4fv(this.uniforms.get("LightView").location, false, scene.directionalLight.view)
        this.gl.uniform4fv(this.uniforms.get("CameraPosition").location, view.CameraPosition)
        this.gl.uniform1f(this.uniforms.get("Time").location, frameID)

        this.gl.uniform1f(this.uniforms.get("NShadowSamples").location, this.uniforms.get("NShadowSamples").value)
        this.gl.uniform1f(this.uniforms.get("NRaySteps").location, this.uniforms.get("NRaySteps").value)

        ScreenPrimitive.draw()
     }

     Clear ()
     {
         this.gl.viewport(0, 0, this.width, this.height);
         this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
         this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
         this.gl.clear(this.gl.COLOR_BUFFER_BIT);
     }
}