const BaseVertexSource = 
   `#version 300 es
    precision lowp float;
    uniform mat4 proj;
    uniform mat4 view;
    uniform mat4 transform;
    uniform vec3 scale;
    in vec3 vertex_position;
    in vec3 vertex_normal;
    in vec2 vertex_uv;
    out vec4 frag_worldpos;
    out vec3 frag_normal;
    out vec2 frag_uvs;
    void main() 
    {
        frag_worldpos = transform * vec4(vertex_position.xyz, 1.0);
        frag_normal = normalize((transform * vec4(vertex_normal.xyz, 0.0)).xyz);
        frag_uvs = vertex_uv;
        gl_Position = proj * view * frag_worldpos;
    }`
const BaseFragmentSourceHead = 
   `#version 300 es
    precision lowp float;
    uniform vec4 CameraPosition;
    uniform mat4 transform;
    uniform vec3 scale;
    layout (location = 0) out vec4 out_albedo;
    layout (location = 1) out vec4 out_normal;
    layout (location = 2) out vec4 out_position;
    layout (location = 3) out vec4 out_id;
    uniform vec4      Material;
    uniform float     Time;
    uniform int       ID;
    uniform int       LightingOnly;
    in vec4 frag_worldpos;
    in vec3 frag_normal;
    in vec2 frag_uvs;
    `
const BaseFragmentSourceMaterial = `
    vec4 getMaterialAlbedo ()
    {
        return Material;
    }`
const BaseFragmentSourceFoot =
   `void main ()
    {
        out_albedo = (LightingOnly == 1) ? vec4(0.5, 0.5, 0.5, 1.0) : getMaterialAlbedo();
        out_normal = vec4((frag_normal + vec3(1.0)) * 0.5, 1.0);
        out_position = vec4(frag_worldpos.xyz, distance(CameraPosition.xyz, frag_worldpos.xyz));
        out_id = vec4(float(ID) / 255.0, 0.0, 0.0, 1.0);
    }`

class Material
{
    constructor(gl, albedo, alpha, fragmentCode = BaseFragmentSourceMaterial)
    {
        this.albedo = albedo
        this.alpha = alpha

        this.fragmentCode = fragmentCode

        this.ShaderProgram = createProgram(gl,
            createShader(gl, gl.VERTEX_SHADER,   BaseVertexSource),
            createShader(gl, gl.FRAGMENT_SHADER, BaseFragmentSourceHead + this.fragmentCode + BaseFragmentSourceFoot))

        this.uniforms = extractUniforms(BaseVertexSource, BaseFragmentSourceHead + this.fragmentCode + BaseFragmentSourceFoot)
        for (const [name, uniform] of this.uniforms.entries())
        {
            uniform.location = gl.getUniformLocation(this.ShaderProgram, name)
        }
    }
}