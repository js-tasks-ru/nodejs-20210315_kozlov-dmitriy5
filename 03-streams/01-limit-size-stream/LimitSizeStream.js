const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.currentTransferedBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    if (chunk && (chunk.length + this.currentTransferedBytes <= this.limit)){
      this.currentTransferedBytes += chunk.length;
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }

  _flush(callback){
    console.log('Max limit transfered bytes =', this.limit);
    callback();
  }

  _final(callback){
    console.log('Avalible bytes =', this.limit - this.currentTransferedBytes);
    callback();
  }
}

module.exports = LimitSizeStream;
