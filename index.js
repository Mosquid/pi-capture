const http = require('http')
const url = require('url')
const { captureImage, handleImageRequest } = require('./routes')

const port = process.env.port || 1488
const router = {
  '/': captureImage,
  '/image': handleImageRequest,
}

async function requestHandler(req, res) {
  const { pathname } = url.parse(req.url, true)

  if (router.hasOwnProperty(pathname)) return router[pathname](...arguments)

  res.writeHead(404)
  res.end('Not found')
}

const server = http.createServer(requestHandler)

server.listen(port)
