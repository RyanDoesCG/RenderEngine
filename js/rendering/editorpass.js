class EditorPass extends RenderPass
{
    constructor(context, width, height)
    {
        const VertexSource = 
           `#version 300 es

            precision lowp float;
    
            uniform mat4 proj;
            uniform mat4 view;
            uniform mat4 transform;
    
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
                seed += 0.01;
                return texture(WhiteNoise, vec2(Time, seed)).r;
            }
    
            void main() 
            {
                float x = random() * 1.0;
                float y = random() * 1.0;
    
                frag_worldpos = transform * vec4(vertex_position.xyz, 1.0);
                frag_normal = normalize((transform * vec4(vertex_normal.xyz, 0.0)).xyz);
                frag_uvs = vertex_uv;
    
                gl_Position = proj * view * frag_worldpos;
    
            }`

        const FragmentSource = 
            `#version 300 es
 
             precision lowp float;
 
             uniform vec4 CameraPosition;
             uniform vec4 Material;
 
             layout (location = 0) out vec4 out_albedo;
             layout (location = 1) out vec4 out_normal;
             layout (location = 2) out vec4 out_position;
             layout (location = 3) out vec4 out_id;
 
             uniform sampler2D WhiteNoise;
             uniform float     Time;
             uniform int       ID;
 
             in vec4 frag_worldpos;
             in vec3 frag_normal;
             in vec2 frag_uvs;
 
             float grid (vec2 uv, float Thickness)
             {
                 return mix(
                     0.0, 
                     1.0, 
                     float((fract(uv.x * 20.0) > Thickness) || 
                         (fract(uv.y * 20.0) > Thickness)));
             }
 
             void main ()
             {
                 out_albedo = mix(Material, vec4(mix(vec3(0.14), vec3(0.05), grid(frag_uvs * 80.0, 0.94)), 1.0), Material.w);
                 out_normal = vec4((frag_normal + vec3(1.0)) * 0.5, 1.0);
                 out_position = vec4(frag_worldpos.xyz, distance(CameraPosition.xyz, frag_worldpos.xyz));
                 out_id = vec4(float(ID) / 255.0, 0.0, 0.0, 1.0);
             }`

        super (context, width, height, VertexSource, FragmentSource)
    }   

    Render(scene, View, WhiteNoise, Time, WindowSize, ShouldJitter, SelectedObject, framebuffer, toScreen)
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
                this.gl.COLOR_ATTACHMENT1,
                this.gl.COLOR_ATTACHMENT2,
                this.gl.COLOR_ATTACHMENT3 ]);
        }

        this.gl.useProgram(this.ShaderProgram);

       // this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.enable(this.gl.CULL_FACE)
        this.gl.cullFace(this.gl.BACK)

        this.gl.uniformMatrix4fv(this.uniforms.get("proj").location, false, View.ProjectionMatrix)
        this.gl.uniformMatrix4fv(this.uniforms.get("view").location, false, View.WorldToViewMatrix)

        this.gl.uniform1f(this.uniforms.get("Time").location, Time)
        this.gl.uniform2fv(this.uniforms.get("WindowSize").location, WindowSize)          
        this.gl.uniform1i(this.uniforms.get("ShouldJitter").location, ShouldJitter)

        this.gl.uniform1i(this.uniforms.get("WhiteNoise").location, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, WhiteNoise);

        this.gl.uniform4fv(this.uniforms.get("CameraPosition").location, View.CameraPosition)

        for (var i = 0; i < scene.objects.length; ++i)
        {
            if (i == SelectedObject)
            {
            //    this.gl.disable(this.gl.DEPTH_TEST)
                //    this.gl.uniform1i(this.uniforms.get("ID").location, i)
                //    this.gl.uniform4fv(this.uniforms.get("Material").location, [ 1.0, 0.8, 0.0, 0.0 ])
                //    this.gl.uniformMatrix4fv(this.uniforms.get("transform").location, false, scene.objects[i].transform.matrix)
                //    scene.objects[i].primitive.draw()
             //   this.gl.enable(this.gl.DEPTH_TEST)
            }

            if (scene.objects[i].editorOnly == true)
            {
                this.gl.uniform1i(this.uniforms.get("ID").location, i)
                this.gl.uniform4fv(this.uniforms.get("Material").location, [ ...scene.objects[i].material.albedo, scene.objects[i].material.grid ])
                this.gl.uniformMatrix4fv(this.uniforms.get("transform").location, false, scene.objects[i].transform.matrix)
                scene.objects[i].primitive.draw()
            }
        }
        
       // this.gl.disable(this.gl.DEPTH_TEST)
        this.gl.disable(this.gl.CULL_FACE)
    }
}