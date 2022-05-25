const fsExtra = require('fs-extra');
const path = require('path');
const webrtcTemplatePath = path.resolve(
  process.cwd() + '/reportTemplates/webrtcReport'
);
const downloadPath = path.resolve(process.cwd() + '/downloads');
const reportPath = path.resolve(process.cwd() + '/reports');
const webrtcReportPath = reportPath + '/webrtcReport';

module.exports = function (options) {
  return Object.assign({}, options || {}, {
    before: (client) => {
      //Remove all files in download directory
      fsExtra.emptyDirSync(downloadPath);
      client.url('chrome://webrtc-internals').openNewWindow();
    },

    'Dump webrtc': (client) => {
      const buttons = {
        createDump: '#content-root > details > summary',
        download:
          '#content-root > details > div > div:nth-child(1) > a > button',
      };

      client.windowHandles((result) => {
        const handle = result.value[0];
        client.switchToWindow(handle);
      });

      const { createDump, download } = buttons;
      client
        .click(createDump)
        .waitForElementVisible(download)
        .click(download)
        .pause(500)
        .waitForDownloadFinished(
          'webrtc_internals_dump.txt',
          1 * 60 * 1000,
          (result) => {
            if (result.error) {
              console.error(result.error);
            } else {
              fsExtra.copySync(webrtcTemplatePath, webrtcReportPath);
              fsExtra.copySync(
                result.value.filePath,
                webrtcReportPath + '/webrtc_internals_dump.txt'
              );
            }
            client.end();
          }
        );
    },
  });
};
