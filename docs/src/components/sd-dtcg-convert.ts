import { LitElement, css, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import { convertJSONToDTCG, convertZIPToDTCG } from '../../../lib/utils/convertToDTCG.js';
import { downloadJSON, downloadZIP } from '../../../lib/utils/downloadFile.js';

class SdDtcgConvert extends LitElement {
  fileInputRef = createRef();

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  render() {
    return html`
      <sl-button @click=${this.triggerUpload} variant="primary">Convert tokens to DTCG</sl-button>
      <input
        ${ref(this.fileInputRef)}
        @change=${this.upload}
        id="upload-tokens-input"
        type="file"
        accept="application/*, text/*"
        aria-hidden="true"
        hidden
      />
    `;
  }

  triggerUpload() {
    const fileInput = this.fileInputRef.value;
    if (fileInput) {
      fileInput.dispatchEvent(new MouseEvent('click'));
    }
  }

  async upload(ev: Event) {
    if (ev.target instanceof HTMLInputElement) {
      const file = ev.target.files?.[0];
      if (file) {
        const today = new Date(Date.now());
        const filename = `dtcg-tokens_${today.getFullYear()}-${today.getMonth()}-${(
          '0' + today.getDate()
        ).slice(-2)}`;

        if (file.type.includes('zip')) {
          const zipBlob = await convertZIPToDTCG(file);
          await downloadZIP(zipBlob, `${filename}.zip`);
        } else if (file.type.includes('json')) {
          const jsonBlob = await convertJSONToDTCG(file);
          await downloadJSON(jsonBlob, `${filename}.json`);
        } else {
          throw new Error('Only ZIP and JSON type uploads are supported.');
        }
      }
    }
  }
}

customElements.define('sd-dtcg-convert', SdDtcgConvert);
