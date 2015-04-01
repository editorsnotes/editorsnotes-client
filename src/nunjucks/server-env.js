var nunjucks = require('nunjucks')
  , env

function getTemplatePaths() {
  var execSync = require('exec-sync')
    , dirs = execSync('cd ' + __dirname + '/.. && find base_views admin_views -name templates -type d').split('\n')

  return ['templates'].concat(dirs)
}

env = new nunjucks.Environment(new nunjucks.FileSystemLoader(getTemplatePaths()));

module.exports = env;
