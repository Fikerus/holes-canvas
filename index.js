const canvas = document.getElementById('canvas')
const progress = document.getElementById('progress').getContext('2d')
const input = document.getElementById('input')
const button = document.getElementById('button')
const result = document.getElementById('result')

const fontSize = 200
const font = `${fontSize}px arial`
const offset = 20

// TODO:
// Test button before completed (+) (seems okay)
// Add progress bar
// Add filling before (seems impossible)

progress.canvas.width = 50
progress.canvas.height = 50

const offscreen = canvas.transferControlToOffscreen()
const worker = new Worker('worker.js')
worker.postMessage({message: 'setup', font: font, offset: offset, canvas: offscreen}, [offscreen])

worker.onmessage = (event) => {
    const data = event.data
    if (data.message === 'completed') {
        result.textContent = `Number of holes: ${data.count}`
    }
    if (data.message === 'resize') {
        progress.canvas.width = data.width

        progress.font = '40px arial'
        progress.fillStyle = 'black'
        progress.textAlign = 'center'
        progress.textBaseline = 'middle'
        progress.fillText('I will add progress bar in future version, sorry <3', progress.canvas.width / 2, progress.canvas.height / 2)
    }
    // if (data.message === 'progress') {
    //     console.log(data.percent)
    //     progress.fillRect(0, 0, data.percent * progress.canvas.width, progress.canvas.height)
    // }
}

input.oninput = () => {
    result.textContent = `Number of holes: ${0}`
    let text = input.value

    worker.postMessage({message: 'text', text: text})
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