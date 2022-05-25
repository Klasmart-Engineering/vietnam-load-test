var fs = require('fs');

module.exports.command = function (fileName, timeout, callback = () => {}) {
  const filePath = require('path').resolve(
    process.cwd() + '/downloads/' + fileName
  );

  let isTimeout = false;
  setTimeout(() => {
    isTimeout = true;
  }, timeout);

  const checkDownloadFinished = (path, prev) => {
    if (isTimeout) {
      callback({ error: new Error('waitForDownloadFinished timeout') });
      return;
    }
    fs.stat(path, function (err, stat) {
      if (err) {
        callback({ error: err });
        return;
      }
      if (prev && stat.mtime.getTime() === prev.mtime.getTime()) {
        callback({ value: { filePath } });
      } else setTimeout(checkDownloadFinished, 500, path, stat);
    });
  };

  checkDownloadFinished(filePath);
};
