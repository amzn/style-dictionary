import { core } from './core';
import { background } from './dark/background';
import { border } from './dark/border';
import { font } from './dark/font';
import application from './application';
import { syntax } from './syntax';
import { starlightDark } from './starlight';

export const darkTokens = {
  color: {
    core,
    background,
    border,
    font,
    ...starlightDark,
  },
  syntax,
  ...application,
};
