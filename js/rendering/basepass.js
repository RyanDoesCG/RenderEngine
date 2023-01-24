class DeferredBasePass extends BasePass
{
    constructor(context, width, height)
    {
        super (context, width, height)

        this.outputAlbedo = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
        this.outputNormal = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
        this.outputPosition = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA32F, this.gl.FLOAT)
        this.outputID = createColourTexture(this.gl, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE)
        this.depth = createDepthTexture(this.gl, this.width, this.height)

        this.framebuffer = createFramebuffer(this.gl, 
            [
                this.gl.COLOR_ATTACHMENT0, 
                this.gl.COLOR_ATTACHMENT1, 
                this.gl.COLOR_ATTACHMENT2, 
                this.gl.COLOR_ATTACHMENT3,
                this.gl.DEPTH_ATTACHMENT
            ], 
            [
                this.outputAlbedo, 
                this.outputNormal, 
                this.outputPosition, 
                this.outputID,
                this.depth
            ])

        this.idFramebuffer = createFramebuffer(this.gl, [ this.gl.COLOR_ATTACHMENT0 ], [ this.outputID ])
    }

    Render(scene, View, toScreen)
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
                this.gl.COLOR_ATTACHMENT1,
                this.gl.COLOR_ATTACHMENT2,
                this.gl.COLOR_ATTACHMENT3 ]);
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.enable(this.gl.CULL_FACE)
        this.gl.cullFace(this.gl.BACK);

        // Draw objects
        for (var i = 0; i < scene.objects.length; ++i)
        {
            if (scene.objects[i].material != null && scene.objects[i].primitive != null)
            {
                if (scene.objects[i].material.alpha == 1.0 && scene.objects[i].editorOnly == false)
                {
                    this.gl.useProgram       (scene.objects[i].material.ShaderProgram);
                    this.gl.uniformMatrix4fv (scene.objects[i].material.uniforms.get("proj").location, false, View.ProjectionMatrix)
                    this.gl.uniformMatrix4fv (scene.objects[i].material.uniforms.get("view").location, false, View.WorldToViewMatrix)
                    this.gl.uniform4fv       (scene.objects[i].material.uniforms.get("CameraPosition").location, View.CameraPosition)            
                    this.gl.uniform1i        (scene.objects[i].material.uniforms.get("ID").location, i)
                    this.gl.uniform4fv       (scene.objects[i].material.uniforms.get("Material").location, [ ...scene.objects[i].material.albedo, scene.objects[i].material.alpha ])
                    this.gl.uniformMatrix4fv (scene.objects[i].material.uniforms.get("transform").location, false, scene.objects[i].transform.matrix)
                    this.gl.uniform3fv       (scene.objects[i].material.uniforms.get("scale").location, scene.objects[i].transform.scale)
                    scene.objects[i].primitive.draw()
                }
            }
        }

        this.gl.disable(this.gl.DEPTH_TEST)
        this.gl.disable(this.gl.CULL_FACE)
    }
}
