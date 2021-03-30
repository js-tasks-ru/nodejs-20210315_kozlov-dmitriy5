const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const LimitSizeStream = require('./LimitSizeStream');
const { fstat } = require('fs');

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  
  switch (req.method) {
    case 'POST':
      if (path.parse(filepath).dir != path.join(__dirname, 'files')){
        res.statusCode = 400;
        res.end('Doesn\'t support insert dir');
      } else {
        fs.stat(filepath, (err) => {
          if (err) {
            const fileStream = fs.createWriteStream(filepath);
            const limitStream = new LimitSizeStream({limit: 2 ** 20});
            req.pipe(limitStream).pipe(fileStream);

            limitStream.on('error', () => {
              fs.unlink(filepath, (err) => {if (err) console.log(err);});
              res.statusCode = 413;
              res.end('File is too big');
              return
            });

            req.on('aborted', () => {
              fs.unlink(filepath, (err) => {
                if (err) console.log(err);
              })
            })

            fileStream.on('finish', () => {
              res.statusCode = 201;
              res.end('OK');
            })

          } else {
            res.statusCode = 409;
            res.end('File already exist');
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
