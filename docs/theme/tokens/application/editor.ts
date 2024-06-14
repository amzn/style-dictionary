export const editor = {
  background: { value: '{color.background.primary.value}' },
  foreground: { value: '{color.font.primary.value}' },

  // Editor colors with "highlight" in the name refer to times when parts
  // of the code are highlighted, but might not be *selected*. For example
  // when you search in the file it will *highlight* all occurrances, but
  // will only *select* one at a time.

  // This is the background of the selection you make with your cursor
  // It might get overridden later depending on if the selection is a
  // wordHighlight or wordHighlightStrong
  selectionBackground: { value: '{color.background.selection.primary.active.value}' },
  // When you select text, this is the background for *other* text that
  // matches that selection
  selectionHighlightBackground: { value: '{color.background.selection.secondary.inactive.value}' },
  // When the selected text is not in the currently active window or pane
  // This also happens in the sidebar for the currently open file when
  // the cursor is not in the file tree
  inactiveSelectionBackground: { value: '{color.background.selection.primary.inactive.value}' },

  // Word highlights are when you either set your cursor within a word,
  // or select only that word
  wordHighlightBackground: { value: '{color.background.highlight.primary.inactive.value}' },
  // If you highlight a word and it is special, like if it has a tip
  wordHighlightStrongBackground: { value: '{color.background.highlight.secondary.inactive.value}' },

  // The current selected occurance of searched text
  findMatchBackground: { value: '{color.background.highlight.primary.active.value}' },
  // All occurances of found text that are not the current selected one
  // this also applies to matches in the sidebar
  // like searching in the file explorer
  findMatchHighlightBackground: { value: '{color.background.highlight.primary.inactive.value}' },

  // When you "find in selection" this is the background for the selection
  findRangeHighlightBackground: {},

  // Highlight below the word for which a hover is shown.
  // Hover background only happens on non-selected and non-highlighted text
  hoverHighlightBackground: { value: '{color.background.tertiary.value}' },

  // Background of the line(s) the cursor is currently on
  lineHighlightBackground: { value: '{color.background.secondary.value}' },
  lineHighlightBorder: {},

  // When you do a search in the file and it highlights the line
  // of the match you are on
  rangeHighlightBackground: { value: '{color.background.tertiary.value}' },

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
  foreground: { value: '{color.font.tertiary.value}' },
  activeForeground: { value: '{color.font.primary.value}' },
};

export const editorCursor = {
  foreground: { value: '{color.background.info.value}' },
};

export const editorLink = {
  activeForeground: '{color.font.link.primary.inactive.value}',
};

// Next to the line numbers
export const editorGutter = {
  background: { value: '{color.background.primary.value}' },
  modifiedBackground: { value: '{color.border.info.value}' },
  addedBackground: { value: '{color.border.success.value}' },
  deletedBackground: { value: '{color.border.danger.value}' },
};

export const editorOverviewRuler = {
  border: { value: '{color.border.secondary.value}' },

  findMatchForeground: { value: '#00ff00CC' },
  rangeHighlightForeground: { value: '#0000ffCC' },
  selectionHighlightForeground: { value: '{color.background.selection.primary.inactive.value}' },

  currentContentForeground: { value: '#ffffffCC' },
  incomingContentForeground: { value: '#00ff00CC' },
  commonContentForeground: { value: '#0000ffCC' },

  // Git indicators, will match similar ones in editorGutter
  modifiedForeground: { value: '{color.border.info.value}' },
  addedForeground: { value: '{color.border.success.value}' },
  deletedForeground: { value: '{color.border.danger.value}' },

  // Will match squiggly lines
  errorForeground: { value: '{color.border.danger.value}' },
  warningForeground: { value: '{color.border.warning.value}' },
  infoForeground: { value: '{color.border.info.value}' },
  bracketMatchForeground: { value: '{editorBracketMatch.background.value}' },
};

// The squiggly lines when there is an error
export const editorError = {
  foreground: { value: '{color.font.danger.value}' },
  border: {},
};
// The squiggly lines when there is an warning
export const editorWarning = {
  foreground: { value: '{color.font.warning.value}' },
  border: {},
};
export const editorInfo = {
  foreground: { value: '{color.font.info.value}' },
  border: {},
};
export const editorHint = {
  foreground: { value: '{color.font.active.value}' },
  border: {},
};

// Highlights the opening and closing brackets when the cursor is on one
// Setting: editor.matchBrackets
export const editorBracketMatch = {
  background: { value: '{color.background.highlight.secondary.inactive.value}' },
  border: { value: '#0000' },
};

// Shows spaces/tabs
export const editorWhitespace = {
  foreground: { value: '{color.font.ghost.value}' },
};

// Vertical line for indents
// Setting: editor.renderIndentGuides
// Setting: editor.highlightActiveIndentGuide
export const editorIndentGuide = {
  background: { value: '{color.border.tertiary.value}' },
  activeBackground: { value: '{color.border.primary.value}' },
};

// Vertical line at X characters, usually around 80
// Setting: editor.rulers
export const editorRuler = {
  foreground: { value: '{color.border.secondary.value}' },
};

// Git information text in the editor
// Setting: editor.codeLens
export const editorCodeLens = {
  foreground: { value: '{color.font.link.secondary.inactive.value}' },
};

// Unused code
export const editorUnnecessaryCode = {
  // Only sets the opacity, not the actual color
  opacity: { value: '#00000088' },
  border: { value: '{color.border.primary.value}' },
};
