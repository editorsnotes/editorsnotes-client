var fs = require('fs')
  , child_process = require('child_process')
  , gettextParser = require('gettext-parser')
  , Immutable = require('immutable')
  , argv = require('minimist')(process.argv.slice(2))
  , lang = argv._[0] || 'en'
  , stringsFiles

function getTranslationsFromFiles() {
  stringsFiles = child_process
    .execSync('find ./src/components -name strings.js', { encoding: 'utf-8' })
    .trim()
    .split('\n')

  output = {
    charset: 'UTF-8',

    headers: {
      'content-type': 'text/plain; charset=UTF-8',
      'project-id-version': "Editors' Notes",
      'language': lang
    },

    translations: {
      '': {
      }
    }
  }

  stringsFiles.forEach(file => {
    var component = file.split('/').slice(-2, -1)[0]
      , strings = require(file)
      , header

    strings = Object.keys(strings).map(key => strings[key]);

    strings.forEach(val => {
      var plural = Array.isArray(val)
        , key = plural ? val[0] : val
        , translation

      translation = output.translations[''][key] = {}
      translation.msgid = key;

      if (plural) {
        translation.msgid_plural = val[1];
      }

      if (lang === 'en') {
        translation.msgstr = val;
      } else {
        translation.msgstr = plural ? val.map(() => '') : '';
      }

      translation.comments = { reference: file }
    });
  });

  return output;
}

function getExistingTranslation() {
  try {
    var poString = fs.readFileSync(`./locale/${lang}/LC_MESSAGES/main.po`, 'utf8')
      , poData = gettextParser.po.parse(poString)

    return poData
  } catch (err) {
    return null;
  }
}

function isEmpty(translation) {
  return translation.get('msgstr').every(str => str);
}

function merge(generated, existing) {
  var generatedMap
    , existingMap

  if (!existing) return generated;

  generatedMap = Immutable.fromJS(generated);
  existingMap = Immutable.fromJS(existing);

  existingMap
    .getIn(['translations', ''])
    .forEach((val, key) => {
      generatedMap = generatedMap.deleteIn(['translations', '', key]);
    })

  return (
    existingMap
      .updateIn(['translations', ''], translations => (
        translations.merge(generatedMap.getIn(['translations', ''])))))
}

var translation = getTranslationsFromFiles()
  , existing = getExistingTranslation()
  , merged = merge(translation, existing)

  console.log(JSON.stringify(merged, true, '  '));

var z = gettextParser.po.compile(merged.toJS());

console.log(z.toString());
