
const ignoredPaths = [`filePath`,`isSource`];

class ConfigLogger {

  constructor() {
    this.propertyValueCollisions = [];
    this.status = `notice`;
    this.sourceFiles = [];
    this.includeFiles = [];
  }

  addFile({ source, filePath }) {
    if (source) {
      this.sourceFiles.push(filePath);
    } else {
      this.includeFiles.push(filePath);
    }
  }

  addPropertyValueCollision({target, copy, path, key}) {
    // Because filePath and isSource are added *before* merging happens
    // if there is a value collision these will also collide. We don't want
    // to record these collisions as they will just create more noise that is
    // not useful to the user.
    if (!ignoredPaths.includes(key)) {
      this.propertyValueCollisions.push({target, copy, path, key});
      this.status = `warn`;
    }
  }

  propertyValueCollisionMessage() {
    const count = this.propertyValueCollisions.length;
    if (count > 0) {
      return `${count} property value collisions found when parsing source files:\n` +
        this.propertyValueCollisions
          .map(({target, copy, path, key}) => `* ${path.join('.')}.${key}, Original: ${target[key]} -> New: ${copy[key]}`)
          .join(`\n`)
    }
  }

  title() {
    return ``
  }

  messages() {
    return [
      this.propertyValueCollisionMessage(),
    ]
    .filter(str => !!str)
    .join(`\n`);
  }
}

module.exports = ConfigLogger;