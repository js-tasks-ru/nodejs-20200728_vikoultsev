const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lastLine = '';
    this.encoding = options.encoding;
  }

  _transform(chunk, encoding, callback) {
    const string = this.lastLine + chunk.toString(this.encoding);
    const textLines = string.split(os.EOL);
    this.lastLine = textLines.pop();

    for (const line of textLines) {
      this.push(line);
    }

    callback(null);
  }

  _flush(callback) {
    this.push(this.lastLine);
    callback(null);
  }
}

module.exports = LineSplitStream;
