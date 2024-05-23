import dark from '@shoelace-style/shoelace/dist/themes/dark.css?raw' assert { type: 'css' };
import light from '@shoelace-style/shoelace/dist/themes/light.css?raw' assert { type: 'css' };
import { registeredComponents } from './components/sd-playground.ts';

type Theme = 'dark' | 'light';
type EnhancedCSSSheet = CSSStyleSheet & { theme?: boolean };

// Load the theme css as strings and create adopted stylesheets
const themeAttr = 'data-theme'; // starlight theme attribute
let currTheme: Theme;
const sheets = {
  dark: new CSSStyleSheet() as EnhancedCSSSheet,
  light: new CSSStyleSheet() as EnhancedCSSSheet,
};
sheets.dark.replaceSync(dark);
sheets.light.replaceSync(light);
// mark the stylesheets so it's easier to remove them later
sheets.dark.theme = true;
sheets.light.theme = true;

function getSelectedTheme() {
  return document.documentElement.getAttribute(themeAttr) as Theme;
}

function swapTheme(theme: Theme) {
  currTheme = theme;
  // shoelace theme class
  document.documentElement.classList.add(`sl-theme-${theme}`);
  // swap out the shoelace adopted stylesheets
  document.adoptedStyleSheets = [
    ...(document.adoptedStyleSheets as EnhancedCSSSheet[]).filter((sheet) => !sheet.theme),
    sheets[theme],
  ];

  // change monaco theme for all sd playground instances
  registeredComponents.forEach((comp) => {
    comp.hasInitialized.then(() => {
      comp.editor._themeService.setTheme(`my-${theme}-theme`);
    });
  });
}

// initial
swapTheme(getSelectedTheme());

// MutationObserver that watches the starlight theme attribute for changes, which is handled by the theme toggler
const themeObserver = new MutationObserver(() => {
  const selectedTheme = getSelectedTheme();
  if (currTheme !== selectedTheme && (selectedTheme === 'dark' || selectedTheme === 'light')) {
    swapTheme(selectedTheme);
  }
});
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: [themeAttr],
});

const CEs = ['sd-playground', 'sd-dtcg-convert'];

CEs.forEach((ce) => {
  // Conditionally load the sd-playground Web Component definition if we find an instance of it.
  const firstEl = document.querySelector(ce);
  if (firstEl) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          import(`./components/${ce}.ts`);
        }
      });
    });
    observer.observe(firstEl);
  }
});
