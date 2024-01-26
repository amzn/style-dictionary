if (process.env.NODE_ENV !== 'production') {
  const husky = require('husky');
  husky.install();
  require('patch-package');
}
