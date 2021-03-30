const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (path.parse(filepath).dir != path.join(__dirname, 'files')){
        res.statusCode = 400;
        res.end('Server doesn\'t support inserts dir');
        return
      }
      fs.stat(filepath, (err, stat) => {
        if (err || !stat.isFile()){
          res.statusCode = 404;
          res.end('File hasn\'t found');
        } else {
          fs.unlink(filepath, (err) => {
            if (err) {
              res.statusCode = 500;
              res.end('Internal server error');
            } else {
              res.statusCode = 200;
              res.end('Succesful delete');
            }
          })
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
