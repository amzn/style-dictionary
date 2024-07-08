import * as activityBar from './activityBar.js';
import * as badge from './badge.js';
import * as breadcrumb from './breadcrumb.js';
import * as button from './button.js';
import * as dropdown from './dropdown.js';
import * as editor from './editor.js';
import * as editorGroup from './editorGroup.js';
import * as tab from './tab.js';
import * as titleBar from './titleBar.js';
import * as diffEditor from './diffEditor.js';

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
  focusBorder: { $value: '{color.border.secondary}' },
  foreground: { $value: '{color.font.primary}' },
  descriptionForeground: { $value: '{color.font.secondary}' },
  errorForeground: { $value: '{color.font.danger}' },

  // Icons are the ones in the panel, not the ones in the activity bar
  icon: {
    foreground: { $value: '{color.font.primary}' },
  },

  // Selection background for elements not in the editor, like selecting
  // text in an input
  selection: {
    background: { $value: '{color.background.selection.primary.active}' },
  },

  // Widgets are the quick command palette, notifications, quick search, etc.
  widget: {
    shadow: { $value: '{color.border.secondary}' },
  },
};
