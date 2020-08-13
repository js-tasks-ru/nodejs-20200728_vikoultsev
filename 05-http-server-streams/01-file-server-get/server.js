const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const parsedURL = path.parse(req.url);

  if (parsedURL.root !== parsedURL.dir) {
    res.statusCode = 400;
    res.end('Invalid URL!');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      fs.access(filepath, fs.constants.R_OK, (err) => {
        if (!err) {
          fs.createReadStream(filepath)
              .on('error', (err) => {
                console.log(err);
              })
              .pipe(res);
        } else {
          res.statusCode = 404;
          res.end('Not found!');
        }
      });

      break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

module.exports = server;
