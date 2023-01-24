class Primitive
{
    constructor (context, geometry)
    {
        this.geometry = geometry
        
        this.gl = context

        this.VertexArrayObject = this.gl.createVertexArray()
        this.gl.bindVertexArray(this.VertexArrayObject)

        this.PositionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.PositionBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.geometry.positions, this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(0);

        this.NormalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.NormalBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.geometry.normals, this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(1);
        
        this.UVBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.UVBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.geometry.uvs, this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(2);

        log("primitive created with " + (this.geometry.positions.length / 3) + " triangles")
    }

    draw ()
    {
        this.gl.bindVertexArray(this.VertexArrayObject);
        this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, this.geometry.positions.length / 3, 1);
    }
}