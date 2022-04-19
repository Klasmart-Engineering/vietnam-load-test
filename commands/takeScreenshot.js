module.exports.command = function (filePath, callback) {
  var self = this;
  this.saveScreenshot(`screens/${filePath}`, callback);
  return this;
};
