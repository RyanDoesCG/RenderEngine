
(async function () 
{
    var canvas = document.getElementById('viewport')
    var ui = document.getElementById('ui')

    var gl = canvas.getContext("webgl2", 
    { 
        alpha:false,
        depth:true,
        stencil:false,
        desynchronized:false,
        antialias:false,
        powerPreference:"low-power"

    })

    //gl.globalCompositeOperation = "difference";

    gl.getExtension('EXT_color_buffer_float');

    const DefaultMaterial = new Material(gl, [ 0.5, 0.5, 0.5 ], 1.0)
    const GridMaterial = new Material(gl, [0.5, 0.5, 0.5], 1.0, 
        "bool boundary (float v) { return (v < 0.075 || v > 0.925); }"
        +
        "float grid () { vec3 scaling = scale * 4.0; return mix(0.5, 0.1, float(boundary(fract(frag_uvs.x * scaling.x)) || boundary(fract(frag_uvs.y * scaling.z)))); }"
        +
        "vec4 getMaterialAlbedo() { return vec4(grid()); }")

    var scene = new Scene()

    const renderEngine = new RenderingEngine(gl, canvas.width, canvas.height)
    const renderSettings = new RenderSettings(renderEngine.passes)
    //const sceneOutliner = new SceneOutliner(scene)

    var HoverObject = -1
    var selectedObject = -1

    var transformGizmo

    /*
    const response = await fetch('models/dragon.obj');
    const text = await response.text();
    var MeshGeom = MeshGeometry(text)
     */

    async function BuildScene()
    {
        scene.add(new SceneObject(
            "Ground",
            new Primitive(gl, BoxGeometry),
            new Transform([16.0, 1.0, 16.0], [0.0, 0.0, -2.0], [0.0, 0.0, 0.0]),
            DefaultMaterial,
            false))

        scene.add(new SceneObject(
            "Box1",
            new Primitive(gl, BoxGeometry),
            new Transform([1.0, 1.0, 1.0], [-1.31514, 2.0, 0.0], [0.0, 0.2342, 0.0]),
            DefaultMaterial,
            false))

        scene.add(new SceneObject(
            "Box2",
            new Primitive(gl, BoxGeometry),
            new Transform([1.0, 1.0, 1.0], [1.3524, 2.0, 0.0], [0.0, -0.3512, 0.0]),
            DefaultMaterial,
            false))

        scene.add(new SceneObject(
            "Box3",
            new Primitive(gl, BoxGeometry),
            new Transform([1.0, 1.0, 1.0], [0.0, 4.0, -0.1243], [0.0, -0.084134, 0.0]),
            DefaultMaterial,
            false))

        scene.add(new SceneObject(
            "Arch1",
            new Primitive(gl, ArchGeometry),
            new Transform([1.0, 1.0, 1.0], [0.0, 2.0, -4.0], [0.0, 0.0, 0.0]),
            DefaultMaterial,
            false))
        
        scene.add(new SceneObject(
            "Sphere",
            new Primitive(gl, SphereGeometry),
            new Transform([1.0, 1.0, 1.0], [-5.0, 2.0, 1.0], [0.0, 0.0, 0.0]),
            DefaultMaterial,
            false))

        scene.add(new SceneObject(
            "Dragon",
            new Primitive(gl, await MeshGeometry('models/dragon.obj')),
            new Transform([1.0, 1.0, 1.0], [6.0, 0.9, 1.0], [0.0, 0.2, 0.0]),
            DefaultMaterial,
            false))

        scene.add(new SceneObject(
            "SkyDome",
            new Primitive(gl, SkySphereGeometry),
            new Transform([100.0, 100.0, 100.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]),
            DefaultMaterial,
            false))
    
        transformGizmo = new SceneObject(
            "transformGizmo", 
            null,
            new Transform([1.0, 1.0, 1.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]),
            null)

        scene.add(transformGizmo)
    }

    function UpdateScene()
    {

    }
    
    // CAMERA
    var CameraPosition = vec4(0.0, 9.0, 22.0, 1.0)
    var CameraVelocity = vec4(0.0, 0.0, 0.0, 0.0)
    var CameraAcceleration = vec4(0.0, 0.0, 0.0, 0.0)

    var CameraRotation = new Float32Array([0.2, 0.0, 0.0])
    var CameraAngularVelocity = new Float32Array([0.0, 0.0, 0.0])

    var LastCameraPosition = CameraPosition
    var LastCameraRotation = CameraRotation

    var Near = 0.1
    var Far = 1000.0
    var FOV = 45.0;

    var view = new View (
        CameraPosition, 
        CameraRotation, 
        canvas.clientWidth, 
        canvas.clientHeight, 
        Near, 
        Far, 
        FOV,
        false)

    function Computeview () 
    {
        view = new View (
            CameraPosition, 
            CameraRotation, 
            canvas.width, 
            canvas.height,
            canvas.clientHeight / canvas.clientWidth,
            Near, 
            Far, 
            FOV,
            renderEngine.TAARenderPass.active())

        ui.innerHTML = "<p>" + CameraPosition[0].toFixed(1) + " " + CameraPosition[1].toFixed(1) + " " + CameraPosition[2].toFixed(1) + "</p>" + 
                       "<p>" + CameraRotation[0].toFixed(1) + " " + CameraRotation[1].toFixed(1) + " " + CameraRotation[2].toFixed(1) + "</p>"
        ui.innerHTML += "<p>" + DisplayedFrameTime + "ms</p>"
    }

    var then = 0
    var FramerateTickInterval = 10;
    var DisplayedFrameTime = 0.0;
    var frameID = 1;

    function Loop () 
    {
        let now = new Date().getMilliseconds();
        let TimeSinceLastUpdate = Math.abs(now - then);
        then = now

       // log(TimeSinceLastUpdate)

        PollInput();
        DoMovement();

        if (ImagesLoaded.every(v => v))
        {
            Computeview();
            UpdateScene();
            renderEngine.render(view, scene, frameID, selectedObject)
        }

        LastLoopEnded = Date.now();
        if (frameID % FramerateTickInterval == 0)
        {
            DisplayedFrameTime = TimeSinceLastUpdate;
        }

        HoverObject = renderEngine.getMouseOverObjectID(MouseX, MouseY)

        frameID++;
        requestAnimationFrame(Loop)
    }

    var APressed = false;
    var DPressed = false;
    var WPressed = false;
    var SPressed = false;
    var QPressed = false;
    var EPressed = false;
    var FPressed = false;

    var LeftArrowPressed = false;
    var RightArrowPressed = false;

    var UpArrowPressed = false;
    var DownArrowPressed = false;

    var ShiftPressed = false;

    var SpacePressed = false;

    function PollInput() 
    {      
        var speed = 0.0125
        if (ShiftPressed)
        {
            speed = 0.02;
        }

        var CameraForwardXZ = [
            view.CameraForward[0],
            0.0,
            view.CameraForward[2],
            0.0
        ]

        if (DPressed) CameraVelocity = addv(CameraVelocity, multiplys(view.CameraRight,  speed))
        if (APressed) CameraVelocity = addv(CameraVelocity, multiplys(view.CameraRight, -speed))
        if (WPressed) CameraVelocity = addv(CameraVelocity, multiplys(CameraForwardXZ, speed))
        if (SPressed) CameraVelocity = addv(CameraVelocity, multiplys(CameraForwardXZ, -speed))
        if (QPressed) CameraVelocity[1] -= speed
        if (EPressed) CameraVelocity[1] += speed

        var lookSpeed = 0.001
        if (LeftArrowPressed)  CameraAngularVelocity[1] -= lookSpeed;
        if (RightArrowPressed) CameraAngularVelocity[1] += lookSpeed;
        if (UpArrowPressed)    CameraAngularVelocity[0] -= lookSpeed;
        if (DownArrowPressed)  CameraAngularVelocity[0] += lookSpeed;

        
    }

    var UIHidden = false;

    function ToggleUI()
    {
        if (UIHidden)
            ShowUI()
        else
            HideUI()

        UIHidden = !UIHidden
    }

    function HideUI()
    {
        document.getElementById("ui").style.opacity = "0.0"      
    }

    function ShowUI()
    {
        document.getElementById("ui").style.opacity = "1.0"
    }

    var EditorHidden = false

    function ToggleEditor()
    {
        if (EditorHidden)
            ShowEditor()
        else
            HideEditor()

        EditorHidden = !EditorHidden
    }

    function HideEditor()
    {
        var editorPanes = document.getElementsByClassName("editor")
        for (var i = 0; i < editorPanes.length; ++i)
        {
            editorPanes[i].style.opacity = 0.0;
        }

        canvas.style.position = "fixed"
        canvas.style.left = "0"
        canvas.style.width = "100%"
        canvas.style.height = "100%"
    }

    function ShowEditor()
    {
        var editorPanes = document.getElementsByClassName("editor")
        for (var i = 0; i < editorPanes.length; ++i)
        {
            editorPanes[i].style.opacity = 1.0;
        }

        canvas.style.position = "relative"
        canvas.style.left = "0"
        canvas.style.width = "69.5%"
        canvas.style.height = "74.5%"
    }

    function DoMovement() 
    {
        var CharacterRadius= 3.0
        var Gravity = 0.001;
        var Jump = 0.03;

        CameraPosition = addv(CameraPosition, CameraVelocity)
        CameraVelocity = addv(CameraVelocity, CameraAcceleration)
        CameraVelocity = multiplys(CameraVelocity, 0.9)
        CameraAcceleration = multiplys(CameraAcceleration, 0.9)

        //// SCREEN SHAKE
        //CameraAngularVelocity[0] += Math.sin(frameID * 0.05) * 0.000025
        //CameraAngularVelocity[1] += Math.cos((frameID + 12)* 0.05) * 0.000025

        CameraRotation = addv(CameraRotation, CameraAngularVelocity)
        CameraAngularVelocity = multiplys(CameraAngularVelocity, 0.9)

        if (Math.abs(CameraPosition[0] - LastCameraPosition[0]) > 0.000 || 
            Math.abs(CameraPosition[1] - LastCameraPosition[1]) > 0.000 || 
            Math.abs(CameraPosition[2] - LastCameraPosition[2]) > 0.000 ||
            Math.abs(CameraRotation[0] - LastCameraRotation[0]) > 0.000 || 
            Math.abs(CameraRotation[1] - LastCameraRotation[1]) > 0.000 || 
            Math.abs(CameraRotation[2] - LastCameraRotation[2]) > 0.000)
        {
            viewTransformHasChanged = true
        }
        else
        {
            viewTransformHasChanged = false
        }

        LastCameraPosition = CameraPosition
        LastCameraRotation = CameraRotation

        writeValueToCookie("LastCameraX", CameraPosition[0])
        writeValueToCookie("LastCameraX", CameraPosition[0])
        writeValueToCookie("LastCameraY", CameraPosition[1])
        writeValueToCookie("LastCameraZ", CameraPosition[2])
        writeValueToCookie("LastCameraRotationX", CameraRotation[0])
        writeValueToCookie("LastCameraRotationY", CameraRotation[1])
        writeValueToCookie("LastCameraRotationZ", CameraRotation[2])
    }

    function flipkey (event) 
    {
        if (!event.repeat)
        {
            if      (event.key == 'a') APressed = !APressed
            else if (event.key == 'd') DPressed = !DPressed
            else if (event.key == 's') SPressed = !SPressed
            else if (event.key == 'w') WPressed = !WPressed
            else if (event.key == 'f') FPressed = !FPressed
            else if (event.key == 'ArrowLeft')  LeftArrowPressed  = !LeftArrowPressed
            else if (event.key == 'ArrowRight') RightArrowPressed = !RightArrowPressed
            else if (event.key == 'ArrowUp')    UpArrowPressed    = !UpArrowPressed
            else if (event.key == 'ArrowDown')  DownArrowPressed  = !DownArrowPressed
            else if (event.key == 'Shift') ShiftPressed = !ShiftPressed;
            else if (event.key == ' ') SpacePressed = !SpacePressed;
            else if (event.key == 'e') EPressed = !EPressed
            else if (event.key == 'q') QPressed = !QPressed
        }

    }

    function handleKeyDown (event)
    {
        if (event.key == 'u')
        {
            ToggleUI()
        }

        if (event.key == 'f')
        {
            ToggleEditor()
        }

        if (event.key == 'r')
        {
           CameraPosition = vec4(0.0, 0.0, 0.0, 0.0);
           CameraRotation = new Float32Array([0.0,0.0,0.0]);
        }

        if (event.key == ' ')
        {
            SpacePressed = true;
        }
    }

    document.addEventListener('keyup', flipkey, true)
    document.addEventListener('keydown', flipkey, true)
    document.addEventListener('keydown', handleKeyDown, true)

    var MouseX = 0
    var MouseY = 0

    canvas.addEventListener('mousemove', function (e) 
    {
        var bounds = e.target.getBoundingClientRect();
        MouseX = ((e.clientX - bounds.left) / canvas.clientWidth ) * canvas.width;
        MouseY = ((1.0 - (e.clientY - bounds.top)  / canvas.clientHeight)) * canvas.height;
    })

    canvas.addEventListener('click', function (e) 
    {
        unparentObject(transformGizmo)
        if (HoverObject == selectedObject)
        {
            selectedObject = -1
        }
        else
        {
            selectedObject = HoverObject
            parentObject(scene.objects[selectedObject], transformGizmo)
        }
    })

    BuildScene()

    renderSettings.generateHTML()
    renderSettings.attachHandlers()

    //sceneOutliner.generateHTML()
    //sceneOutliner.attachHandlers()

    requestAnimationFrame(Loop)

}())