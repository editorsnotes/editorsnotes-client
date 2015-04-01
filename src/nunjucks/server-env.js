var nunjucks = require('nunjucks')
  , child_process = require('child_process')
  , env

function getTemplatePaths() {
  var dirs = child_process.execSync('cd ' + __dirname + '/.. && find base_views admin_views -name templates -type d', { encoding: 'utf-8' }).split('\n')

  return ['templates'].concat(dirs)
}

env = new nunjucks.Environment(new nunjucks.FileSystemLoader(getTemplatePaths()));

module.exports = env;
