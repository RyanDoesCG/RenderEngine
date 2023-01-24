class ViewportTab extends EditorTab
{
    constructor()
    {
        super("Viewport")

        this.canvas = document.createElement("canvas")
        this.canvas.width = 512
        this.canvas.height = 512
 
        this.gl = this.canvas.getContext("webgl2", 
        { 
            alpha:false,
            depth:true,
            stencil:false,
            desynchronized:false,
            antialias:false,
            powerPreference:"low-power"
        })

        this.gl.getExtension('EXT_color_buffer_float');

        this.renderEngine = new RenderingEngine(this.gl, this.canvas.width, this.canvas.height)

        this.CameraPosition = vec4(0.0, 0.0, 6.0, 1.0)
        this.CameraVelocity = vec4(0.0, 0.0, 0.0, 0.0)
        this.CameraAcceleration = vec4(0.0, 0.0, 0.0, 0.0)
        
        this.CameraRotation = new Float32Array([0.0, 0.0, 0.0])
        this.CameraAngularVelocity = new Float32Array([0.0, 0.0, 0.0])
        
        this.LastCameraPosition = this.CameraPosition
        this.LastCameraRotation = this.CameraRotation
        
        this.Near = 0.1
        this.Far = 1000.0
        this.FOV = 45.0;

        this.view = new View (
            this.CameraPosition, 
            this.CameraRotation, 
            this.canvas.clientWidth, 
            this.canvas.clientHeight, 
            this.Near, 
            this.Far, 
            this.FOV,
            false)

        this.html = this.canvas
    }

    render(scene, frameID)
    {
        this.view = new View (
            this.CameraPosition, 
            this.CameraRotation, 
            this.canvas.clientWidth, 
            this.canvas.clientHeight, 
            this.Near, 
            this.Far, 
            this.FOV,
            false)

        this.renderEngine.render(this.view, scene, frameID, -1)
    }
}