const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', {alpha: false})
const input = document.getElementById('input')
const button = document.getElementById('button')
const result = document.getElementById('result')

const fontSize = 200
const font = `${fontSize}px arial`
ctx.font = font
const offset = 20

ctx.canvas.width = 500
ctx.canvas.height = 500

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      button.click()
    }
})

function getImage(ctx, width, height){
    const rawdata = ctx.getImageData(0, 0, width, height).data
    // console.log(rawdata)
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
// Old and bad function
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
    let text = input.value.split("").join(String.fromCharCode(8202))
    const textWidth = ctx.measureText(text).width

    ctx.canvas.width = Math.ceil(textWidth) + offset

    ctx.font = font

    const width = ctx.canvas.width
    const height = ctx.canvas.height

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = "black"
    ctx.fillText(text, offset/2, height/2 + 50)

    const data = getImage(ctx, width, height)

    result.textContent = countHoles(data)
}