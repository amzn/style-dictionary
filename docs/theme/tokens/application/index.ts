import * as activityBar from './activityBar';
import * as badge from './badge';
import * as breadcrumb from './breadcrumb';
import * as button from './button';
import * as dropdown from './dropdown';
import * as editor from './editor';
import * as editorGroup from './editorGroup';
import * as tab from './tab';
import * as titleBar from './titleBar';
import * as diffEditor from './diffEditor';

// https://code.visualstudio.com/api/references/theme-color
export default {
  ...activityBar,
  ...badge,
  ...breadcrumb,
  ...button,
  ...diffEditor,
  ...dropdown,
  ...editor,
  ...editorGroup,
  ...tab,
  ...titleBar,

  // This applies to focused sections in the sidebar as well
  // as focused inputs
  focusBorder: { value: '{color.border.secondary.value}' },
  foreground: { value: '{color.font.primary.value}' },
  descriptionForeground: { value: '{color.font.secondary.value}' },
  errorForeground: { value: '{color.font.danger.value}' },

  // Icons are the ones in the panel, not the ones in the activity bar
  icon: {
    foreground: { value: '{color.font.primary.value}' },
  },

  // Selection background for elements not in the editor, like selecting
  // text in an input
  selection: {
    background: { value: '{color.background.selection.primary.active.value}' },
  },

  // Widgets are the quick command palette, notifications, quick search, etc.
  widget: {
    shadow: { value: '#0000' },
  },
};
