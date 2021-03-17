function sum(a, b) {
  if (typeof a == 'number' && typeof b == 'number'){
    return a + b
  }
  throw TypeError('Both args must be Numbers')
}

module.exports = sum;
