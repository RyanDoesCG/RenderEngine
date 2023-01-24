const MinTabWidth = 100

class EditorTab
{
    constructor(tag)
    {
        this.tag = tag
        this.x = 0
        this.y = 0
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.widthPercentage = 100
        this.heightPercentage = 100
        this.div = null
        this.html = null
        this.dividers = []
    }

    generateHTML()
    {
        this.div = document.createElement('div')
        this.div.id = this.tag
        this.div.innerHTML = "<h2>" + this.tag + "</h2>"
        this.div.className = "tab"
        this.div.style.position = "absolute"
        this.div.style.background = "rgb(" + (Math.random() * 255) + ", " + (Math.random() * 255) + ", " + (Math.random() * 255) + ")"
        if (this.html)
        {
            this.div.appendChild(this.html)
        }

        document.body.appendChild(this.div)
    }

    moveX (delta)
    {
        this.x += delta
        this.div.style.left = (this.x) + "px"
        this.updateDividers()
    }

    moveY (delta)
    {
        this.y += delta
        this.div.style.top  = (this.y) + "px"
        this.updateDividers()
    }

    adjustWidth (delta)
    {
        this.width += delta
        this.div.style.width = (this.width - 8) + "px"
        this.updateDividers()
    }
    
    adjustHeight(delta)
    {
        this.height += delta
        this.div.style.height = (this.height - 8) + "px"
        this.updateDividers()
    }

    resizeHTML(x, y, width, height)
    {
        this.x = x
        this.y = y
        this.width = width;
        this.height = height;
        this.div.style.width  = ( this.width - 8 )+ "px"
        this.div.style.height = ( this.height - 8 )+ "px"
        this.div.style.left = (this.x) + "px"
        this.div.style.top  = (this.y) + "px"
        this.updateDividers()
    }

    updateDividers()
    {
        for (var i = 0; i < this.dividers.length; ++i)
        {
            this.dividers[i].resizeHTML()
        }
    }
}

const DividerVertical   = 0
const DividerHorizontal = 1

class EditorTabDivider
{
    constructor(tabsA, tabsB, orientation)
    {
        this.tabsA = tabsA
        this.tabsB = tabsB
        this.orientation = orientation

        for (var i = 0; i < tabsA.length; ++i)
            tabsA[i].dividers.push(this)
        for (var i = 0; i < tabsB.length; ++i)
            tabsB[i].dividers.push(this)

        if (this.orientation == DividerVertical)
        {
            this.x = tabsA[0].x + tabsA[0].width
            this.y = 0
            this.width = 8
            for (var i = 0; i < tabsA.length; ++i)
            {
                this.height += tabsA[i].height
            }
        }
        else
        {
            this.x = tabsA[0].x
            this.y = tabsA[0].y + tabsA[0].height
            this.width = tabsA[0].width
            this.height = 8
        }

        this.div = null
    }

    generateHTML()
    {
        this.div = document.createElement('div')
        this.div.className = "divider"
        this.div.style.position = "absolute"
        this.div.style.width  = this.width + "px"
        this.div.style.height = this.height+ "px"
        if (this.orientation == DividerVertical)
        {
            this.div.style.left = (this.x - this.width * 0.5) + "px"
            this.div.style.top  = (this.y) + "px"
        }
        else
        {
            this.div.style.left = (this.x) + "px"
            this.div.style.top  = (this.y - this.height * 0.5) + "px"
        }

        document.body.appendChild(this.div)
        this.attachHandlers()
    }

    attachHandlers()
    {
        let self = this

        var grabbed = false
        var lastMouse = [ 0, 0 ]
        document.addEventListener('mousedown', function(e)
        {
            if (e.target == self.div)
            {
                self.div.className = "dividerGrabbed"
                grabbed = true
                lastMouse = [ e.clientX, e.clientY ]
            }
        })

        document.addEventListener('mouseup', function(e)
        {
            self.div.className = "divider"
            grabbed = false
        })

        var move = function (e)
        {
            if (grabbed)
            {
                var movement = 0
                
                if (self.orientation == DividerVertical)
                {
                    movement = lastMouse[0] - e.clientX
                    if (self.tabsB[0].width + movement < MinTabWidth)
                        return
                    if (self.tabsA[0].width - movement < MinTabWidth)
                        return
                    for (var i = 0; i < self.tabsA.length; ++i)
                    {
                        self.tabsA[i].adjustWidth(-movement)
                    }
                    for (var i = 0; i < self.tabsB.length; ++i)
                    {
                        self.tabsB[i].moveX(-movement)
                        self.tabsB[i].adjustWidth(movement)
                    }
                }
                else
                {
                    movement = lastMouse[1] - e.clientY
                    if (self.tabsB[0].height + movement < MinTabWidth)
                        return  
                    if (self.tabsA[0].height - movement < MinTabWidth)
                        return
                    for (var i = 0; i < self.tabsA.length; ++i)
                    {
                        self.tabsA[i].adjustHeight(-movement)
                    }
                    for (var i = 0; i < self.tabsB.length; ++i)
                    {
                        self.tabsB[i].moveY(-movement)
                        self.tabsB[i].adjustHeight(movement)
                    }
                    movement = lastMouse[1] - e.clientY
                }

                self.resizeHTML()
                lastMouse = [ e.clientX, e.clientY ]
            }
        }

        self.div.addEventListener('mousemove', move)
        for (var i = 0; i < self.tabsA.length; ++i)
        {
            self.tabsA[i].div.addEventListener('mousemove', move)
        }

        for (var i = 0; i < self.tabsB.length; ++i)
        {
            self.tabsB[i].div.addEventListener('mousemove', move)
        }
    }

    resizeHTML()
    {
        if (this.orientation == DividerVertical)
        {
            this.x                = this.tabsA[0].x + this.tabsA[0].width
            this.height = 0
            for (var i = 0; i < this.tabsA.length; ++i)
            {
                this.height += this.tabsA[i].height
            }
            this.div.style.width  = this.width + "px"
            this.div.style.height = this.height+ "px"
            this.div.style.left   = (this.x - this.width * 0.5) + "px"
            this.div.style.top    = (this.y) + "px"
        }
        else
        {
            this.x                = this.tabsA[0].x
            this.y                = this.tabsA[0].y + this.tabsA[0].height
            this.width            = this.tabsA[0].width
            this.div.style.width  = this.width + "px"
            this.div.style.height = this.height+ "px"
            this.div.style.left   = (this.x) + "px"
            this.div.style.top    = (this.y - this.height * 0.5) + "px"
        }
    }
}

class EditorWindow
{
    constructor()
    {
        this.tabs     = []
        this.dividers = []
    }

    addTabs(tablist)
    {
        for (var i = 0; i < tablist.length; ++i)
        {
            this.tabs.push([])
            for (var j = 0; j < tablist[i].length; ++j)
            {
                this.tabs[i].push(tablist[i][j])
            }
        }

        console.log(this.tabs)

        // walk over vertical neighbours and insert 
        // vertica dividers that bind all neighbours
        for (var i = 1; i < this.tabs[0].length; ++i)
        {
            for (var j = 1; j < this.tabs.length; j++)
            {
                var leftTabs  = [ 
                    this.tabs[j - 1][i - 1], 
                    this.tabs[j - 0][i - 1] 
                ]
                var rightTabs = [ 
                    this.tabs[j - 1][i - 0], 
                    this.tabs[j - 0][i - 0] 
                ]
                this.dividers.push(new EditorTabDivider(
                    leftTabs, 
                    rightTabs,
                    DividerVertical))
            }
        }

        // walk over horizontal neighbours and insert
        // horizontal dividers that bind pairs
        for (var i = 0; i < this.tabs[0].length; ++i)
        {
            for (var j = 1; j < this.tabs.length; j++)
            {
                this.dividers.push(new EditorTabDivider(
                    [ this.tabs[j - 1][i] ], 
                    [ this.tabs[j - 0][i] ],
                    DividerHorizontal))
            }
        }

        this.generateHTML()
        this.resizeHTML()
    }

    generateHTML()
    {
        document.body.innerHTML = ""
        for (var i = 0; i < this.tabs.length; ++i) 
        {
            for (var j = 0; j < this.tabs[i].length; ++j)
            {
                this.tabs[i][j].generateHTML()
            }
        }

        for (var i = 0; i < this.dividers.length; ++i) 
        {
            this.dividers[i].generateHTML()
        }
    }

    resizeHTML()
    {

        var y = 0
        var height = window.innerHeight / this.tabs.length
        for (var i = 0; i < this.tabs.length; ++i) 
        {
            var x = 0
            var width = window.innerWidth / this.tabs[i].length

            for (var j = 0; j < this.tabs[i].length; ++j)
            {
                this.tabs[i][j].resizeHTML(x, y, width, height)
                x += width
            }

            y += height
        }

        for (var i = 0; i < this.dividers.length; ++i) 
        {
            this.dividers[i].resizeHTML()
        }
    }
}