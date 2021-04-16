/**
 * This will keep the diagnostics and logging of a building a file
 */

const chalk = require('chalk');
const { LOG_ICONS, LOG_COLORS, LOG_MAP } = require('./consts');

class PlatformLogger {
  constructor({ name, transforms=[], transformGroups=[], formats=[], actions=[] }) {
    this.name = name;
    this.transforms = transforms;
    this.transformGroups = transformGroups;
    this.formats = formats;
    this.actions = actions;
    this.status = 'notice';
    this.missingActions = [];
    this.missingFormats = [];
    this.missingTransformGroups = [];
    this.missingTransforms = [];
    this.files = [];
    this.undefinedReferences = [];
    this.circularReferences = [];
    this.templateDeprecations = [];
  }

  addTemplateDeprecation(file) {
    this.templateDeprecations.push(file);
    if (LOG_MAP[this.status] < LOG_MAP[`warn`]) {
      this.status = `warn`;
    }
  }

  addMissingTransform(transform) {
    if (this.missingTransforms.indexOf(transform) < 0) {
      this.missingTransforms.push(transform);
      this.status = `error`;
    }
  }

  addMissingTransformGroup(transformGroup) {
    if (this.missingTransformGroups.indexOf(transformGroup) < 0) {
      this.missingTransformGroups.push(transformGroup);
      this.status = `error`
    }
  }

  addMissingFormat(format) {
    if (this.missingFormats.indexOf(format) < 0) {
      this.missingFormats.push(format);
      this.status = `error`
    }
  }

  addMissingAction(action) {
    if (this.missingActions.indexOf(action) < 0) {
      this.missingActions.push(action);
      this.status = `error`
    }
  }

  addFile(file) {
    this.files.push(file);
    if (LOG_MAP[file.status] > LOG_MAP[this.status]) {
      this.status = file.status;
    }
  }

  addUndefinedReference({ token, reference }) {
    this.undefinedReferences.push({ token, reference });
    this.status = `error`
  }

  undefinedReferencesMessages() {
    if (this.undefinedReferences.length > 0) {
      return `* Undefined reference errors:\n` +
        this.undefinedReferences.map(({token, reference}) => {
          return `  * ${chalk.bold(`${token} → ${reference}`)}`
        }).join(`\n`);
    }
  }

  addCircularReference({ stack }) {
    this.circularReferences.push({ stack });
    this.status = `error`
  }

  circularReferencesMessages() {
    if (this.circularReferences.length > 0) {
      return `* Circular reference errors:\n` +
        this.circularReferences.map(({stack}) => {
          return `  * ${chalk.bold(stack.join(` → `))}`
        }).join(`\n`);
    }
  }

  title() {
    return chalk[LOG_COLORS[this.status]](
      chalk.bold(`${LOG_ICONS[this.status]} ${this.name}`)
    )
  }

  templateDeprecationMessage() {
    if (this.templateDeprecations.length > 0) {
      return `* Templates are being deprecated, these templates are being used:\n` +
        this.templateDeprecations.map(message => `  * ${message}`).join(`\n`)
    }
  }

  missingActionsMessage() {
    if (this.missingActions.length > 0) {
      return `* Unknown actions:\n${this.missingActions.map(action => `  * ${action}`).join(`\n`)}\n  Available actions: ${this.actions.join(`, `)}`
    }
  }

  missingFormatsMessage() {
    if (this.missingFormats.length > 0) {
      return `Unknown formats:\n${this.missingFormats.map(format => `* ${format}`).join(`\n`)}\nAvailable formats: ${this.formats.join(`, `)}`
    }
  }

  missingTransformsMessage() {
    if (this.missingTransforms.length > 0) {
      return `* Unknown transforms:\n${this.missingTransforms.map(transform => `  * ${transform}`).join(`\n`)}\n  Available transforms: ${this.transforms.join(`, `)}`
    }
  }

  missingTransformGroupsMessage() {
    if (this.missingTransformGroups.length > 0) {
      return `* Unknown transformGroups:\n${this.missingTransformGroups.map(transformGroup => `  * ${transformGroup}`).join(`\n`)}\n  Available transformGroups: ${this.transformGroups.join(`, `)}`
    }
  }

  messages() {
    return [
      this.missingActionsMessage(),
      this.missingFormatsMessage(),
      this.missingTransformGroupsMessage(),
      this.missingTransformsMessage(),
      this.templateDeprecationMessage(),
      this.undefinedReferencesMessages(),
      this.circularReferencesMessages(),
      ...this.files.map(file => {
        return `${file.title()}\n${file.messages()}`
      })
    ]
    .filter(str => !!str)
    .join(`\n`);
  }

  help() {
    return ``
  }
}


module.exports = PlatformLogger;