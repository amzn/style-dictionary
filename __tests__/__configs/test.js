import { formats, actions, transformGroups } from '../../lib/enums/index.js';

const {
  scssIcons,
  scssVariables,
  javascriptModule,
  lessIcons,
  lessVariables,
  androidColors,
  androidFontDimens,
  androidDimens,
  iosPlist,
  iosMacros,
  javascriptEs6,
} = formats;
const { web, scss, less } = transformGroups;

export default {
  source: ['__tests__/__tokens/**/*.json'],
  platforms: {
    web: {
      transformGroup: web,
      prefix: 'smop',
      buildPath: '__tests__/__output/web/',
      files: [
        {
          destination: '_icons.css',
          format: scssIcons,
        },
        {
          destination: '_variables.css',
          format: scssVariables,
        },
        {
          destination: '_styles.js',
          format: javascriptModule,
        },
      ],
    },
    scss: {
      transformGroup: scss,
      prefix: 'smop',
      buildPath: '__tests__/__output/scss/',
      files: [
        {
          destination: '_icons.scss',
          format: scssIcons,
        },
        {
          destination: '_variables.scss',
          format: scssVariables,
        },
      ],
    },
    less: {
      transformGroup: less,
      prefix: 'smop',
      buildPath: '__tests__/__output/less/',
      files: [
        {
          destination: '_icons.less',
          format: lessIcons,
        },
        {
          destination: '_variables.less',
          format: lessVariables,
        },
      ],
    },
    android: {
      transformGroup: 'android',
      buildPath: '__tests__/__output/',
      files: [
        {
          destination: 'android/colors.xml',
          format: androidColors,
        },
        {
          destination: 'android/font_dimen.xml',
          format: androidFontDimens,
        },
        {
          destination: 'android/dimens.xml',
          format: androidDimens,
        },
      ],
      actions: [actions.androidCopyImages],
    },
    ios: {
      transformGroup: 'ios',
      buildPath: '__tests__/__output/ios/',
      files: [
        {
          destination: 'style_dictionary.plist',
          format: iosPlist,
        },
        {
          destination: 'style_dictionary.h',
          format: iosMacros,
        },
      ],
    },
    'react-native': {
      transformGroup: 'react-native',
      buildPath: '__tests__/__output/react-native/',
      files: [
        {
          destination: 'style_dictionary.js',
          format: javascriptEs6,
        },
      ],
    },
  },
};
