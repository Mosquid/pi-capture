const http = require('http')
const { captureImage, handleImageRequest } = require('./routes')

const port = process.env.port || 1488
const router = {
  '/': captureImage,
  '/image': handleImageRequest,
}

async function requestHandler(req, res) {
  const { url } = req

  if (router.hasOwnProperty(url)) return router[url](...arguments)

  res.writeHead(404)
  res.end('Not found')
}

const server = http.createServer(requestHandler)

server.listen(port)
