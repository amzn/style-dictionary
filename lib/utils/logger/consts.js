const LOG_COLORS = {
  warn: 'yellow',
  error: 'red',
  info: 'blue',
  notice: 'green',
  debug: 'black'
};

const LOG_MAP = {
  debug: 100,   // debugging info, hidden by default
  info: 200,    // informational, hidden by default
  notice: 300,  // normal condition, but significant
  warn: 400,    // not broken, but alert users
  error: 500,   // errors with recovery (not uncaught exception)
  silent: 999,  // will hide all logging messages
};

const LOG_LEVELS = [
  `debug`,
  `info`,
  `notice`,
  `warn`,
  `error`,
  `silent`
];

const LOG_ICONS = {
  debug: '',
  info: '',
  notice: '✔︎',
  warn: '⚠︎',
  error: '✘',
  silent: '',
}

module.exports = {
  LOG_LEVELS,
  LOG_COLORS,
  LOG_ICONS,
  LOG_MAP
}