function formatter(dictionary, config) {
  const header = config.header || '';
  const body = dictionary.allProperties.map(mapProp.bind(this, config));
  return `${header}:root {\n${body.join("\n")}\n}\n`;
}

function mapProp(config, prop) {
  const comment = (prop.comment) ? ` /* ${prop.comment} */` : '';
  const varName = makePropCSSVar(prop.name);
  const value = setValue(prop, config);
  let token = ` ${varName}: ${value};${comment}`;

  if (config.dark && prop.attributes && prop.attributes.dark) {
    const darkProp = generateDarkToken(prop);
    const darkValue = setValue(darkProp, config);
    token += `;\n ${varName}-dark: ${darkValue};`;
  }

  return token;
}

function setValue(prop, config) {
  if (typeof prop.value === "object") {
    throwObjectError(prop);
  }

  const nVal = prop.value;
  const oVal = prop.original && prop.original.value;
  if (config.deep && nVal !== oVal && isAlias(oVal)) {
    return useReferenceValue(oVal, config.prefix);
  }
  return typeIsString(prop) ? `"${nVal}"` : nVal;
}

function generateDarkToken(prop) {
  let returnProp = prop;
  if (prop.attributes && prop.attributes.dark) {
    returnProp = {
      name: prop.name+'-dark',
      value: prop.attributes.dark.value,
      original: { value: prop.attributes.dark.original },
    };
  }
  return returnProp;
}

function throwObjectError(prop) {
  let message = `"${prop.name}" has an original value of "${prop.original.value}". \n`;
  message += "This points to an object. ";
  message += "Reference the object's \"value\" key if it's an alias \n";
  throw new Error(message);
}

function isAlias(str) {
  // is string and matches "{text.value}"
  return !!(typeof str === "string" && str.match(/(^{.*\.value}$)/gm));
}

function typeIsString(prop) {
  return !!(prop.attributes && prop.attributes["data-type"] === "string");
}

function makePropCSSVar(name) {
  return `--${name}`;
}

function useReferenceValue(value, prefix) {
  const head = prefix ? `var(--${prefix}-` : "var(--";
  return `${head}${value.replace(/\./g, "-").replace(/({|-value})/g, "")})`;
}

module.exports = formatter;
