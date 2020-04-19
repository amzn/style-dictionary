const { fileHeaderCSS } = require('./utils');

function formatter(dictionary, config) {
  const header = fileHeaderCSS(this.options);
  const body = dictionary.allProperties.map(mapProp.bind(this, config));
  return header + ':root {\n' + body.join('; \n') + '\n}\n';
}

function mapProp(config, prop) {
  const prefixedName = addPrefix(prop.name, config.prefix);
  const varName = makePropCSSVar(prefixedName);
  const value = setValue(prop, config.prefix);
  return `${varName}: ${value}`;
}

function addPrefix(name, prefix) {
  return (prefix) ? `${prefix}-${name}` : name;
}

function makePropCSSVar(name) {
  return `--${name}`;
}

function setValue(prop, prefix) {
  const nVal = prop.value;
  const oVal = prop.original.value;
  if (nVal !== oVal && isAlias(oVal)) {
    const head = (prefix) ? `var(--${prefix}-`: `var(--`;
    return `${head}${oVal.replace(/\./g, '-').replace(/({|-value})/g, '')})`;
  } else {
    return (typeIsString(prop)) ? `"${nVal}"` : nVal;
  }
}

function isAlias(str) {
  // is string and matches "{curly.text.curly}"
  return (typeof str === "string" && str.match(/(^{.*}$)/gm)) ? true : false;
}

function typeIsString(prop) {
  return (prop.attributes && prop.attributes['data-type'] === 'string') ? true : false;
}

module.exports = {
  name: 'css/var-deep',
  formatter,
  fns: {
    mapProp,
    addPrefix,
    makePropCSSVar,
    setValue,
    isAlias,
    typeIsString
  }
}


