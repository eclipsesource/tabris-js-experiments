var utils = require('../_utils')

module.exports = function(options) {

  options = utils.extend({
    // flag used to trigger only the local tests without using saucelabs
    saucelabs: false
  }, options)
  // run karma
  return utils.exec(
    './node_modules/karma/bin/karma',
    [
      'start',
      'tasks/test/karma.conf.js'
    ],
    // add some environment variables also used in karma.conf.js
    {
      LIBRARY_NAME: global.library
    }
  )

}
