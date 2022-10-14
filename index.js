const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', {alpha: false})
const input = document.getElementById('input')
const button = document.getElementById('button')
const result = document.getElementById('result')

const fontSize = 50
const font = `${fontSize}px monospace`
ctx.font = font
const offset = 20

ctx.canvas.width = 100
ctx.canvas.height = 100

function getPixels(ctx, width, height){
    const data = []
    for (let y=0; y<height; ++y){
        const row = []
        for (let x=0; x<width; ++x){
            let pixel = ctx.getImageData(x, y, 1, 1).data[0]
            row.push(pixel < 128 ? 0 : 255)
        }
        data.push(row)
    }
    return data
}

button.addEventListener('click', updateButton)

function updateButton(){
    ctx.font = font
    let text = input.value
    const textWidth = ctx.measureText(text).width

    ctx.canvas.width = Math.ceil(textWidth) + offset

    ctx.font = font

    const width = ctx.canvas.width
    const height = ctx.canvas.height

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = "black"
    ctx.fillText(text, offset/2, height/2 + fontSize/2 - 10)

    const data = getPixels(ctx, width, height)

    result.textContent = countHoles(data)
}