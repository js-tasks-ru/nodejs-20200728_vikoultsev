const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const chunkSize = Buffer.byteLength(chunk, encoding);
    if (chunkSize > this.limit) {
      callback(new LimitExceededError());
      return;
    }
    this.limit -= chunkSize;
    this.push(chunk);
    callback(null);
  }
}

module.exports = LimitSizeStream;
