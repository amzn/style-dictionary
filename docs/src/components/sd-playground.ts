import StyleDictionary from 'style-dictionary';
import type { Config } from 'style-dictionary/types';
import memfs from '@bundled-es-modules/memfs';
import type { fs as VolumeType } from 'memfs';
import { LitElement, html, css } from 'lit';
import { posix as path } from 'path-unified';
import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import { bundle } from '../utils/rollup-bundle.ts';
import { changeLang, init } from '../monaco/monaco.ts';
import { analyzeDependencies } from '../utils/analyzeDependencies.ts';
import type SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import { downloadZIP } from '../utils/downloadZIP.ts';

const { Volume } = memfs;

const defaults = {
  tokens: {
    colors: {
      red: {
        value: '#ff0000',
        type: 'color',
      },
    },
  },
  config: {
    platforms: {
      css: {
        transformGroup: 'css',
        files: [
          {
            destination: 'vars.css',
            format: 'css/variables',
          },
        ],
      },
    },
  },
  script: "import StyleDictionary from 'style-dictionary';",
};

const getLang = (lang: string) => {
  const langMap = {
    js: 'javascript',
  } as Record<string, string>;

  return langMap[lang] ?? lang;
};

declare type Files = 'tokens' | 'config' | 'script' | 'output';
const files: Files[] = ['tokens', 'config', 'script', 'output'];

export const registeredComponents: SdPlayground[] = [];

class SdPlayground extends LitElement {
  static get styles() {
    return css`
      sl-radio-group {
        margin-bottom: 4px;
        margin-top: 16px;
      }

      .output-select::part(combobox) {
        height: 28px;
        min-height: 28px;
        margin-left: 10px;
      }

      /** screen-reader only CSS */
      sl-select::part(form-control-label) {
        border: 0 !important;
        clip: rect(1px, 1px, 1px, 1px) !important;
        -webkit-clip-path: inset(50%) !important;
        clip-path: inset(50%) !important;
        height: 1px !important;
        margin: -1px !important;
        overflow: hidden !important;
        padding: 0 !important;
        position: absolute !important;
        width: 1px !important;
        white-space: nowrap !important;
      }

      @media (max-width: 550px) {
        ::part(button-group) {
          display: block;
        }
        ::part(button-group__base) {
          flex-direction: column;
        }

        sl-radio-button[data-sl-button-group__button--first]::part(button) {
          border-top-left-radius: var(--sl-input-border-radius-medium);
          border-top-right-radius: var(--sl-input-border-radius-medium);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        sl-radio-button[data-sl-button-group__button--last]::part(button) {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-left-radius: var(--sl-input-border-radius-medium);
          border-bottom-right-radius: var(--sl-input-border-radius-medium);
        }
      }
    `;
  }

  static get properties() {
    return {
      tokens: {
        reflect: true,
        type: String,
      },
      config: {
        reflect: true,
        type: String,
      },
      script: {
        reflect: true,
        type: String,
      },
      outputFiles: {
        state: true,
      },
    };
  }

  get currentFile(): Files {
    return this._currentFile;
  }

  set currentFile(v: Files) {
    this._currentFile = v;
    this.fileSwitch(v);
    this.updateComplete.then(() => {
      const radio = this.shadowRoot?.querySelector(
        `sl-radio-button[value="${v}"]`,
      ) as HTMLInputElement;
      radio.click();
    });
  }

  declare tokens: string;
  declare config: string;
  declare script: string;
  declare output: string;
  declare outputFiles: string[];
  declare _currentFile: Files;
  declare editor: any;
  declare volume: typeof VolumeType;
  declare hasInitialized: Promise<void>;
  declare hasInitializedResolve: (value: void) => void;

  constructor() {
    super();
    this.tokens = '{}';
    this.config = '{}';
    this.script = '{}';
    this.output = '{}';
    this.outputFiles = [];
    this.editor = undefined;
    this.hasInitialized = new Promise((resolve) => {
      this.hasInitializedResolve = resolve;
    });
    registeredComponents.push(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.init();
  }

  render() {
    return html`
      <sl-radio-group
        @sl-change=${(ev: Event) => {
          if ((ev.target as SlRadioGroup).value === 'eject') {
            return;
          }
          this.currentFile = (ev.target as HTMLInputElement).value as Files;
        }}
        name="file-switch"
      >
        ${files.map(
          (file) => html`
            <sl-radio-button value="${file}">
              ${file.slice(0, 1).toUpperCase()}${file.slice(1)}
              ${file === 'output'
                ? html`
                    <sl-select
                      class="output-select"
                      name="output-select"
                      label="Select output file"
                      value="${this.outputFiles[0]}"
                      @sl-change=${(ev: Event) => {
                        ev.stopPropagation();
                        this.changeOutputs((ev.target as HTMLSelectElement).value, true);
                      }}
                    >
                      ${this.outputFiles.map(
                        (file) => html` <sl-option value="${file}">${file}</sl-option> `,
                      )}
                    </sl-select>
                  `
                : html``}
            </sl-radio-button>
          `,
        )}
        <sl-radio-button value="eject" aria-label="Eject" title="Eject" @click=${this.ejectHandler}>
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m8 12 4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 16V4M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
          </svg>
        </sl-radio-button>
      </sl-radio-group>
      <slot name="monaco-editor"></slot>
    `;
  }

  async init() {
    await this.initMonaco();
    await this.initData();
    this.hasInitializedResolve();
    this.currentFile = 'config';
  }

  async initMonaco() {
    await this.updateComplete;
    const slotEl = this.shadowRoot?.querySelector('slot[name="monaco-editor"]') as HTMLSlotElement;
    const editorElem = slotEl.assignedNodes()[0];
    if (editorElem) {
      this.editor = await init(editorElem as HTMLDivElement);
      this.editor._domElement.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (ev.key === 's' && (ev.ctrlKey || ev.metaKey)) {
          ev.preventDefault();
          this.saveFile();
        }
      });
    }
  }

  async initData() {
    const [, tokens] = await Promise.all([this.initScript(), this.initTokens()]);
    const cfg = await this.initConfig(tokens);
    this.runSD(cfg);
    return cfg;
  }

  async initScript() {
    const scriptData = JSON.parse(this.script);
    if (scriptData.value) {
      const bundled = await bundle(scriptData.value);
      const url = URL.createObjectURL(
        new Blob([bundled], {
          type: 'text/javascript',
        }),
      );
      await import(/* @vite-ignore */ url);
    }
  }

  async initTokens() {
    let tokens = defaults.tokens;
    const tokensData = JSON.parse(this.tokens);
    if (tokensData.value) {
      if (tokensData.lang === 'js') {
        const bundled = await bundle(tokensData.value);
        const url = URL.createObjectURL(
          new Blob([bundled], {
            type: 'text/javascript',
          }),
        );
        tokens = (await import(/* @vite-ignore */ url)).default;
      } else {
        tokens = JSON.parse(tokensData.value);
      }
    }
    return tokens;
  }

  async initConfig(tokens: Record<string, unknown>) {
    let sdConfig = { ...defaults.config, tokens };
    if (this.config) {
      const configData = JSON.parse(this.config);
      if (configData.lang === 'js') {
        const bundled = await bundle(configData.value);
        const url = URL.createObjectURL(
          new Blob([bundled], {
            type: 'text/javascript',
          }),
        );
        sdConfig = (await import(/* @vite-ignore */ url)).default;
      } else if (configData.value) {
        sdConfig = JSON.parse(configData.value);
      }
      sdConfig.tokens = sdConfig.tokens ?? tokens;
    }

    return sdConfig as Config;
  }

  getFileData(file: 'tokens' | 'config' | 'script' | 'output') {
    const def = defaults[file as keyof typeof defaults];
    return {
      lang: JSON.parse(this[file]).lang ?? (file === 'script' ? 'js' : 'json'),
      value:
        JSON.parse(this[file]).value ?? (file === 'script' ? def : JSON.stringify(def, null, 2)),
    };
  }

  async fileSwitch(val: 'tokens' | 'config' | 'script' | 'output') {
    await this.hasInitialized;
    const data = this.getFileData(val);
    this.editor.setValue(data.value);
    await changeLang(getLang(data.lang), this.editor);
  }

  async runSD(cfg: Config) {
    try {
      this.volume = new Volume();
      const sd = new StyleDictionary(cfg, { volume: this.volume });
      await sd.buildAllPlatforms();
      this.outputFiles = this.traverseDir();
      const firstFile = this.outputFiles[0];
      this.changeOutputs(firstFile);
    } catch (e) {
      // TODO: visualize the fact that an error was thrown
      console.error(e);
    }
  }

  changeOutputs(filePath: string, changeCurrentFile = false) {
    this.output = JSON.stringify({
      value: this.volume.readFileSync(filePath, 'utf-8'),
      lang: path.extname(filePath).replace(/^\./g, ''),
    });
    // call the setter so the editor value updates to the new output selection
    if (this.currentFile === 'output' || changeCurrentFile) {
      this.currentFile = 'output';
    }
  }

  // TODO: make async and parallelize
  traverseDir(dir = '/', memo: string[] = []) {
    (this.volume.readdirSync(dir) as string[]).forEach((file: string) => {
      const fullPath = path.join(dir, file);
      if (this.volume.lstatSync(fullPath).isDirectory()) {
        this.traverseDir(fullPath);
      }
      memo.push(fullPath);
    });
    return memo;
  }

  async saveFile() {
    this[this.currentFile] = JSON.stringify({
      value: this.editor.getValue(),
      lang: this.getFileData(this.currentFile).lang,
    });
    await this.initData();
  }

  async ejectHandler() {
    const tokens = this.getFileData('tokens');
    const script = this.getFileData('script');
    const config = this.getFileData('config');
    const dependencies = await analyzeDependencies(script.value);
    const sdDep = dependencies.find((dep) => dep.package === 'style-dictionary');
    if (sdDep) {
      sdDep.package = 'style-dictionary@4.0.0-prerelease.28';
    }
    const files: Record<string, string> = {};
    files[`tokens.${tokens.lang}`] = tokens.value;

    const scriptLang = script.lang === 'js' ? 'mjs' : script.lang;
    const configLang = config.lang === 'js' ? 'mjs' : config.lang;

    if (configLang === 'json') {
      const parsed = JSON.parse(config.value);
      parsed.source = [`tokens.${tokens.lang}`];
      config.value = JSON.stringify(parsed, null, 2);
    } else if (config.lang === 'js') {
      // this is a bit brittle, to add the "source" into a JS file like that..
      config.value = config.value.replace(
        /export( *)default( *){/,
        `export default {\n  source: ['tokens.${tokens.lang}'],`,
      );
    }

    files[`config.${configLang}`] = config.value;
    files[`build-tokens.${scriptLang}`] = `${script.value}

const sd = new StyleDictionary('config.${configLang}');

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
`;
    files['README.md'] = `# Style Dictionary Eject

Install your dependencies with [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm):

\`\`\`sh
npm init -y && npm install ${dependencies.map((dep) => dep.package).join(' ')}
\`\`\`

Then run

\`\`\`sh
node build-tokens.${scriptLang}
\`\`\`
`;

    await downloadZIP(files);
  }
}

customElements.define('sd-playground', SdPlayground);
