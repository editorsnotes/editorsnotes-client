var nunjucks = require('nunjucks')
  , child_process = require('child_process')
  , extensions = require('./extensions')
  , typogr = require('typogr')
  , env = new nunjucks.Environment();

env.addExtension('url', new extensions.URL());
env.addExtension('trans', new extensions.Trans());
env.addFilter('typogrify', function (str) {
  return typogr.typogrify(str);
});

function getTemplatePaths() {
  var dirs = child_process.execSync('cd ' + __dirname + '/.. && find . -wholename *templates*html -type f', { encoding: 'utf-8' }).split('\n')

  return dirs;
}

getTemplatePaths().forEach(function (dir) {
  var d = __dirname + '/../' + dir
    , name = dir.replace(/.*templates\//, '');

  var thing = nunjucks.precompile(d, { env: env, name: name });

  console.log(thing);
});
