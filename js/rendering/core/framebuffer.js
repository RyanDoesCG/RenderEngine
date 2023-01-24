function framebufferErrorString(v)
{
    if (v == 36054) return "incomplete attachments"
    if (v == 36057) return "incomplete dimensions"
    if (v == 36055) return "missing attachment"
    if (v == 36061) return "unsupported"
    return "unknown"
}

function createFramebuffer(gl, attachments, targets)
{
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    for (var i = 0; i < attachments.length; ++i)
    {
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, 
            attachments[i], 
            gl.TEXTURE_2D, 
            targets[i], 
            0); 

        
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) 
        {
            log("Framebuffer creation failed: " + framebufferErrorString(gl.checkFramebufferStatus(gl.FRAMEBUFFER)))
            log(" - - input " + i)
        }
    
    }

    return framebuffer;
}