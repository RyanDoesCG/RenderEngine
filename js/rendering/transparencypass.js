/*
class TransparencyPass extends SubPass
{
    constructor(context, width, height)
    {
        const VertexSource = 
           `#version 300 es

            precision lowp float;

            uniform mat4 Projection;
            uniform mat4 View;
            uniform mat4 Transform;

            uniform float     Time;
            uniform vec2      WindowSize;
            uniform int       ShouldJitter;
            uniform sampler2D WhiteNoise;

            in vec3 vertex_position;
            in vec3 vertex_normal;
            in vec2 vertex_uv;

            out vec4 frag_worldpos;
            out vec3 frag_normal;
            out vec2 frag_uvs;

            float seed = 0.0;
            float random()
            {
                seed += 0.1;
                return texture(WhiteNoise, vec2(Time, Time + seed) * 0.01).a;
            }

            void main() 
            {
                float x = random() * 1.0;
                float y = random() * 1.0;

                mat4 jitter_proj = Projection;
                if (ShouldJitter == 1)
                {
                    jitter_proj[2][0] = (-1.0 + (x * 2.0)) / WindowSize.x;
                    jitter_proj[2][1] = (-1.0 + (y * 2.0)) / WindowSize.y;
                }

                frag_worldpos = Transform * vec4(vertex_position.xyz, 1.0);
                frag_normal = normalize((Transform * vec4(vertex_normal.xyz, 0.0)).xyz);
                frag_uvs = vertex_uv;
                gl_Position = jitter_proj * View * frag_worldpos;
            }`

        const FragmentSource = 
           `#version 300 es

            precision lowp float;

            uniform float Time;
            uniform sampler2D WhiteNoise;
            uniform vec3 LightPosition;
            uniform vec4 CameraPosition;
            uniform vec4 Material;
            uniform float Alpha;

            layout (location = 0) out vec4 out_colour;
            layout (location = 1) out vec4 out_position;

            in vec4 frag_worldpos;
            in vec3 frag_normal;
            in vec2 frag_uvs;

            void main ()
            {
                out_colour = vec4(Material.xyz * 0.5, Alpha);
                out_position = vec4(frag_worldpos.xyz, 0.0);

                // Diffuse
                float Hardness = 0.5;
                vec3 n = frag_normal.xyz;
                vec3 l = normalize(LightPosition.xyz - frag_worldpos.xyz);
                float d = max(0.0, dot(n, l));
                out_colour.xyz *= d * Hardness + 1.0 - Hardness;

                // fake SSS
                out_colour += (pow(length(-1.0 + frag_uvs * 2.0), 3.14312) * 0.1)
                 + texture(WhiteNoise, frag_uvs + Time * 0.1).a * 0.1;
                
            }`
        
        super(context, width, height, VertexSource, FragmentSource)

    }

    Render(scene, View, framebuffer, WhiteNoise, Time, WindowSize, ShouldJitter, toScreen)
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
                this.gl.COLOR_ATTACHMENT1]);
        }

        this.gl.useProgram(this.ShaderProgram);

        //this.gl.enable(this.gl.CULL_FACE)
        //this.gl.cullFace(this.gl.BACK)

        this.gl.enable(this.gl.DEPTH_TEST)
      //  this.gl.depthMask(false)

        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.uniformMatrix4fv(this.uniforms.get("Projection").location, false, View.ProjectionMatrix)
        this.gl.uniformMatrix4fv(this.uniforms.get("View").location, false, View.WorldToViewMatrix)

        this.gl.uniform1f(this.uniforms.get("Time").location, Time)
        this.gl.uniform2fv(this.uniforms.get("WindowSize").location, WindowSize)          
        this.gl.uniform1i(this.uniforms.get("ShouldJitter").location, ShouldJitter)

        this.gl.uniform1i(this.uniforms.get("WhiteNoise").location, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, WhiteNoise);

        this.gl.uniform4fv(this.uniforms.get("CameraPosition").location, View.CameraPosition)
     //   this.gl.uniform3fv(this.uniforms.get("LightPosition").location, [ scene.directionalLight.translation[0],scene.directionalLight.translation[1],scene.directionalLight.translation[2]])

        // Draw objects
        var objectsToDraw = []
        for (var i = 0; i < scene.objects.length; ++i)
        {
            if (scene.objects[i].material != null && scene.objects[i].material.alpha < 1.0)
            {
                objectsToDraw.push(i)
            }
        }

        objectsToDraw.sort((a, b) => 
        { 
            const distanceA = len(scene.objects[a].transform.translation, [View.CameraPosition[0], View.CameraPosition[1], View.CameraPosition[2]])
            const distanceB = len(scene.objects[b].transform.translation, [View.CameraPosition[0], View.CameraPosition[1], View.CameraPosition[2]])
            return distanceA > distanceB;
        })

        for (var i = 0; i < objectsToDraw.length; ++i)
        {
            let id = objectsToDraw[i]
            this.gl.uniform4fv(this.uniforms.get("Material").location, [ ...scene.objects[id].material.albedo, scene.objects[id].material.grid ])
            this.gl.uniform1f(this.uniforms.get("Alpha").location, scene.objects[id].material.alpha )
            this.gl.uniformMatrix4fv(this.uniforms.get("Transform").location, false, scene.object[id].transform.matrix)
            scene.objects[id].primitive.draw()
        }

        this.gl.disable(this.gl.CULL_FACE)
        this.gl.disable(this.gl.DEPTH_TEST)
        this.gl.depthMask(true)
        this.gl.disable(this.gl.BLEND)
    }

}
*/