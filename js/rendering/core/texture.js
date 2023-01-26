function createColourTexture(gl, width, height, format, type)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = format;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = type;
    const data = null;

    gl.texImage2D(
        gl.TEXTURE_2D, 
        level, 
        internalFormat,
        width, 
        height, 
        border, 
        srcFormat, 
        srcType,
        data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     
    return texture;
}

function createBitmapTexture(gl, pixels)
{
    const data = new Uint8Array(pixels);
    const width = Math.floor(Math.sqrt(pixels.length));
    const height = width;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.R8;
    const border = 0;
    const srcFormat = gl.RED
    const srcType = gl.UNSIGNED_BYTE;

    gl.texImage2D(
        gl.TEXTURE_2D, 
        level, 
        internalFormat,
        width, 
        height, 
        border, 
        srcFormat, 
        srcType,
        data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     
    return texture;
}

function createVolumeTexture(gl, data, size)
{
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_3D, texture);

    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, 0);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texImage3D(
        gl.TEXTURE_3D, 
        0, 
        gl.R8,
        size[0], 
        size[1], 
        size[2],
        0, 
        gl.RED, 
        gl.UNSIGNED_BYTE,
        data);

    gl.generateMipmap(gl.TEXTURE_3D);

    return texture;
}

function updateVolumeTexture(gl, texture, data, size)
{
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_3D, texture);

    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, 0);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texImage3D(
        gl.TEXTURE_3D, 
        0, 
        gl.R8,
        size[0], 
        size[1], 
        size[2],
        0, 
        gl.RED, 
        gl.UNSIGNED_BYTE,
        data);
    gl.generateMipmap(gl.TEXTURE_3D);
}

function createDepthTexture (gl, width, height)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.DEPTH_COMPONENT24;
    const border = 0;
    const format = gl.DEPTH_COMPONENT;
    const type = gl.UNSIGNED_INT;
    const data = null;

    gl.texImage2D(
        gl.TEXTURE_2D, 
        level, 
        internalFormat,
        width, 
        height, 
        border,
        format, 
        type, 
        data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     
    return texture;
}

var ImagesLoaded = []; 

function loadTexture(gl, texturePath)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const data = new Uint8Array([255, 0, 255, 255]);
    gl.texImage2D(
        gl.TEXTURE_2D, 
        level, 
        internalFormat,
        width, 
        height, 
        border, 
        srcFormat, 
        srcType,
        data);

    var index = ImagesLoaded.length;
    ImagesLoaded.push(false)

    const image = new Image();
    image.src = texturePath;
    image.onload = function() 
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        ImagesLoaded[index] = true;
    };

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    return texture;
}

function loadBlueNoiseVolumeTexture(gl)
{
    // allocate texture and upload blank data to GPU
    size = [ 128, 128, 64 ]
    data = new Uint8Array(size[0] * size[1] * size[2])
    for (var z = 0; z < size[2]; ++z) 
    {
        for (var y = 0; y < size[1]; ++y) 
        {
            for (var x = 0; x < size[0]; ++x) 
            {
                data[x + y * size[1] + z * size[2] * size[0]] = noise(
                    (x), 
                    (y), 
                    (z)) * 255;
            }
        }
    }

    texture = createVolumeTexture(gl, data, size)

    // walk through folder and request a load on all textures
    slices = 64;
    for (var i = 0; i < slices; ++i)
    {
        const image = new Image();
        image.src = 'images/noise/STBN/stbn_scalar_2Dx1Dx1D_128x128x64x1_' + i + '.png'
        image.onload = function()
        {
            const slice = i;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_3D, texture);
        
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, 0);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        
            gl.texSubImage3D(gl.TEXTURE_3D, 
                0, 
                0, 
                0, 
                0, 
                image.width, 
                image.height, 
                1, 
                gl.R, 
                gl.UNSIGNED_BYTE, 
                image);

            gl.generateMipmap(gl.TEXTURE_3D);
        }
    }

    return texture;
}