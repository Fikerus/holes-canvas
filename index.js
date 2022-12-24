const canvas = document.getElementById('canvas')
const progress = document.getElementById('progress').getContext('2d')
const input = document.getElementById('input')
const button = document.getElementById('button')
const result = document.getElementById('result')

const fontSize = 200
const font = `${fontSize}px arial`
const offset = 20

progress.canvas.width = 610
progress.canvas.height = 50
fillAndDrawPercentage(progress, 0)


const offscreen = canvas.transferControlToOffscreen()
const worker = new Worker('worker.js')
worker.postMessage({message: 'setup', font: font, offset: offset, canvas: offscreen}, [offscreen])

worker.onmessage = (event) => {
    const data = event.data
    if (data.message === 'completed') {
        result.textContent = `Number of holes: ${data.count}`

        fillAndDrawPercentage(progress, 100)
    }
    if (data.message === 'percentage') {
        fillAndDrawPercentage(progress, data.percentage)
    }
}

input.oninput = () => {
    result.textContent = `Number of holes: ${0}`
    let text = input.value

    worker.postMessage({message: 'text', text: text})
    fillAndDrawPercentage(progress, 0)
}

input.oninput()

input.onkeypress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      button.click()
    }
}

button.onclick = () => {
    input.oninput()

    worker.postMessage({message: 'count'})
}

function fillAndDrawPercentage(ctx, percentage) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = 'lime'
    ctx.fillRect(0, 0, percentage / 100 * progress.canvas.width, progress.canvas.height)
    ctx.fillStyle = 'black'
    ctx.font = '40px arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${percentage}%`, progress.canvas.width / 2, progress.canvas.height / 2)
}