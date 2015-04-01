var nunjucks = require('nunjucks/browser/nunjucks-slim')
  , env = new nunjucks.Environment(null);

require('./compiled_templates');

module.exports = env;
