import type * as monacoType from 'monaco-editor';
import darkMonacoTheme from '../../theme/dist/dark.monaco.json';
import lightMonacoTheme from '../../theme/dist/light.monaco.json';

export let monaco: typeof monacoType;

declare global {
  interface Window {
    monaco: typeof monacoType;
    require: NodeRequire | undefined;
  }
}

interface LoaderCallback {
  resolve: () => void;
  reject: (reason?: any) => void;
  timeout: NodeJS.Timeout;
}

let loaderPending = false;
const loaderCallbacks: LoaderCallback[] = [];

function onAmdLoaderLoad() {
  let currentCallback = loaderCallbacks.shift();
  while (currentCallback) {
    window.clearTimeout(currentCallback.timeout);
    currentCallback.resolve();
    currentCallback = loaderCallbacks.shift();
  }
}

function onAmdLoaderError(err: any) {
  let currentCallback = loaderCallbacks.shift();
  while (currentCallback) {
    window.clearTimeout(currentCallback.timeout);
    currentCallback.reject(err);
    currentCallback = loaderCallbacks.shift();
  }
}

export function ensureMonacoIsLoaded(
  // srcPath = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.29.1/dev' // <-- for debugging
  srcPath = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.29.1/min',
) {
  return new Promise((resolve, reject) => {
    if (monaco) {
      resolve(null);
      return;
    }
    const config = {
      paths: {
        vs: srcPath + '/vs',
        vs_dev: srcPath.replace(/\/min$/, '/dev') + '/vs',
      },
    };
    const loaderUrl = `${config.paths.vs}/loader.js`;

    const timeout = setTimeout(() => {
      reject(new Error("Couldn't load monaco editor after 60s"));
    }, 60000);

    loaderCallbacks.push({
      resolve: () => {
        if (loaderPending) {
          // @ts-expect-error config should be ok?
          window.require.config(config);
          loaderPending = false;
        }

        // Cross domain workaround - https://github.com/Microsoft/monaco-editor/blob/master/docs/integrate-amd-cross.md
        window.MonacoEnvironment = {
          getWorkerUrl() {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                  baseUrl: '${srcPath}'
                };
                importScripts('${srcPath}/vs/base/worker/workerMain.js');`)}`;
          },
        };

        // @ts-expect-error 2nd arg should be ok
        window.require(['vs/editor/editor.main'], () => {
          monaco = window.monaco;
          resolve(null);
        });
      },
      timeout,
      reject,
    });

    if (!loaderPending) {
      const loaderScript = window.document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = loaderUrl;
      loaderScript.addEventListener('load', onAmdLoaderLoad);
      loaderScript.addEventListener('error', onAmdLoaderError);
      window.document.body.appendChild(loaderScript);
      loaderPending = true;
    }
  });
}

export async function init(elem: HTMLDivElement) {
  await ensureMonacoIsLoaded();
  monaco.editor.defineTheme(
    'my-light-theme',
    lightMonacoTheme as monacoType.editor.IStandaloneThemeData,
  );

  monaco.editor.defineTheme(
    'my-dark-theme',
    darkMonacoTheme as monacoType.editor.IStandaloneThemeData,
  );

  const editor = monaco.editor.create(elem, {
    theme: 'my-dark-theme',
    minimap: {
      enabled: false,
    },
    fontSize: 16,
  });

  const resizeMonacoLayout = () => {
    editor.layout({
      width: elem.getBoundingClientRect().width,
      height: 400,
    });
  };
  resizeMonacoLayout();
  window.addEventListener('resize', resizeMonacoLayout);
  return editor;
}

export async function changeLang(lang: string, ed: typeof monacoType.editor) {
  await ensureMonacoIsLoaded();
  // @ts-expect-error supposedly need to pass URI here... but cant find import to Uri for browser...
  monaco.editor.setModelLanguage(ed.getModel(), lang);
}
