class RenderingEngine
{
    constructor(context, width, height)
    {
        this.gl = context
        this.width = width
        this.height = height

        // Render Passes
        this.BaseRenderPass         = new DeferredBasePass (this.gl, this.width, this.height)
        this.OutlineRenderPass      = new OutlinePass      (this.gl, this.width, this.height)
        this.SSAORenderPass         = new SSAOPass         (this.gl, this.width, this.height)
        this.ShadowRenderPass       = new ShadowPass       (this.gl, 1080, 1080)
        this.VolumetricRenderPass   = new VolumetricsPass  (this.gl, this.width, this.height)
        this.LightRenderPass        = new LightPass        (this.gl, this.width, this.height)
   //     this.TransparencyRenderPass = new TransparencyPass (this.gl, this.width, this.height)
        this.TAARenderPass          = new TAAPass          (this.gl, this.width, this.height)
        this.BlurRenderPass         = new BlurPass         (this.gl, this.width, this.height)
        this.DepthOfFieldRenderPass = new DepthOfFieldPass (this.gl, this.width, this.height)
        this.FogRenderPass          = new FogPass          (this.gl, this.width, this.height)
        this.BloomRenderPass        = new BloomPass        (this.gl, this.width, this.height)
        this.TonemappingRenderPass  = new TonemappingPass  (this.gl, this.width, this.height)
    
        this.passes = [
            this.SSAORenderPass        ,
            this.ShadowRenderPass      ,
            this.OutlineRenderPass     ,
            this.VolumetricRenderPass  ,
            this.LightRenderPass       ,
            this.TAARenderPass         ,
            this.DepthOfFieldRenderPass,
            this.FogRenderPass         ,
            this.BloomRenderPass       ,
            this.TonemappingRenderPass
        ]

        // Frame History
        this.NumHistorySamples = 15;
        this.LightingBuffers = new Array(this.NumHistorySamples)
        for (var i = 0; i < this.NumHistorySamples; ++i)
            this.LightingBuffers[i] = createColourTexture(this.gl, 
                this.width, 
                this.height, 
                this.gl.RGBA, this.gl.UNSIGNED_BYTE)

        this.WorldPositionBuffers = new Array(this.NumHistorySamples)
        for (var i = 0; i < this.NumHistorySamples; ++i)
            this.WorldPositionBuffers[i] = createColourTexture(this.gl, 
                this.width, 
                this.height, 
                this.gl.RGBA32F, this.gl.FLOAT)
    
        this.FrameBuffers = new Array(this.NumHistorySamples)
        for (var i = 0; i < this.NumHistorySamples; ++i)
            this.FrameBuffers[i] = createFramebuffer(this.gl, 
                [this.gl.COLOR_ATTACHMENT0, this.gl.COLOR_ATTACHMENT1, this.gl.DEPTH_ATTACHMENT], 
                [this.LightingBuffers[i], this.WorldPositionBuffers[i], this.BaseRenderPass.depth])
            
        this.FrameBuffersNoDepth = new Array(this.NumHistorySamples)
        for (var i = 0; i < this.NumHistorySamples; ++i)
            this.FrameBuffersNoDepth[i] = createFramebuffer(this.gl, 
                [this.gl.COLOR_ATTACHMENT0, this.gl.COLOR_ATTACHMENT1], 
                [this.LightingBuffers[i], this.WorldPositionBuffers[i]])
    
        this.ViewTransforms = new Array(this.NumHistorySamples)
        for (var i = 0; i < this.NumHistorySamples; ++i)
            this.ViewTransforms[i] = identity()

        // Textures
        this.WhiteNoiseTexture = loadTexture(this.gl, 'images/noise/halton-noise.png')
        this.STBNBlueNoiseTextures = []
        this.NBlueNoise = 64;
        for (var i = 0; i < this.NBlueNoise; ++i)
        {
            this.STBNBlueNoiseTextures.push(loadTexture(this.gl, 'images/noise/STBN/stbn_scalar_2Dx1Dx1D_128x128x64x1_' + i + '.png'))
        }

        this.volumeSize = 512
        this.VolumeTextureData = new Uint8Array(this.volumeSize * this.volumeSize * this.volumeSize);
        for (var z = 0; z < this.volumeSize; ++z) 
        {
            for (var y = 0; y < this.volumeSize; ++y) 
            {
                for (var x = 0; x < this.volumeSize; ++x) 
                {
                    this.VolumeTextureData[x + y * this.volumeSize + z * this.volumeSize * this.volumeSize] = noise(
                        (x) * 0.01, 
                        (y) * 0.01, 
                        (z) * 0.01) * 255;
                }
            }
        }
        this.VolumeTexture = createVolumeTexture(this.gl, this.VolumeTextureData, [this.volumeSize, this.volumeSize, this.volumeSize])
        this.ScreenPrimitive = new Primitive(this.gl, QuadGeometry)

        // View

    }

    setup (view)
    {
        const LastView = this.ViewTransforms.pop();
        this.ViewTransforms.unshift(multiplym(view.ProjectionMatrix, view.WorldToViewMatrix))
        const LastBuffer = this.LightingBuffers.pop();
        this.LightingBuffers.unshift(LastBuffer);
        const LastWorldBuffer = this.WorldPositionBuffers.pop();
        this.WorldPositionBuffers.unshift(LastWorldBuffer)
        const LastFrameBuffer = this.FrameBuffers.pop();
        this.FrameBuffers.unshift(LastFrameBuffer)
        const LastFrameBufferNoDepth = this.FrameBuffersNoDepth.pop();
        this.FrameBuffersNoDepth.unshift(LastFrameBufferNoDepth)
    }

    render(view, scene, frameID, SelectedObject)
    {
        this.setup(view)

        var LastBuffer = null
        this.BaseRenderPass.Render(
            scene,
            view,
            false)
        LastBuffer = this.BaseRenderPass.outputAlbedo;

        if (this.ShadowRenderPass.active())
        {
            this.ShadowRenderPass.Render(scene)
        }
        else
        {
            this.ShadowRenderPass.Clear();
        }

        if (this.SSAORenderPass.active())
        {
            this.SSAORenderPass.Render(
                this.ScreenPrimitive,
                this.STBNBlueNoiseTextures[frameID % this.NBlueNoise],
                this.BaseRenderPass.depth,
                view.Near,
                view.Far,
                false)
        }
        else
        {
            this.SSAORenderPass.Clear();
        }

        
        if (this.VolumetricRenderPass.active())
        {
            this.VolumetricRenderPass.Render(
                this.ScreenPrimitive,
                scene,
                view,
                this.BaseRenderPass.outputPosition,
                this.ShadowRenderPass.output,
                this.VolumeTexture,
                this.STBNBlueNoiseTextures[frameID % this.NBlueNoise],
                frameID)
        }
        else
        {
            this.VolumetricRenderPass.Clear();
        }

        this.BlurRenderPass.Render(
            this.ScreenPrimitive,
            this.SSAORenderPass.output,
            0.0)
        this.LightRenderPass.Render(
            this.ScreenPrimitive,
            scene,
            view,
            this.FrameBuffers[0],
            this.BaseRenderPass.outputAlbedo,
            this.BaseRenderPass.outputNormal,
            this.BaseRenderPass.outputPosition,
            this.STBNBlueNoiseTextures[frameID % this.NBlueNoise],
            this.BlurRenderPass.output,
            this.ShadowRenderPass.output,
            this.VolumetricRenderPass.output,
            frameID,
            this.FogRenderPass.active()?true:false,
            this.TAARenderPass.active()||
            this.DepthOfFieldRenderPass.active()||
            this.FogRenderPass.active()||
            this.TonemappingRenderPass.active()||
            this.BloomRenderPass.active()?false:true)
        LastBuffer = this.LightingBuffers[0]

        /*
        this.TransparencyRenderPass.Render(
            scene,
            view,
            this.FrameBuffers[0],
            this.WhiteNoiseTexture,
            frameID,
            [this.width, this.height],
            this.TAARenderPass.active()?true:false,
            this.TAARenderPass.active()||
            this.DepthOfFieldRenderPass.active()||
            this.FogRenderPass.active()||
            this.TonemappingRenderPass.active() ||
            this.BloomRenderPass.active()?false:true)
        */

        if (this.OutlineRenderPass.active())
        {
            this.OutlineRenderPass.Render(
                this.ScreenPrimitive,
                this.BaseRenderPass.outputID,
                this.BaseRenderPass.depth,
                SelectedObject,
                this.FrameBuffersNoDepth[0],
                false)
        }

        if (this.TAARenderPass.active()) 
        {
            this.TAARenderPass.Render(
                this.ScreenPrimitive,
                this.LightingBuffers,
                this.WorldPositionBuffers,
                this.ViewTransforms,
                [ this.width, this.height ],
                this.FogRenderPass.active()||
                this.BloomRenderPass.active()||
                this.TonemappingRenderPass.active() ||
                this.DepthOfFieldRenderPass.active()?false:true
            )
            LastBuffer = this.TAARenderPass.outputColour
        }
    
        
        if (this.FogRenderPass.active())
        {
            this.FogRenderPass.Render(
                this.ScreenPrimitive,
                scene,
                view,
                LastBuffer,
                this.WorldPositionBuffers[0],
                this.ShadowRenderPass.output,
                this.STBNBlueNoiseTextures[frameID % this.NBlueNoise],
                frameID,
                this.DepthOfFieldRenderPass.active()||
                this.TonemappingRenderPass.active() ||
                this.BloomRenderPass.active()?false:true)
            LastBuffer = this.FogRenderPass.output
        }
        

        if (this.DepthOfFieldRenderPass.active())
        {
            this.BlurRenderPass.Render(
                this.ScreenPrimitive,
                LastBuffer,
                2.0)
            this.DepthOfFieldRenderPass.Render(
                this.ScreenPrimitive,
                LastBuffer,
                this.BlurRenderPass.output,
                this.WorldPositionBuffers[0],
                this.BloomRenderPass.active()||this.TonemappingRenderPass.active()?false:true
            )
            LastBuffer = this.DepthOfFieldRenderPass.output
        }

        if (this.BloomRenderPass.active())
        {
            this.BlurRenderPass.Render(
                this.ScreenPrimitive,
                this.TAARenderPass.outputBloom,
                this.BloomRenderPass.uniforms.get("BloomAmount").value * 2.0)
            this.BlurRenderPass.Render(
                this.ScreenPrimitive,
                this.BlurRenderPass.output,
                this.BloomRenderPass.uniforms.get("BloomAmount").value * 4.0)
            this.BloomRenderPass.Render(
                this.ScreenPrimitive,
                LastBuffer,
                this.BlurRenderPass.output,
                this.WorldPositionBuffers[0],
                this.TonemappingRenderPass.active()?false:true)
            LastBuffer = this.BloomRenderPass.output
        }

        if (this.TonemappingRenderPass.active())
        {
            this.TonemappingRenderPass.Render(
                this.ScreenPrimitive,
                LastBuffer
            )
        }
    }

    getMouseOverObjectID (mouseX, mouseY)
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.BaseRenderPass.idFramebuffer)
        var pixels = new Uint8Array(4);
        this.gl.readPixels(
            Math.floor(mouseX), 
            Math.floor(mouseY), 
            1, 
            1, 
            this.gl.RGBA, 
            this.gl.UNSIGNED_BYTE, 
            pixels);
        return pixels[0]
    }
}