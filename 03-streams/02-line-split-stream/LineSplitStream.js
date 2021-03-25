const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.remainder = '';
  }

  _transform(chunk, encoding, callback) {
    const rawArray = chunk.toString().split(os.EOL);

    rawArray.forEach((item, index, arr) => {
      if (arr.length > 1){
        switch (index){
          case 0:
            this.push(this.remainder + item)
            this.remainder = '';
            break
          case arr.length - 1:
            this.remainder = item;
            break
          default:
            this.push(item)
        }
      } else {
        this.remainder += item;
      }
    });
    callback();
  }

  _flush(callback) {
    this.push(this.remainder);
    this.remainder = '';
    callback();
  }
}

module.exports = LineSplitStream;