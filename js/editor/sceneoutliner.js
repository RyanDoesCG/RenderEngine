class SceneOutliner
{
    constructor(scene)
    {
        this.scene = scene
    }

    generateHTML()
    {
        var HTML = ""

        HTML += "<h2>World Outliner</h2>"
    
        var traverse = function (node, depth)
        {
            if (node.editorOnly == false)
            {
                //if (node.id == selected)
                //{
                //    HTML += "<p id=\"" + node.id + "\"class=\"sceneEntitySelected\">"
                //}
                //else
                {
                    HTML += "<p id=\"" + node.id + "\" class=\"sceneEntity\">"
                }
        
                for (var i = 0; i < depth; ++i) HTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                HTML += node.name
                HTML += "</p>"
        
                for (var i = 0; i < node.children.length; ++i)
                {
                    traverse(node.children[i], depth + 1)
                }
            }
        }
    
        traverse(this.scene.root, 1)
    
        document.getElementById('outliner').innerHTML = HTML

    }

    attachHandlers()
    {
    //   var entities = document.getElementsByClassName('sceneEntity')
    //   for (var i = 0; i < entities; ++i)
    //   {
    //       entities[i].addEventListener('click', function (e)
    //       {
    //           selected = e.target.id
    //       })
    //   }
    }
}