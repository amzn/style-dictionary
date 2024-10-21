export const editor = {
  background: { $value: '{color.background.primary}' },
  foreground: { $value: '{color.font.primary}' },

  // Editor colors with "highlight" in the name refer to times when parts
  // of the code are highlighted, but might not be *selected*. For example
  // when you search in the file it will *highlight* all occurrances, but
  // will only *select* one at a time.

  // This is the background of the selection you make with your cursor
  // It might get overridden later depending on if the selection is a
  // wordHighlight or wordHighlightStrong
  selectionBackground: { $value: '{color.background.selection.primary.active}' },
  // When you select text, this is the background for *other* text that
  // matches that selection
  selectionHighlightBackground: { $value: '{color.background.selection.secondary.inactive}' },
  // When the selected text is not in the currently active window or pane
  // This also happens in the sidebar for the currently open file when
  // the cursor is not in the file tree
  inactiveSelectionBackground: { $value: '{color.background.selection.primary.inactive}' },

  // Word highlights are when you either set your cursor within a word,
  // or select only that word
  wordHighlightBackground: { $value: '{color.background.highlight.primary.inactive}' },
  // If you highlight a word and it is special, like if it has a tip
  wordHighlightStrongBackground: {
    $value: '{color.background.highlight.secondary.inactive}',
  },

  // The current selected occurance of searched text
  findMatchBackground: { $value: '{color.background.highlight.primary.active}' },
  // All occurances of found text that are not the current selected one
  // this also applies to matches in the sidebar
  // like searching in the file explorer
  findMatchHighlightBackground: { $value: '{color.background.highlight.primary.inactive}' },

  // When you "find in selection" this is the background for the selection
  findRangeHighlightBackground: {},

  // Highlight below the word for which a hover is shown.
  // Hover background only happens on non-selected and non-highlighted text
  hoverHighlightBackground: { $value: '{color.background.tertiary}' },

  // Background of the line(s) the cursor is currently on
  lineHighlightBackground: { $value: '{color.background.secondary}' },
  lineHighlightBorder: {},

  // When you do a search in the file and it highlights the line
  // of the match you are on
  rangeHighlightBackground: { $value: '{color.background.tertiary}' },

  // These are used in debugging
  focusedStackFrameHighlightBackground: {},
  stackFrameHighlightBackground: {},

  // When you insert a snippet that has parts you need to edit,
  // those are tabstops. Similar to selecting a part of text.
  // NOTE: because the tabstop is selected, editor.selectionBackground is also
  // applied
  snippetTabstopHighlightBackground: {},
  snippetTabstopHighlightBorder: {},
  snippetFinalTabstopHighlightBackground: {},
  snippetFinalTabstopHighlightBorder: {},
};

export const editorLineNumber = {
  foreground: { $value: '{color.font.tertiary}' },
  activeForeground: { $value: '{color.font.primary}' },
};

export const editorCursor = {
  foreground: { $value: '{color.background.info}' },
};

export const editorLink = {
  activeForeground: '{color.font.link.primary.inactive}',
};

// Next to the line numbers
export const editorGutter = {
  background: { $value: '{color.background.primary}' },
  modifiedBackground: { $value: '{color.border.info}' },
  addedBackground: { $value: '{color.border.success}' },
  deletedBackground: { $value: '{color.border.danger}' },
};

export const editorOverviewRuler = {
  border: { $value: '{color.border.secondary}' },

  findMatchForeground: { $value: '#00ff00CC' },
  rangeHighlightForeground: { $value: '#0000ffCC' },
  selectionHighlightForeground: { $value: '{color.background.selection.primary.inactive}' },

  currentContentForeground: { $value: '#ffffffCC' },
  incomingContentForeground: { $value: '#00ff00CC' },
  commonContentForeground: { $value: '#0000ffCC' },

  // Git indicators, will match similar ones in editorGutter
  modifiedForeground: { $value: '{color.border.info}' },
  addedForeground: { $value: '{color.border.success}' },
  deletedForeground: { $value: '{color.border.danger}' },

  // Will match squiggly lines
  errorForeground: { $value: '{color.border.danger}' },
  warningForeground: { $value: '{color.border.warning}' },
  infoForeground: { $value: '{color.border.info}' },
  bracketMatchForeground: { $value: '{editorBracketMatch.background}' },
};

// The squiggly lines when there is an error
export const editorError = {
  foreground: { $value: '{color.font.danger}' },
  border: {},
};
// The squiggly lines when there is an warning
export const editorWarning = {
  foreground: { $value: '{color.font.warning}' },
  border: {},
};
export const editorInfo = {
  foreground: { $value: '{color.font.info}' },
  border: {},
};
export const editorHint = {
  foreground: { $value: '{color.font.active}' },
  border: {},
};

// Highlights the opening and closing brackets when the cursor is on one
// Setting: editor.matchBrackets
export const editorBracketMatch = {
  background: { $value: '{color.background.highlight.secondary.inactive}' },
  border: { $value: '#0000' },
};

// Shows spaces/tabs
export const editorWhitespace = {
  foreground: { $value: '{color.font.ghost}' },
};

// Vertical line for indents
// Setting: editor.renderIndentGuides
// Setting: editor.highlightActiveIndentGuide
export const editorIndentGuide = {
  background: { $value: '{color.border.tertiary}' },
  activeBackground: { $value: '{color.border.primary}' },
};

// Vertical line at X characters, usually around 80
// Setting: editor.rulers
export const editorRuler = {
  foreground: { $value: '{color.border.secondary}' },
};

// Git information text in the editor
// Setting: editor.codeLens
export const editorCodeLens = {
  foreground: { $value: '{color.font.link.secondary.inactive}' },
};

// Unused code
export const editorUnnecessaryCode = {
  // Only sets the opacity, not the actual color
  opacity: { $value: '#00000088' },
  border: { $value: '{color.border.primary}' },
};
