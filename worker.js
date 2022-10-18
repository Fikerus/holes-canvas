const w = 100
const h = 100

let ctx = null
let font = null
let offset = null

onmessage = (event) => {
    const data = event.data
    const message = data.message

    if (message === 'setup') {
        ctx = data.canvas.getContext('2d')
        ctx.canvas.width = w
        ctx.canvas.height = h
        font = data.font
        offset = data.offset
    }
    if (message === 'text') {
        ctx.font = font
        let text = data.text.split('').join(String.fromCharCode(8202))
        const metrics = ctx.measureText(text)
        const textWidth = metrics.width
        const textHeight = Math.max(metrics.actualBoundingBoxAscent, metrics.actualBoundingBoxDescent) * 2
        console.log(textWidth)
        console.log(textHeight)

        ctx.canvas.width = Math.ceil(textWidth) + offset
        ctx.canvas.height = Math.ceil(textHeight) + offset

        ctx.font = font

        const width = ctx.canvas.width
        const height = ctx.canvas.height

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = 'black'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, offset/2, height/2)

        postMessage({message: 'resize', width: width})
    }
    if (message === 'count') {
        console.time('test')
        const pixels = getPixels(ctx, ctx.canvas.width, ctx.canvas.height)
        let result = countHoles(pixels)
        postMessage({message: 'completed', count: result})
        console.timeEnd('test')
    }
}

function getPixels(ctx, width, height){
    const rawdata = ctx.getImageData(0, 0, width, height).data
    const data = []
    for (let y=0; y<height; ++y){
        const row = []
        for (let x=0; x<width; ++x){
            row.push(rawdata[(y*width + x) * 4] < 128 ? 0 : 255)
        }
        data.push(row)
    }
    return data
}

function countHoles(pixels){
    const visited = pixels.map(arr => arr.map(() => false))
    let count = 0
    const stack = []
    const areas = []

    function DFS(x, y){
        if (y < 0 || y >= pixels.length || x < 0 || x >= pixels[0].length || visited[y][x] || pixels[y][x] === 0){
            return
        }

        if (areas.length)
            areas[areas.length-1] += 1

        visited[y][x] = true

        if (paint){
            ctx.fillStyle = "lime"
            ctx.fillRect( x, y, 1, 1 )
        }

        stack.push(() => DFS(x + 1, y))
        stack.push(() => DFS(x, y + 1))
        stack.push(() => DFS(x - 1, y))
        stack.push(() => DFS(x, y - 1))
    }
    function execDFS(x, y){
        DFS(x, y)
        let task
        while (stack.length){
            task = stack.shift()
            task()
        }
    }

    let paint = false

    execDFS(0, 0) // Don't count and paint the background

    paint = true

    for (let y=0; y<pixels.length; ++y){
        for (let x=0; x<pixels[0].length; ++x){
            if(!visited[y][x]){
                if (pixels[y][x]===255){
                    areas.push(0)
                    count += 1
                }
                execDFS(x, y)
            }
        }
    }
    areas.map(area => {
        if (area < 4){
            count -= 1
        }
    })
    return count
}