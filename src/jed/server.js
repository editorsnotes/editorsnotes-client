const Jed = require('jed')
    , path = require('path')
    , po2json = require('po2json')
    , { execSync } = require('child_process')

module.exports = function () {
  const localePath = path.join(__dirname, '..', '..', 'locale');

  const files = (
    execSync('find ' + localePath + ' -type f -name *po', { encoding: 'utf-8' })
    .trim()
    .split('\n')
  )

  const data = files.reduce((acc, file) => {
    const domain = 'messages_' + path.basename(file).replace('.po', '')
        , poData = po2json.parseFileSync(file, { format: 'jed1.x', domain })

    acc.locale_data[domain] = poData.locale_data[domain];
    return acc;
  }, { domain: 'messages_main', locale_data: {} });

  return new Jed(data);
}
