function keepRange(value, min, max) {
  var tmp = Math.min(value, max);

  return Math.max(tmp, min);
}
