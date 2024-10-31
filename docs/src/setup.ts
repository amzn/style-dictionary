import mermaid from 'mermaid';
import { registeredComponents } from './components/sd-playground.ts';

type Theme = 'dark' | 'light';

// Load the theme css as strings and create adopted stylesheets
const themeAttr = 'data-theme'; // starlight theme attribute
let currTheme: Theme;

// 77rem
const VP_THRESHOLD = 1231;
const getViewportWidth = () =>
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

async function renderMermaid() {
  const theme = getSelectedTheme();
  const direction = getViewportWidth() > VP_THRESHOLD ? 'LR' : 'TB';
  mermaid.initialize({
    startOnLoad: false,
    theme,
  });
  const elements = [...document.querySelectorAll('.mermaid')] as HTMLPreElement[];
  await Promise.all(
    [...elements].map((el) => {
      // we're storing the original graph definition as a data attribute
      // because mermaid's render will change the innerText
      // and we need to be able to re-render on theme swap or window resize
      const graphDefinition = el.getAttribute('data-mermaid-graph-definition') ?? el.innerText;
      el.setAttribute('data-mermaid-graph-definition', graphDefinition);
      return mermaid
        .render('graphDiv', graphDefinition.replace('flowchart LR', `flowchart ${direction}`))
        .then(({ svg }) => {
          el.innerHTML = svg;
        });
    }),
  );
  [...elements].forEach((el) => {
    el.classList.remove('hidden');
  });
}

function getSelectedTheme() {
  return document.documentElement.getAttribute(themeAttr) as Theme;
}

async function swapTheme(theme: Theme) {
  currTheme = theme;
  // shoelace theme class
  document.documentElement.classList.add(`sl-theme-${theme}`);
  document.documentElement.classList.remove(`sl-theme-${theme === 'dark' ? 'light' : 'dark'}`);

  // change monaco theme for all sd playground instances
  registeredComponents.forEach((comp) => {
    comp.hasInitialized.then(() => {
      comp.editor._themeService.setTheme(`my-${theme}-theme`);
    });
  });
  await renderMermaid();
}

function handleThemeChange() {
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
}

function lazilyLoadCEs(CEs: string[]) {
  CEs.forEach((CE) => {
    const firstInstance = document.querySelector(CE);
    if (firstInstance) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Conditionally load the Web Component definition if we find an instance of it.
            import(`./components/${CE}.ts`);
          }
        });
      });
      observer.observe(firstInstance);
    }
  });
}

function handleResize() {
  let prevVPWidth = getViewportWidth();
  window.addEventListener('resize', () => {
    const currVWWidth = getViewportWidth();
    if (
      (prevVPWidth >= VP_THRESHOLD && currVWWidth < VP_THRESHOLD) ||
      (prevVPWidth <= VP_THRESHOLD && currVWWidth > VP_THRESHOLD)
    ) {
      renderMermaid();
    }
    prevVPWidth = currVWWidth;
  });
}

async function setup() {
  handleThemeChange();
  lazilyLoadCEs(['sd-playground', 'sd-dtcg-convert', 'sd-colors', 'sd-install']);
  handleResize();
  // initial
  await swapTheme(getSelectedTheme());
}
setup();
