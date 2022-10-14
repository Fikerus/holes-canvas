function countHoles(pixels){
    const visited = pixels.map(arr => arr.map(() => false))
    let count = 0
    function DFS(x, y){
      if (y < 0 || y >= pixels.length || x < 0 || x >= pixels[0].length || visited[y][x] || pixels[y][x] === 0){
        return
      }
      visited[y][x] = true

      if (paint){
        ctx.fillStyle = "lime"
        ctx.fillRect( x, y, 1, 1 )
      }

      DFS(x + 1, y)
      DFS(x, y + 1)
      DFS(x - 1, y)
      DFS(x, y - 1)
    }

    let paint = false

    DFS(0, 0) // Don't count and paint the background

    paint = true

    for (let y=0; y<pixels.length; ++y){
      for (let x=0; x<pixels[0].length; ++x){
        if(!visited[y][x]){
          if (pixels[y][x]===255){
            count += 1
          }
          DFS(x, y)
        }
      }
    }
    return count
  }