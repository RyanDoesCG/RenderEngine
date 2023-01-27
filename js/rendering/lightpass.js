class LightPass extends RenderPass
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

            uniform sampler2D AlbedoTexture;
            uniform sampler2D NormalTexture;
            uniform sampler2D PositionTexture;
            uniform sampler2D BlueNoise;
            uniform sampler2D AOTexture;
            uniform sampler2D ShadowTexture;
            uniform sampler2D VolumetricsTexture;
            uniform float     Time;

            uniform vec3 DirectionalLightPosition;
            uniform mat4 DirectionalLightProjection;
            uniform mat4 DirectionalLightView;
            uniform vec4 CameraPosition;
            uniform float ShadowBias; // #expose min=-0.1 max=0.1 step=0.0001 default=-0.01
            uniform float ShadowSoftness; // #expose min=0.0 max=0.25 step=0.0001 defaults=0.0025
        
            in vec2 frag_uvs;
            
            layout (location = 0) out vec4 out_colour;
            layout (location = 1) out vec4 out_position;

            uniform int Fog;
            #define FOG_COLOUR vec4(0.3, 0.3, 0.3, 1.0)
            #define FOG_DISTANCE 200.0

            float seed = 0.0;
            float random ()
            {
               // return texture(BlueNoise, vec3(frag_uvs.xy, 0.0)).x;
                return texture(BlueNoise, (frag_uvs.xy + vec2(seed, seed)) * 4.0).x;
            }

            float ShadowmapLookup (vec4 position, vec4 normal, float blur)
            {
                vec4 fragPosLightSpace = DirectionalLightProjection * DirectionalLightView * (vec4(position.xyz, 1.0));
                vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
                projCoords = projCoords * 0.5 + 0.5;

                vec2 shadowUV = projCoords.xy;

                float xOffset = ShadowSoftness;
                float yOffset = ShadowSoftness;
                float Factor = 0.0;

                for (int y = -1 ; y <= 1 ; y++) {
                    for (int x = -1 ; x <= 1 ; x++) {
                        vec2 Offsets = vec2(float(x) * xOffset, float(y) * yOffset);
                        vec3 UVC = vec3(shadowUV + Offsets, projCoords.z + 0.0001);
                        Factor += texture(ShadowTexture, UVC.xy).r;
                    }
                }
            
                return (0.5 + (Factor / 18.0));

                /*
                float closestDepth = texture(ShadowTexture, shadowUV).r; 
                float currentDepth = projCoords.z;

                float bias =  ShadowBias;
                float shadow = currentDepth - bias > closestDepth  ? 0.0 : 1.0;
                return shadow;
                */
            } 

            void main ()
            {
                vec4 Albedo = texture(AlbedoTexture, frag_uvs);
                vec4 Normal = vec4(-1.0) + texture(NormalTexture, frag_uvs) * 2.0;
                vec4 Position = texture(PositionTexture, frag_uvs);

                vec4 ShadingResult = vec4(0.0);

                vec3 n = Normal.xyz;
                vec3 l = normalize(DirectionalLightPosition.xyz - Position.xyz);

                float ambient = 0.1;
                float diffuse = max(0.0, dot(n, l));
                ShadingResult += Albedo * diffuse + ambient;

                float shadow = ShadowmapLookup(Position, Normal, ShadowSoftness);
                ShadingResult *= shadow;

                float ao = texture(AOTexture, frag_uvs).r;
                ShadingResult *= ao;

                out_colour = ShadingResult;
                out_position = texture(PositionTexture, frag_uvs);
            }`

        super(context, width, height, VertexSource, FragmentSource)
    }

    Render (ScreenPrimitive, scene, view, framebuffer, inAlbedoTexture, inNormalTexture, inPositionTexture, inBlueNoise, inAO, inShadows, inVolumetrics, time, fog, toScreen)
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

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.ShaderProgram);

        this.gl.uniform1i(this.uniforms.get("AlbedoTexture").location, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inAlbedoTexture);

        this.gl.uniform1i(this.uniforms.get("NormalTexture").location, 1);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inNormalTexture);

        this.gl.uniform1i(this.uniforms.get("PositionTexture").location, 2);
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inPositionTexture);

        this.gl.activeTexture(this.gl.TEXTURE3);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inBlueNoise);
        this.gl.uniform1i(this.uniforms.get("BlueNoise").location, 3);

        this.gl.uniform1i(this.uniforms.get("AOTexture").location, 4);
        this.gl.activeTexture(this.gl.TEXTURE4);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inAO);

        this.gl.uniform1i(this.uniforms.get("ShadowTexture").location, 5);
        this.gl.activeTexture(this.gl.TEXTURE5);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inShadows);

        this.gl.uniform1i(this.uniforms.get("VolumetricsTexture").location, 6);
        this.gl.activeTexture(this.gl.TEXTURE6);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inVolumetrics);

        if (scene.directionalLight)
        {
            this.gl.uniform3fv(this.uniforms.get("DirectionalLightPosition").location, scene.directionalLight.transform.translation)
            this.gl.uniformMatrix4fv(this.uniforms.get("DirectionalLightProjection").location, false, scene.directionalLight.projection)
            this.gl.uniformMatrix4fv(this.uniforms.get("DirectionalLightView").location, false, scene.directionalLight.view)
        }

        this.gl.uniform4fv(this.uniforms.get("CameraPosition").location, view.CameraPosition)

        this.gl.uniform1i(this.uniforms.get("Fog").location, fog? 1 : 0);

        this.gl.uniform1f(this.uniforms.get("ShadowBias").location, this.uniforms.get("ShadowBias").value)
        this.gl.uniform1f(this.uniforms.get("ShadowSoftness").location, this.uniforms.get("ShadowSoftness").value)


        ScreenPrimitive.draw()
    }
}


            /*
            {
                // DEBUG
                out_colour = texture(NormalTexture, frag_uvs);
                out_position = texture(PositionTexture, frag_uvs);
                return;
                // DEBUG

                vec4 Albedo = texture(AlbedoTexture, frag_uvs);
                vec4 Normal = vec4(-1.0) + texture(NormalTexture, frag_uvs) * 2.0;
                vec4 Position = texture(PositionTexture, frag_uvs);

                out_colour = Albedo;

                if (Position.w > 0.0)
                {
                    if (!(Albedo.r == 1.0) )
                    {
                        // Diffuse
                        float Hardness = 0.5;
                        vec3 n = Normal.xyz;
                        vec3 l = normalize(LightPosition.xyz - Position.xyz);
                        float d = max(0.0, dot(n, l) + random());
                        out_colour *= d * Hardness + 1.0 - Hardness;

                        // Ambient Occlusion
                        float AO = texture(AOTexture, frag_uvs).r;
                        out_colour *= AO;

                        // Shadows
                        float shadow = ShadowmapLookup(Position, Normal, ShadowSoftness);
                        float ambient = 0.32;
                        out_colour *= ambient + shadow;
                    }
                }

                if (Fog == 1)
                {
                    float t = Position.w; 
                    if (t == 0.0) 
                    { 
                        t = 10000.0; 
                    }

                    t = t + random() * 10.0;

                    // linear fog
                    float f = clamp(0.0, FOG_DISTANCE, t) / FOG_DISTANCE;
                    f = min(f, 0.96);
                
                    // volumetric fog
                    float s = texture(VolumetricsTexture, frag_uvs).r;
                    s *= 0.96 - f;   
                    
                    out_colour = mix(out_colour, FOG_COLOUR, f) + s * 0.3;
                }

                out_position = Position;
            }
            */



            /*
                float NSamples = 4.0;
                float s = 0.0;
                for (int i = 0; i < int(NSamples); ++i)
                {
                    vec4 fragPosLightSpace = DirectionalLightProjection * DirectionalLightView * (vec4(position.xyz, 1.0));
                    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
                    projCoords = projCoords * 0.5 + 0.5;

                    float x = -1.0 + random() * 2.0;
                    float y = -1.0 + random() * 2.0;
                    vec2 offset = vec2(x, y) * blur;

                    vec2 shadowUV = projCoords.xy + offset;

                    float closestDepth = texture(ShadowTexture, shadowUV).r; 
                    float currentDepth = projCoords.z;

                    float bias =  ShadowBias;
                    float shadow = currentDepth - bias > closestDepth  ? 0.0 : 1.0;
                    s += shadow;
                }

                return s / NSamples;
             */