class TAAPass extends RenderPass
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

            #define NFrames 15

            uniform sampler2D Frames[NFrames];
            uniform sampler2D WorldPositionBuffer;
            uniform mat4      View0;
            uniform mat4      View1;
            uniform mat4      View2;
            uniform mat4      View3;
            uniform mat4      View4;
            uniform mat4      View5;
            uniform mat4      View6;
            uniform mat4      View7;
            uniform mat4      View8;
            uniform mat4      View9;
            uniform mat4      View10;
            uniform mat4      View11;
            uniform mat4      View12;
            uniform mat4      View13;
            uniform mat4      View14;


            uniform vec2 WindowSize;

            uniform float CopyAAFrame; // #expose min=0 max=1 step=1 default=1

            in vec2 frag_uvs;

            layout (location = 0) out vec4 out_color;
            layout (location = 1) out vec4 out_bloom;

            bool shouldRejectSample (vec2 uv)
            {
            bool inRange = uv.x < 1.0 && uv.x > 0.0 && uv.y < 1.0 && uv.y > 0.0;
            bool farFromCurrentPixelSS = length(uv - frag_uvs) > 0.1;
            return !inRange || farFromCurrentPixelSS;
            }

            void main() 
            {
                vec4 Result = vec4(0.0, 0.0, 0.0, 1.0);

                vec4 position = texture(WorldPositionBuffer, frag_uvs);
                position.w = 1.0;

                float samples = 0.0;

                vec4 pl = position;
                vec2 uv = frag_uvs;
                Result += texture(Frames[0], uv);
                samples += 1.0;

                pl = View1 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[1],  uv);
                    samples += 1.0;
                }

                pl = View2 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[2],  uv);
                    samples += 1.0;
                }

                pl = View3 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[3],  uv);
                    samples += 1.0;
                }

                pl = View4 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[4],  uv);
                    samples += 1.0;
                }

                pl = View5 * position;
                uv = (0.5 * (pl.xy / pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[5],  uv);
                    samples += 1.0;
                }

                pl = View6 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[6],  uv);
                    samples += 1.0;
                }

                pl = View7 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[7],  uv);
                    samples += 1.0;
                }
                
                pl = View8 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[8],  uv);
                    samples += 1.0;
                }

                pl = View9 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[9],  uv);
                    samples += 1.0;
                }

                pl = View10 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[10],  uv);
                    samples += 1.0;
                }

                pl = View11 * position;
                uv = (0.5 * (pl.xy / pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[11],  uv);
                    samples += 1.0;
                }

                pl = View12 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[12],  uv);
                    samples += 1.0;
                }

                pl = View13 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[13],  uv);
                    samples += 1.0;
                }

                pl = View14 * position;
                uv = (0.5 * (pl.xy/ pl.w) + 0.5);
                if (!shouldRejectSample(uv))
                {
                    Result += texture(Frames[14],  uv);
                    samples += 1.0;
                }

                out_color = vec4(Result.xyz / samples, 1.0);

                ivec2 frag_uvs_int = ivec2(frag_uvs * WindowSize);

                vec4 NeighbourMin = vec4(1.0);
                vec4 NeighbourMax = vec4(0.0);

                vec4 Neighbour0 = texelFetch(Frames[0], frag_uvs_int + ivec2(0, 1), 0);
                NeighbourMin = min(NeighbourMin, Neighbour0);
                NeighbourMax = max(NeighbourMax, Neighbour0);

                vec4 Neighbour1 = texelFetch(Frames[0], frag_uvs_int + ivec2(0, -1), 0);
                NeighbourMin = min(NeighbourMin, Neighbour1);
                NeighbourMax = max(NeighbourMax, Neighbour1);

                vec4 Neighbour2 = texelFetch(Frames[0], frag_uvs_int + ivec2(1, 0), 0);
                NeighbourMin = min(NeighbourMin, Neighbour2);
                NeighbourMax = max(NeighbourMax, Neighbour2);

                vec4 Neighbour3 = texelFetch(Frames[0], frag_uvs_int + ivec2(-1, 0), 0);
                NeighbourMin = min(NeighbourMin, Neighbour3);
                NeighbourMax = max(NeighbourMax, Neighbour3);

                out_color.xyz = clamp(out_color.xyz, NeighbourMin.xyz, NeighbourMax.xyz);

                if (out_color.x > 0.9 || out_color.y > 0.9 || out_color.z > 0.9)
                {
                    out_bloom = out_color;
                }
            }`

        super(context, width, height, VertexSource, FragmentSource)

        this.outputColour = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
        this.outputBloom  = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA32F, this.gl.FLOAT)

        this.framebuffer = createFramebuffer(this.gl, 
            [ this.gl.COLOR_ATTACHMENT0, this.gl.COLOR_ATTACHMENT1 ],
            [ this.outputColour, this.outputBloom ])

        this.colorFramebuffer = createFramebuffer(this.gl,
            [ this.gl.COLOR_ATTACHMENT0 ],
            [ this.outputColour ])
    }

    Render(ScreenPrimitive, inLightingBuffers, inWorldPositionBuffers, Views, WindowSize, toScreen)
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
            this.gl.drawBuffers([
                this.gl.COLOR_ATTACHMENT0, 
                this.gl.COLOR_ATTACHMENT1]);
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.ShaderProgram);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[0]);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[1]);
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[2]);
        this.gl.activeTexture(this.gl.TEXTURE3);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[3]);
        this.gl.activeTexture(this.gl.TEXTURE4);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[4]);
        this.gl.activeTexture(this.gl.TEXTURE5);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[5]);
        this.gl.activeTexture(this.gl.TEXTURE6);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[6]);
        this.gl.activeTexture(this.gl.TEXTURE7);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[7]);
        this.gl.activeTexture(this.gl.TEXTURE8);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[8]);
        this.gl.activeTexture(this.gl.TEXTURE9);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[9]);
        this.gl.activeTexture(this.gl.TEXTURE10);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[10]);
        this.gl.activeTexture(this.gl.TEXTURE11);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[11]);
        this.gl.activeTexture(this.gl.TEXTURE12);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[12]);
        this.gl.activeTexture(this.gl.TEXTURE13);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[13]);
        this.gl.activeTexture(this.gl.TEXTURE14);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[14]);

        this.gl.uniform1iv(this.uniforms.get("Frames").location, [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ])

        this.gl.activeTexture(this.gl.TEXTURE15);
        this.gl.bindTexture(this.gl.TEXTURE_2D, inWorldPositionBuffers[0]);
        this.gl.uniform1i(this.uniforms.get("WorldPositionBuffer").location, 15)

        this.gl.uniformMatrix4fv(this.uniforms.get("View0").location,  false, Views[0])
        this.gl.uniformMatrix4fv(this.uniforms.get("View1").location,  false, Views[1])
        this.gl.uniformMatrix4fv(this.uniforms.get("View2").location,  false, Views[2])
        this.gl.uniformMatrix4fv(this.uniforms.get("View3").location,  false, Views[3])
        this.gl.uniformMatrix4fv(this.uniforms.get("View4").location,  false, Views[4])
        this.gl.uniformMatrix4fv(this.uniforms.get("View5").location,  false, Views[5])
        this.gl.uniformMatrix4fv(this.uniforms.get("View6").location,  false, Views[6])
        this.gl.uniformMatrix4fv(this.uniforms.get("View7").location,  false, Views[7])
        this.gl.uniformMatrix4fv(this.uniforms.get("View8").location,  false, Views[8])
        this.gl.uniformMatrix4fv(this.uniforms.get("View9").location,  false, Views[9])
        this.gl.uniformMatrix4fv(this.uniforms.get("View10").location,  false, Views[10])
        this.gl.uniformMatrix4fv(this.uniforms.get("View11").location,  false, Views[11])
        this.gl.uniformMatrix4fv(this.uniforms.get("View12").location,  false, Views[12])
        this.gl.uniformMatrix4fv(this.uniforms.get("View13").location,  false, Views[13])
        this.gl.uniformMatrix4fv(this.uniforms.get("View14").location,  false, Views[14])
        
        this.gl.uniform2fv(this.uniforms.get("WindowSize").location, WindowSize);

        ScreenPrimitive.draw()

        // Using the anti-aliased image as the history sample
        // much better quality, bad ghosting
        if (this.uniforms.get("CopyAAFrame").value == 1.0)
        {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.colorFramebuffer)
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, inLightingBuffers[0])
            this.gl.copyTexImage2D(
                this.gl.TEXTURE_2D, 
                0,
                this.gl.RGBA, 
                0, 0,
                this.width,
                this.height,
                0);
        }
    }
}