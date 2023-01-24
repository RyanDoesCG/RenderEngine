class SceneObject
{
    constructor (name, primitive, transform, material, editorOnly)
    {
        this.name       = name
        this.primitive  = primitive
        this.transform  = transform
        this.material   = material
        this.editorOnly = editorOnly
        this.id         = -1

        this.parent = null
        this.children = []
    }
}

function parentObject (parent, child)
{
    parent.children.push(child)
    child.parent = parent
    child.transform.matrix = multiplym(parent.transform.matrix, child.transform.matrix)
    for (var i = 0; i < child.children.length; ++i)
    {
        child.children[i].transform.matrix =  multiplym(parent.transform.matrix, child.children[i].transform.matrix)
    }
}

function unparentObject (child)
{
    var parent = child.parent
    if (parent.children > 0)
    {
        parent.children.splice(parent.children.indexOf(child), 1)
    }

    while (parent != null)
    {
        child.transform.matrix = multiplym(parent.transform.invMatrix, child.transform.matrix)
        parent = parent.parent
    }
    child.parent = null
}

class Scene 
{
    constructor ()
    {
        this.objects = []
        this.root = new SceneObject(
            "root", 
            null, 
            new Transform([1.0, 1.0, 1.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]),
            null,
            false);
    }

    add (object)
    {
        object.id = this.objects.length
        this.objects.push(object)
        parentObject(this.root, object)

        for (var i = 0; i < object.children.length; ++i)
        {
            this.objects.push(object.children[i])
        }
    }
}