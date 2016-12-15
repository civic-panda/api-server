var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var toCamelCase = require('./to-camel-case').convertKeysToCamelCase;

try {
  var files = fs.readdirSync('./congress-data');
  var yamlFiles = files
    .filter(fileName => path.extname(fileName) === '.yaml')
    .filter(fileName => fileName.indexOf('historical') === -1)
    .forEach(fileName => {
      var data = yaml.safeLoad(fs.readFileSync('./congress-data/' + fileName, 'utf8'));
      var basename = path.basename(fileName, '.yaml');
      var dataAsString = JSON.stringify(toCamelCase(data));

      fs.writeFileSync('./data/' + basename + '.json', dataAsString);
      console.log(basename + ' converted to json');
    });
} catch (e) {
  console.log(e);
}