const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();



server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      fs.stat(filepath, (err, stat) => {
        if (path.parse(filepath).dir != path.join(__dirname, 'files')){
          res.statusCode = 400;
          res.end('Bad requeist');
        } else if (err || !stat.isFile() ){
          res.statusCode = 404;
          res.end('File hasn\'t found');
        } else {
          let stream = new fs.ReadStream(filepath);
          stream.pipe(res);

          res.on('close', () => {
            stream.destroy();
          });
        }
      });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

server.on('error', (req, res) => {
  res.statusCode = 500;
  res.end();
})

module.exports = server;
