import { core } from './core';
import { background } from './light/background';
import { border } from './light/border';
import { font } from './light/font';
import application from './application';
import { syntax } from './syntax';
import { starlightLight } from './starlight';

export const lightTokens = {
  color: {
    $type: 'color',
    core,
    background,
    border,
    font,
    ...starlightLight,
  },
  syntax,
  ...application,
};
