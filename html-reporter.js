var HtmlReporter = require('nightwatch-html-reporter');
/* Same options as when using the built in nightwatch reporter option */
var reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory: `${__dirname}/reports/${process.env.RUN_TIME}-${process.env.TEST_NAME}/${process.env.PARTICIPANTID}` ,
  reportFilename: 'selenium_log.html',
  uniqueFilename: false,
});
 
module.exports = {
  write : function(results, options, done) {
    reporter.fn(results, done);
  }
};