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
      </sl-radio-group>
      <slot name="monaco-editor"></slot>
    `;
  }

  async init() {
    await this.initData();
    await this.initMonaco();
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

  async fileSwitch(val: 'tokens' | 'config' | 'script' | 'output') {
    await this.hasInitialized;

    const data = {
      lang: JSON.parse(this[val as keyof SdPlayground]).lang ?? 'json',
      value:
        JSON.parse(this[val]).value ??
        (val === 'script' ? '' : JSON.stringify(defaults[val as keyof typeof defaults], null, 2)),
    };

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
      lang: JSON.parse(this[this.currentFile]).lang ?? 'json',
    });
    await this.initData();
  }
}

customElements.define('sd-playground', SdPlayground);
