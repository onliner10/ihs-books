module.exports = function(associative_array) {
  var result = [];
  associative_array.forEach(function(item) {
    result.push(item.value);
  });

  return result;
}
