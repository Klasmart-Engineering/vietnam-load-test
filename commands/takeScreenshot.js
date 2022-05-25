module.exports.command = function (filePath, callback) {
  this.saveScreenshot(`screens/${filePath}`, callback);
  return this;
};
