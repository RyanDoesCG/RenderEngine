class Geometry 
{
    constructor (positions, normals, uvs)
    {
        this.positions = positions
        this.normals = normals
        this.uvs = uvs
    }
}

//    
//           *  A                     * A
//          / \                     /  \
//        /    \        =>       F * - * D
//       /      \                 / \ / \
//    C * ------ * B           C * - * - * B
//                                   E
//   
function tesselate (geometry)
{
    var TesselatedBoxPositions = []
    var TesselatedBoxNormals = []
    var TesselatedBoxUVs = []
 
    // for each triangles positions
    for (var i = 0; i < geometry.positions.length; i += 9)
    {
        const pA = [geometry.positions[i + 0], geometry.positions[i + 1], geometry.positions[i + 2]]
        const pB = [geometry.positions[i + 3], geometry.positions[i + 4], geometry.positions[i + 5]]
        const pC = [geometry.positions[i + 6], geometry.positions[i + 7], geometry.positions[i + 8]]
        const pD = lerpv(pA, pB, 0.5)
        const pE = lerpv(pB, pC, 0.5)
        const pF = lerpv(pC, pA, 0.5)
        TesselatedBoxPositions.push(
            ...pA, ...pD, ...pF, 
            ...pD, ...pB, ...pE, 
            ...pE, ...pC, ...pF, 
            ...pF, ...pD, ...pE);
    }

    // for each triangles normals
    for (var i = 0; i < geometry.normals.length; i += 9)
    {
        const nA = [geometry.normals[i + 0], geometry.normals[i + 1], geometry.normals[i + 2]]
        const nB = [geometry.normals[i + 3], geometry.normals[i + 4], geometry.normals[i + 5]]
        const nC = [geometry.normals[i + 6], geometry.normals[i + 7], geometry.normals[i + 8]]
        const nD = lerpv(nA, nB, 0.5)
        const nE = lerpv(nB, nC, 0.5)
        const nF = lerpv(nC, nA, 0.5)
        TesselatedBoxNormals.push(
            ...nA, ...nD, ...nF, 
            ...nD, ...nB, ...nE, 
            ...nE, ...nC, ...nF, 
            ...nF, ...nD, ...nE);
    }
    
    // for each triangles uvs
    for (var i = 0; i < geometry.uvs.length; i += 6)
    {
        const tA = [ geometry.uvs[i + 0], geometry.uvs[i + 1] ]
        const tB = [ geometry.uvs[i + 2], geometry.uvs[i + 3] ]
        const tC = [ geometry.uvs[i + 4], geometry.uvs[i + 5] ]
        const tD = lerpv(tA, tB, 0.5)
        const tE = lerpv(tB, tC, 0.5)
        const tF = lerpv(tC, tA, 0.5)
        TesselatedBoxUVs.push(
            ...tA, ...tD, ...tF, 
            ...tD, ...tB, ...tE, 
            ...tE, ...tC, ...tF, 
            ...tF, ...tD, ...tE);
    }

    return new Geometry(
        new Float32Array(TesselatedBoxPositions), 
        new Float32Array(TesselatedBoxNormals), 
        new Float32Array(TesselatedBoxUVs))
}

let QuadGeometry = new Geometry(
        new Float32Array([
            -1.0, -1.0, 0.0,  1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 
            -1.0,  1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0,  
             1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 
            -1.0, -1.0, 0.0, -1.0,  1.0, 0.0, 1.0, 1.0, 0.0
        ]),
        new Float32Array([
            0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0,  
            0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0,
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
        ]),
        new Float32Array([
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 
            0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0
        ]))

// BOX GEOMETRY
let BoxGeometry = new Geometry(
    new Float32Array([
        -1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  
        -1.0,  1.0, -1.0,  1.0,  1.0, -1.0, -1.0, -1.0, -1.0,  
         1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,    
         1.0, -1.0,  1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0, 
        -1.0,  1.0, -1.0, -1.0, -1.0, -1.0, -1.0,  1.0,  1.0,   
        -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, 
        -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  
        -1.0,  1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,     
        -1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,     
        -1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0, -1.0,     
        -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0,       
        -1.0, -1.0,  1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0
    ]),
    new Float32Array([ 
         0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0, 
         0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0, 
         1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0, 
         1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, 
         0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0, 
         0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0, 
         0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0, 
         0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0, 
         0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0, 
         0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0 
    ]),
    new Float32Array([ 
        0.0, 0.0, 1.0, 1.0, 1.0, 0.0,  
        0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 
        0.0, 1.0, 0.0, 0.0, 1.0, 1.0,  
        1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 
        0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 
        0.0, 1.0, 0.0, 0.0, 1.0, 1.0,  
        0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 
        0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0,  
        0.0, 1.0, 0.0, 0.0, 1.0, 1.0 
    ]))

// SPHERE GEOMETRY
let SphereGeometry = function ()
{
    let geometry = new Geometry(
        new Float32Array(BoxGeometry.positions),
        new Float32Array(BoxGeometry.normals),
        new Float32Array(BoxGeometry.uvs))

    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)

    for (var i = 0; i < geometry.positions.length; i += 3)
    {
        const position = normalize([geometry.positions[i + 0], geometry.positions[i + 1], geometry.positions[i + 2]])
        const normal = position
        geometry.positions[i + 0] = position[0]
        geometry.positions[i + 1] = position[1]
        geometry.positions[i + 2] = position[2]
        geometry.normals[i + 0] = normal[0]
        geometry.normals[i + 1] = normal[1]
        geometry.normals[i + 2] = normal[2]
    }

    return geometry;
}()

// SKY SPHERE GEOMETRY
let SkySphereGeometry = function ()
{
    let geometry = new Geometry(
        new Float32Array(BoxGeometry.positions),
        new Float32Array(BoxGeometry.normals),
        new Float32Array(BoxGeometry.uvs))

    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)

    for (var i = 0; i < geometry.positions.length; i += 3)
    {
        const position = normalize([geometry.positions[i + 0], geometry.positions[i + 1], geometry.positions[i + 2]])
        const normal = position
        geometry.positions[i + 0] = position[0]
        geometry.positions[i + 2] = position[1]
        geometry.positions[i + 1] = position[2]
        geometry.normals[i + 0] = normal[0]
        geometry.normals[i + 2] = normal[1]
        geometry.normals[i + 1] = normal[2]
    }

    return geometry;
}()

// CYLINDER GEOMETRY
let CylinderGeometry = function ()
{
    var cylinderGeometryPositions = []
    var cylinderGeometryNormals = []
    var cylinderGeometryUVs = []

    var circlePoints = []
    var N = 64
    var step = 360.0 / N
    for (var i = 0; i <= 360.0; i += step)
    {
        var x = Math.cos(i * Math.PI/180)
        var y = 0.0
        var z = Math.sin(i * Math.PI/180)
        circlePoints.push([ x, y, z ])
    }
    // Top Face
    for (var i = 1; i < circlePoints.length; i++)
    {
        var A = [...circlePoints[i]]
        A[1] = 4.0;
        var B = [...circlePoints[i - 1]]
        B[1] = 4.0;

        cylinderGeometryPositions.push(
            ...A,
            ...B,
            0.0, 4.0, 0.0)
        cylinderGeometryNormals.push(
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0)
        cylinderGeometryUVs.push(
            (A[0] + 1.0) * 0.5, (A[2] + 1.0) * 0.5,
            (B[0] + 1.0) * 0.5, (B[2] + 1.0) * 0.5,
            0.5, 0.5,)
    }
    // Bottom Face
    for (var i = 1; i < circlePoints.length; i++)
    {
        var A = [...circlePoints[i]]
        A[1] = 0.0;
        var B = [...circlePoints[i - 1]]
        B[1] = 0.0;

        cylinderGeometryPositions.push(
            ...B,
            ...A,
            0.0, 0.0, 0.0)
        cylinderGeometryNormals.push(
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0)
        cylinderGeometryUVs.push(
            (B[0] + 1.0) * 0.5, (B[2] + 1.0) * 0.5,
            (A[0] + 1.0) * 0.5, (A[2] + 1.0) * 0.5,
            0.5, 0.5,)
    }
    // Walls
    for (var i = 1; i < circlePoints.length; i++)
    {
        var topA = [...circlePoints[i]]
        topA[1] = 4.0;
        var topB = [...circlePoints[i - 1]]
        topB[1] = 4.0;

        var bottomA = [...circlePoints[i]]
        bottomA[1] = 0.0;
        var bottomB = [...circlePoints[i - 1]]
        bottomB[1] = 0.0;

        cylinderGeometryPositions.push(
            ...topB,
            ...topA, 
            ...bottomB,
            ...bottomA,
            ...bottomB,
            ...topA)

        cylinderGeometryNormals.push(
            ...circlePoints[i],
            ...circlePoints[i],
            ...circlePoints[i - 1],

            ...circlePoints[i - 1],
            ...circlePoints[i - 1],
            ...circlePoints[i])
            
        cylinderGeometryUVs.push(
            ((Math.acos(topB[0]   ) * (180.0/Math.PI)) / 360.0) * 3.0    , topB[1]    / 2.0,
            ((Math.acos(topA[0]   ) * (180.0/Math.PI)) / 360.0) * 3.0    , topA[1]    / 2.0,
            ((Math.acos(bottomB[0]) * (180.0/Math.PI)) / 360.0) * 3.0    , bottomB[1] / 2.0,
            ((Math.acos(bottomA[0]) * (180.0/Math.PI)) / 360.0) * 3.0    , bottomA[1] / 2.0,
            ((Math.acos(bottomB[0]) * (180.0/Math.PI)) / 360.0) * 3.0    , bottomB[1] / 2.0,
            ((Math.acos(topA[0]   ) * (180.0/Math.PI)) / 360.0) * 3.0    , topA[1]    / 2.0,)
    }

    return new Geometry(
        new Float32Array(cylinderGeometryPositions),
        new Float32Array(cylinderGeometryNormals),
        new Float32Array(cylinderGeometryUVs)
    )
}()

// ARCH GEOMETRY
let ArchGeometry = function ()
{
    var archGeometryPositions
    var archGeometryNormals
    var archGeometryUVs = []

    archGeometryPositions = [
        ///////////////////////////////////////
        // OUTER ARCH
        ///////////////////////////////////////
        // LEFT
        -10.0,  18.0, -2.0,  // bottom right
        -10.0, -2.0, -2.0,   // bottom left
        -10.0,  18.0,  2.0,  // top right

        -10.0, -2.0, -2.0,   // bottom left
        -10.0, -2.0,  2.0,   // top left
        -10.0,  18.0,  2.0,  // top right
        // RIGHT
        10.0, -2.0, -2.0,   // bottom left
        10.0,  18.0, -2.0,  // bottom right
        10.0,  18.0,  2.0,  // top right

        10.0, -2.0,  2.0,   // top left
        10.0, -2.0, -2.0,   // bottom left
        10.0,  18.0,  2.0,  // top right
        // TOP
        10.0,  18.0, -2.0,  // back right
        -10.0,  18.0, -2.0,  // back left
         10.0,  18.0,  2.0,  // front right

         -10.0,  18.0, -2.0,  // back left
        -10.0,  18.0,  2.0,  // front left
         10.0,  18.0,  2.0,  // front right

        ///////////////////////////////////////
        // INNER ARCH FRONT
        ///////////////////////////////////////
        // front Left Side
        10.0, -2.0,  -2.0,    // bottom right
        6.0,  -2.0,  -2.0,    // bottom left
        10.0,  10.0, -2.0,    // top right
        6.0,  -2.0,  -2.0,    // bottom left
        6.0,   10.0, -2.0,    // top left
        10.0,  10.0, -2.0,    // top right
        // TOP BIT
        6.0, 10.0, -2.0,
        10.0,   18.0,   -2.0,
        10.0,  10.0, -2.0,
        // front RIGHT Side
        -6.0,  -2.0,   -2.0,  // bottom right
        -10.0, -2.0,   -2.0,  // bottom left
        -6.0,   10.0,  -2.0,  // top right
        -10.0, -2.0,   -2.0,  // bottom left
        -10.0,  10.0,  -2.0,  // top left
        -6.0,   10.0,  -2.0,  // top right
        // TOP BIT
        -6.0,  10.0, -2.0,
        -10.0, 10.0, -2.0,
        -10,   18.0,   -2.0,

        ///////////////////////////////////////
        // INNER ARCH BACK
        ///////////////////////////////////////
        // front Right Side
        -10.0, -2.0,   2.0,  // bottom right
        -6.0,  -2.0,   2.0,  // bottom left
        -10.0,  10.0,  2.0,  // top right
        -6.0,  -2.0,   2.0,  // bottom left
        -6.0,   10.0,  2.0,  // top left
        -10.0,  10.0,  2.0,  // top right
        // TOP BIT
        -10.0,  10.0,  2.0,
        -6.0, 10.0,    2.0,
        -10.0,   18.0,   2.0,

        // front Right Side
        6.0,  -2.0,   2.0,  // bottom right
        10.0, -2.0,   2.0,  // bottom left
        6.0,   10.0,  2.0,  // top right
        10.0, -2.0,   2.0,  // bottom left
        10.0,  10.0,  2.0,  // top left
        6.0,   10.0,  2.0, // top right
        // TOP BIT
        6.0,  10.0,  2.0,
        10.0, 10.0,    2.0,
        10.0,   18.0,   2.0,

        //////////////////////////////////
        // INNER INNER ARCG
        //////////////////////////////////
        // LEFT
        6.0,  10.0, -2.0,  // bottom right
        6.0, -2.0, -2.0,   // bottom left
        6.0,  10.0,  2.0,  // top right
        6.0, -2.0, -2.0,   // bottom left
        6.0, -2.0,  2.0,   // top left
        6.0,  10.0,  2.0,  // top right
        // RIGHT
        -6.0, -2.0, -2.0,   // bottom left
        -6.0,  10.0, -2.0,  // bottom right
        -6.0,  10.0,  2.0,  // top right
        -6.0, -2.0,  2.0,   // top left
        -6.0, -2.0, -2.0,   // bottom left
        -6.0,  10.0,  2.0,  // top right             
    ]

    archGeometryNormals = [ 
        ///////////////////////////////////////
        // OUTER ARCH
        ///////////////////////////////////////
        // LEFT
        -1.0, 0.0, 0.0, 
        -1.0, 0.0, 0.0, 
        -1.0, 0.0, 0.0, 
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,  
        -1.0, 0.0, 0.0,
        // RIGHT
        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,  
        1.0, 0.0, 0.0,
        // TOP
        0.0, 1.0, 0.0, 
        0.0, 1.0, 0.0, 
        0.0, 1.0, 0.0, 
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,  
        0.0, 1.0, 0.0,

        ///////////////////////////////////////
        // INNER ARCH LEFT
        ///////////////////////////////////////
        // front Left Side
        0.0, 0.0, -1.0, 
        0.0, 0.0, -1.0, 
        0.0, 0.0, -1.0, 
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,  
        0.0, 0.0, -1.0,
        // top bit
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,  
        0.0, 0.0, -1.0,
        // top Side
        0.0, 0.0, -1.0, 
        0.0, 0.0, -1.0, 
        0.0, 0.0, -1.0, 
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,  
        0.0, 0.0, -1.0,
        // top bit
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,  
        0.0, 0.0, -1.0,
        ///////////////////////////////////////
        // INNER ARCH RIGHT
        ///////////////////////////////////////
        // top Side
        0.0, 0.0, 1.0, 
        0.0, 0.0, 1.0, 
        0.0, 0.0, 1.0, 
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0,
        // Top bit 
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0,
        // top Side
        0.0, 0.0, 1.0, 
        0.0, 0.0, 1.0, 
        0.0, 0.0, 1.0, 
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0,
        // Top bit 
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0,
        //////////////////////////////////////
        // INNER ARCH RIGHT
        ///////////////////////////////////////
        -1.0, 0.0, 0.0, 
        -1.0, 0.0, 0.0, 
        -1.0, 0.0, 0.0, 
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,  
        -1.0, 0.0, 0.0,

        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,  
        1.0, 0.0, 0.0,
    ]

    let Points = []
    let ArcPoints = []

    for (var i = 0; i <= 100; i++)
    {
        Points.push(-1.0 + (i/100) * 2.0)
    }

    for (var i = 0; i < Points.length; ++i)
    {
        var x = Points[i] * 6.0
        var y = 10.0 + Math.sqrt(1.0 - Points[i] * Points[i]) * 6.0
        ArcPoints.push([x, y, 0.0])
    }

    for (var i = 0; i < ArcPoints.length - 1; ++i)
    {
        let A = [ ArcPoints[i + 0][0], ArcPoints[i + 0][1], 2.0 ]
        let An = normalize(subv([ 0.0, 10.0, 2.0 ], A))
        let B = [ ArcPoints[i + 0][0], ArcPoints[i + 0][1],-2.0 ]
        let Bn = normalize(subv([ 0.0, 10.0, -2.0 ], B))
        let C = [ ArcPoints[i + 1][0], ArcPoints[i + 1][1], 2.0 ]
        let Cn = normalize(subv([ 0.0, 10.0, 2.0 ], C))
        let D = [ ArcPoints[i + 1][0], ArcPoints[i + 1][1],-2.0 ]
        let Dn = normalize(subv([ 0.0, 10.0, -2.0 ], D))

        archGeometryPositions.push(...A);
        archGeometryNormals.push(...An);

        archGeometryPositions.push(...B);
        archGeometryNormals.push(...Bn);

        archGeometryPositions.push(...C);
        archGeometryNormals.push(...Cn);

        archGeometryPositions.push(...B);
        archGeometryNormals.push(...Bn);

        archGeometryPositions.push(...D);
        archGeometryNormals.push(...Dn);

        archGeometryPositions.push(...C);
        archGeometryNormals.push(...Cn);

    }

    // FRONT ARCH
    for (var i = 0; i < ArcPoints.length / 2 + 1; ++i)
    {
        archGeometryPositions.push(ArcPoints[i+0][0], ArcPoints[i+0][1], -2.0)
        archGeometryPositions.push(-10.0,   18.0,   -2.0)
        archGeometryPositions.push(ArcPoints[i+1][0], ArcPoints[i+1][1], -2.0)

        archGeometryNormals.push(0.0, 0.0, -1.0)
        archGeometryNormals.push(0.0, 0.0, -1.0)
        archGeometryNormals.push(0.0, 0.0, -1.0)
    }

    for (var i = ArcPoints.length - 1; i > ArcPoints.length / 2; --i)
    {
        archGeometryPositions.push(10.0,   18.0,   -2.0)
        archGeometryPositions.push(ArcPoints[i][0], ArcPoints[i][1], -2.0)
        archGeometryPositions.push(ArcPoints[i-1][0], ArcPoints[i-1][1], -2.0)

        archGeometryNormals.push(0.0, 0.0, -1.0)
        archGeometryNormals.push(0.0, 0.0, -1.0)
        archGeometryNormals.push(0.0, 0.0, -1.0)

    }

    archGeometryPositions.push(10.0, 18.0,   -2.0)
    archGeometryPositions.push(
        ArcPoints[Math.floor(ArcPoints.length / 2)][0],
        ArcPoints[Math.floor(ArcPoints.length / 2)][1], 
        -2.0)
    archGeometryPositions.push(-10.0, 18.0, -2.0)

    archGeometryNormals.push(0.0, 0.0, -1.0)
    archGeometryNormals.push(0.0, 0.0, -1.0)
    archGeometryNormals.push(0.0, 0.0, -1.0)

    // BACK ARCH
    for (var i = 0; i < ArcPoints.length / 2; ++i)
    {
        archGeometryPositions.push(-10.0,   18.0,   2.0)
        archGeometryPositions.push(ArcPoints[i+0][0], ArcPoints[i+0][1], 2.0)
        archGeometryPositions.push(ArcPoints[i+1][0], ArcPoints[i+1][1], 2.0)

        archGeometryNormals.push(0.0, 0.0, 1.0)
        archGeometryNormals.push(0.0, 0.0, 1.0)
        archGeometryNormals.push(0.0, 0.0, 1.0)
    }

    for (var i = ArcPoints.length-1; i > ArcPoints.length / 2; --i)
    {
        archGeometryPositions.push(ArcPoints[i][0], ArcPoints[i][1], 2.0)
        archGeometryPositions.push(10.0,   18.0,   2.0)
        archGeometryPositions.push(ArcPoints[i-1][0], ArcPoints[i-1][1], 2.0)

        archGeometryNormals.push(0.0, 0.0, 1.0)
        archGeometryNormals.push(0.0, 0.0, 1.0)
        archGeometryNormals.push(0.0, 0.0, 1.0)
    }

    archGeometryPositions.push(
        ArcPoints[Math.floor(ArcPoints.length / 2)][0],
        ArcPoints[Math.floor(ArcPoints.length / 2)][1], 
        2.0)
    archGeometryPositions.push(10.0, 18.0,   2.0)
    archGeometryPositions.push(-10.0, 18.0, 2.0)

    archGeometryNormals.push(0.0, 0.0, 1.0)
    archGeometryNormals.push(0.0, 0.0, 1.0)
    archGeometryNormals.push(0.0, 0.0, 1.0)

    const GenerateUV = function (position, normal) 
    {
        var XY = [ position[0], position[1] ]
        var YZ = [ position[1], position[2] ]
        var XZ = [ position[0], position[2] ]

       // if (Math.abs(normal[0]) == 1.0)
       // {
       //     return YZ
       // }
//
       // if (Math.abs(normal[1]) == 1.0)
       // {
       //     return XZ
       // }
       // 
       // if (Math.abs(normal[2]) == 1.0)
       // {
       //     return XY
       // }

        return lerpv(lerpv(XZ, YZ, Math.abs(normal[0])), XY, Math.abs(normal[2]))
    }

    for (var i = 0; i < archGeometryPositions.length; i += 9)
    {
        var A = [ archGeometryPositions[i + 0], archGeometryPositions[i + 1], archGeometryPositions[i + 2] ]
        var B = [ archGeometryPositions[i + 3], archGeometryPositions[i + 4], archGeometryPositions[i + 5] ]
        var C = [ archGeometryPositions[i + 6], archGeometryPositions[i + 7], archGeometryPositions[i + 8] ]

        var AN = [ archGeometryNormals[i + 0], archGeometryNormals[i + 1], archGeometryNormals[i + 2] ]
        var BN = [ archGeometryNormals[i + 3], archGeometryNormals[i + 4], archGeometryNormals[i + 5] ]
        var CN = [ archGeometryNormals[i + 6], archGeometryNormals[i + 7], archGeometryNormals[i + 8] ]

        var Auv = GenerateUV(A, AN)
        var Buv = GenerateUV(B, BN)
        var Cuv = GenerateUV(C, CN)

        archGeometryUVs.push(Auv[0] / 2.0, Auv[1] / 2.0)
        archGeometryUVs.push(Buv[0] / 2.0, Buv[1] / 2.0)
        archGeometryUVs.push(Cuv[0] / 2.0, Cuv[1] / 2.0)
    }

    return new Geometry(
        new Float32Array(archGeometryPositions),
        new Float32Array(archGeometryNormals),
        new Float32Array(archGeometryUVs)
    )
}()

let ConeGeometry = (function () 
{
 
    var coneGeometryPositions = []
    var coneGeometryNormals = []
    var coneGeometryUVs = []

    var circlePoints = []
    var N = 64
    var step = 360.0 / N
    for (var i = 0; i <= 360.0; i += step)
    {
        var x = Math.cos(i * Math.PI/180)
        var y = 0.0
        var z = Math.sin(i * Math.PI/180)
        circlePoints.push([ x, y, z ])
    }

    var topPoint = [0.0, 2.0, 0.0]

    // Bottom Face
    for (var i = 1; i < circlePoints.length; i++)
    {
        var A = [...circlePoints[i]]
        A[1] = 0.0;
        var B = [...circlePoints[i - 1]]
        B[1] = 0.0;

        coneGeometryPositions.push(
            ...B,
            ...A,
            0.0, 0.0, 0.0)
        coneGeometryNormals.push(
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0)
        coneGeometryUVs.push(
            (B[0] + 1.0) * 0.5, (B[2] + 1.0) * 0.5,
            (A[0] + 1.0) * 0.5, (A[2] + 1.0) * 0.5,
            0.5, 0.5,)
    }
    // Walls
    for (var i = 1; i < circlePoints.length; i++)
    {
        var bottomA = [...circlePoints[i]]
        bottomA[1] = 0.0;
        var bottomB = [...circlePoints[i - 1]]
        bottomB[1] = 0.0;

        coneGeometryPositions.push(
            ...topPoint,
            ...bottomA,
            ...bottomB)

        coneGeometryNormals.push(
            ...circlePoints[i],
            ...circlePoints[i],
            ...circlePoints[i - 1])
            
        coneGeometryUVs.push(
            ((Math.acos(bottomB[0]) * (180.0/Math.PI)) / 360.0) * 3.0    , 1.0,
            ((Math.acos(bottomA[0]) * (180.0/Math.PI)) / 360.0) * 3.0    , 0.0,
            ((Math.acos(bottomB[0]) * (180.0/Math.PI)) / 360.0) * 3.0    , 0.0)
    }

    return new Geometry(
        new Float32Array(coneGeometryPositions),
        new Float32Array(coneGeometryNormals),
        new Float32Array(coneGeometryUVs)
    )
}())

let ArrowGeometry = (function () {
    var ArrowGeometryPositions = []
    var ArrowGeometryNormals = []
    var ArrowGeometryUVs = []

    var circlePoints = []
    var N = 64
    var step = 360.0 / N
    for (var i = 0; i <= 360.0; i += step)
    {
        var x = Math.cos(i * Math.PI/180) * 0.25
        var y = 0.0
        var z = Math.sin(i * Math.PI/180) * 0.25
        circlePoints.push([ x, y, z ])
    }

    for (var i = 1; i < circlePoints.length; i++)
    {
        var A = [...circlePoints[i]]
        A[1] = 0.0;
        var B = [...circlePoints[i - 1]]
        B[1] = 0.0;

        ArrowGeometryPositions.push(
            ...B,
            ...A,
            0.0, 0.0, 0.0)
        ArrowGeometryNormals.push(
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0)
        ArrowGeometryUVs.push(
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5)
    }

    // Walls
    for (var i = 1; i < circlePoints.length; i++)
    {
        var topA = [...circlePoints[i]]
        topA[1] = 3.0;
        var topB = [...circlePoints[i - 1]]
        topB[1] = 3.0;

        var bottomA = [...circlePoints[i]]
        bottomA[1] = 0.0;
        var bottomB = [...circlePoints[i - 1]]
        bottomB[1] = 0.0;

        ArrowGeometryPositions.push(
            ...topB,
            ...topA, 
            ...bottomB,
            ...bottomA,
            ...bottomB,
            ...topA)

        ArrowGeometryNormals.push(
            ...circlePoints[i],
            ...circlePoints[i],
            ...circlePoints[i - 1],

            ...circlePoints[i - 1],
            ...circlePoints[i - 1],
            ...circlePoints[i])
            
        ArrowGeometryUVs.push(
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5)
    }

    for (var i = 1; i < circlePoints.length; i++)
    {
        var topA = [...circlePoints[i]]
        topA[0] *= 1.5
        topA[1] = 3.0;
        topA[2] *= 1.5
        var topB = [...circlePoints[i - 1]]
        topB[0] *= 1.5
        topB[1] = 3.0;
        topB[2] *= 1.5

        var bottomA = [...circlePoints[i]]
        bottomA[1] = 3.0;
        var bottomB = [...circlePoints[i - 1]]
        bottomB[1] = 3.0;

        ArrowGeometryPositions.push(
            ...topB,
            ...topA, 
            ...bottomB,
            ...bottomA,
            ...bottomB,
            ...topA)

        ArrowGeometryNormals.push(
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0)
            
        ArrowGeometryUVs.push(
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5)
    }

    var topPoint = [ 0.0, 4.0, 0.0 ]
    for (var i = 1; i < circlePoints.length; i++)
    {
        var bottomA = [...circlePoints[i]]
        bottomA[0] *= 1.5
        bottomA[1] = 3.0;
        bottomA[2] *= 1.5
        var bottomB = [...circlePoints[i - 1]]
        bottomB[0] *= 1.5
        bottomB[1] = 3.0;
        bottomB[2] *= 1.5

        ArrowGeometryPositions.push(
            ...topPoint,
            ...topPoint, 
            ...bottomB,
            ...bottomA,
            ...bottomB,
            ...topPoint)

        ArrowGeometryNormals.push(
            ...circlePoints[i],
            ...circlePoints[i],
            ...circlePoints[i - 1],

            ...circlePoints[i - 1],
            ...circlePoints[i - 1],
            ...circlePoints[i])
            
        ArrowGeometryUVs.push(
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5,
            0.5, 0.5)
    }


    return new Geometry(
        new Float32Array(ArrowGeometryPositions),
        new Float32Array(ArrowGeometryNormals),
        new Float32Array(ArrowGeometryUVs)
    )
}())

function MeshGeometry(file)
{
    const lines = file.split('\n')

    var uniquePositions = []
    var uniqueNormals = []
    var uniqueUvs = []

    var positions = []
    var normals = []
    var uvs = []

    for (var i = 0; i < lines.length; ++i)
    {
        const chunks = lines[i].split(' ')
        if (chunks[0] == 'v')
        {
            uniquePositions.push([ 
                parseFloat(chunks[1]), 
                parseFloat(chunks[2]), 
                parseFloat(chunks[3])])
        }
        else
        if (chunks[0] == 'vt')
        {
            uniqueUvs.push([ 
                parseFloat(chunks[1]), 
                parseFloat(chunks[2])])
        }
        else
        if (chunks[0] == 'vn')
        {
            uniqueNormals.push([ 
                parseFloat(chunks[1]), 
                parseFloat(chunks[2]), 
                parseFloat(chunks[3])])
        }
        else
        if (chunks[0] == 'f')
        {
            const A = chunks[1].split('/')
            const B = chunks[2].split('/')
            const C = chunks[3].split('/')

            // quads
            if (chunks.length == 5)
            {
                const D = chunks[4].split('/')

                positions.push(...uniquePositions[parseInt(A[0]) - 1])
                normals.push(...uniqueNormals[parseInt(A[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(A[1]) - 1])
    
                positions.push(...uniquePositions[parseInt(B[0]) - 1])
                normals.push(...uniqueNormals[parseInt(B[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(B[1]) - 1])
    
                positions.push(...uniquePositions[parseInt(C[0]) - 1])
                normals.push(...uniqueNormals[parseInt(C[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(C[1]) - 1])
    
                positions.push(...uniquePositions[parseInt(C[0]) - 1])
                normals.push(...uniqueNormals[parseInt(C[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(C[1]) - 1])
    
                positions.push(...uniquePositions[parseInt(D[0]) - 1])
                normals.push(...uniqueNormals[parseInt(D[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(D[1]) - 1])
    
                positions.push(...uniquePositions[parseInt(A[0]) - 1])
                normals.push(...uniqueNormals[parseInt(A[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(A[1]) - 1])   
            }

            // tris
            if (chunks.length == 4)
            {
                positions.push(...uniquePositions[parseInt(A[0]) - 1])
                normals.push(...uniqueNormals[parseInt(A[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(A[1]) - 1])
    
                positions.push(...uniquePositions[parseInt(B[0]) - 1])
                normals.push(...uniqueNormals[parseInt(B[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(B[1]) - 1])
    
                positions.push(...uniquePositions[parseInt(C[0]) - 1])
                normals.push(...uniqueNormals[parseInt(C[2]) - 1])
                uvs.push(...uniqueUvs[parseInt(C[1]) - 1])
            }
        }

    }

    return new Geometry(
        new Float32Array(positions), 
        new Float32Array(normals), 
        new Float32Array(uvs))
}


let LandscapeGeometry = function () {
    let geometry = new Geometry(
        new Float32Array(QuadGeometry.positions),
        new Float32Array(QuadGeometry.normals),
        new Float32Array(QuadGeometry.uvs))

    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)
    geometry = tesselate(geometry)

    for (var i = 0; i < geometry.positions.length; i += 3)
    {
        const position = [geometry.positions[i + 0], geometry.positions[i + 1], geometry.positions[i + 2]]


        const height = (noise(position[0] * 10.0, position[1] * 10.0, 0.0) * 1.0)
            +
            (noise(position[0] * 1, position[1] * 1, 0.0) * 16.0)
        //const height = Math.sin(position[0] * 10.0) + Math.cos(position[1] * 10.0)

        geometry.positions[i + 0] = position[0]
        geometry.positions[i + 1] = position[1]
        geometry.positions[i + 2] = position[2] + height
    }

    return geometry;
}()