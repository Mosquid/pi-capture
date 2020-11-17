const util = require('util')
const fs = require('fs')
const { exec } = require('child_process')
const { promisify } = util
const shell = promisify(exec)
const folder = './images/'

async function captureImage(_, res) {
  try {
    const ts = new Date().getTime()
    await shell(`raspistill -v -o ${folder}/${ts}.jpg`)

    res.writeHead(301, {
      'Cache-Control': 'no-cache',
      Location: 'image',
    })
    res.end()
  } catch ({ stderr }) {
    res.writeHead(400)
    res.end(stderr)
  }
}

async function handleImageRequest(_, res) {
  const files = fs.readdirSync(folder)
  const images = files.filter((file) => file.endsWith('.jpg'))
  const [latest] = images.reverse()
  const binary = fs.readFileSync(folder + latest)

  res.writeHead(200, { 'Content-Type': 'image/jpg' })
  res.end(binary, 'binary')
}

module.exports.captureImage = captureImage
module.exports.handleImageRequest = handleImageRequest
