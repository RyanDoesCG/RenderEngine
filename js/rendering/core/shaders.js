function createShader(gl, stage, source) 
{
    var shader = gl.createShader(stage);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) 
    {
        return shader;
    }

    var compileLog = gl.getShaderInfoLog(shader);
    log (compileLog)
    var error = compileLog.split(':')

    var lines = source.split('\n')
    var line = error[2];

    var goodcode = source.split(lines[line-1])[0]
    var badcode = (lines[line])
    var goodcode2 = source.split(lines[line-1])[1]

   log(goodcode + '%c'+lines[line-1]+'%c'+ goodcode2);
    gl.deleteShader(shader);
}

function createProgram(gl, vertexStage, FragmentStage) 
{
    var program = gl.createProgram();
    gl.attachShader(program, vertexStage);
    gl.attachShader(program, FragmentStage);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    alert(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function extractUniforms(vertexSource, fragmentSource)
{
    const uniforms = new Map()
    const processShader = (source) =>
    {
        const lines = source.split('\n')
        for (var i = 0; i < lines.length; ++i)
        {
            const words = lines[i].split(' ').filter ( v => v )
            const token = words.indexOf('uniform')
            if (token != -1)
            {
                const name = words[token + 2]
                    .replace(';', '')
                    .replace('[', ' ')
                    .replace(']', ' ')
                    .split(' ')[0]
                const type = words[token + 1]
                const exposed = words.includes("#expose")
                if (type == "float" && exposed)
                {
                    const min = words
                        .filter(v => v.includes("min"))[0]
                        .split("=")[1]
                    const max = words
                        .filter(v => v.includes('max'))[0]
                        .split('=')[1]
                    const step = words
                        .filter(v => v.includes('step'))[0]
                        .split('=')[1]
                    const value = words
                        .filter(v => v.includes('default'))[0]
                        .split('=')[1]
                    uniforms.set(name, new UniformFloat(name, type, null, exposed, min, max, step, value))
                }
                else
                {
                    uniforms.set(name, new Uniform(name, type, null, exposed))
                }
            }
        }  
    }

    processShader(vertexSource)
    processShader(fragmentSource)

    return uniforms
}