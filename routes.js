const util = require('util')
const querystring = require('querystring')
const url = require('url')
const fs = require('fs')
const { exec } = require('child_process')
const { promisify } = util
const shell = promisify(exec)
const folder = __dirname + '/images/'

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

async function handleImageRequest(req, res) {
  try {
    const files = fs.readdirSync(folder)
    const images = files.filter((file) => file.endsWith('.jpg')).reverse()
    const [latest] = images
    const { query } = url.parse(req.url)
    const params = querystring.parse(query)
    const _offset = parseInt(params.offset)
    const offset = isNaN(parseInt(_offset))
      ? 0
      : Math.min(images.length - 1, parseInt(_offset))
    const imageFile = offset ? images[offset] : latest
    const binary = fs.readFileSync(folder + imageFile)

    res.writeHead(200, { 'Content-Type': 'image/jpg' })
    res.end(binary, 'binary')
  } catch (error) {
    res.writeHead(400)
    res.end(error)
  }
}

module.exports.captureImage = captureImage
module.exports.handleImageRequest = handleImageRequest
