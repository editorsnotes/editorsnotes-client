var nunjucks = require('nunjucks')
  , extensions = require('./extensions')
  , typogr = require('typogr')
  , env = new nunjucks.Environment();

env.addExtension('url', new extensions.URL());
env.addExtension('trans', new extensions.Trans());
env.addFilter('typogrify', function (str) {
  return typogr.typogrify(str);
});

function getTemplatePaths() {
  var execSync = require('exec-sync')
    , dirs = execSync('cd ' + __dirname + '/.. && find . -wholename *templates*html -type f').split('\n')

  return dirs;
}

getTemplatePaths().forEach(function (dir) {
  var d = __dirname + '/../' + dir
    , name = dir.replace(/.*templates\//, '');

  var thing = nunjucks.precompile(d, { env: env, name: name });

  console.log(thing);
});
