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