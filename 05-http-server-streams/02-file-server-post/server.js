const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const parsedURL = path.parse(req.url);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (parsedURL.root !== parsedURL.dir) {
        res.statusCode = 400;
        res.end('Invalid URL!');
        return;
      }

      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (!err) {
          res.statusCode = 409;
          res.end('File exists!');
        } else {
          req.on('close', function() {
            if (this.aborted) {
              fs.unlink(filepath, () =>{});
            }
          });

          const writeStream = fs.createWriteStream(filepath, {flags: 'wx'})
              .on('error', (err) => {
                res.statusCode = 500;
                res.end('Internal server error');
              })
              .on('finish', () => {
                res.statusCode = 201;
                res.end('Done!');
              });

          const limitStream = new LimitSizeStream({limit: 1000000});
          limitStream.on('error', (error) => {
            if (error.code === 'LIMIT_EXCEEDED') {
              res.statusCode = 413;
              res.end('Limit exceeded!');
            } else {
              res.statusCode = 500;
              res.end('Internal server error');
            }
            fs.unlink(filepath, () => {});
          });

          req.pipe(limitStream).pipe(writeStream);
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
