import { LitElement, css, html } from 'lit';
import '@shoelace-style/shoelace/dist/components/copy-button/copy-button.js';

export class SdInstall extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      border: 1px solid var(--sl-color-border-tertiary);
      box-shadow: 0 0.125rem 1rem var(--sl-color-background-tertiary);
      border-radius: 0.25rem;
      background-color: var(--sl-color-bg-code);
      padding-inline: var(--sl-spacing-medium);
      padding-block: var(--sl-spacing-small);

      --sl-tooltip-arrow-size: 0;
      --sl-tooltip-background-color: var(--sl-color-backdrop-overlay);
      --sl-tooltip-color: var(--sl-color-font-primary);
    }

    code {
      font-size: 1rem;
      flex: 1;
    }

    code:before {
      content: '$ ';
    }

    // sl-copy-button::part(tooltip__body) {
    //   background-color: var(--sl-color-);
    //   border-color: green;
    // }
  `;

  declare name: string;
  static properties = { name: { type: String } };

  constructor() {
    super();
    this.name = 'Default';
  }

  // Render the UI as a function of component state
  render() {
    return html`
      <code class="" data-code="" class=""> npm install style-dictionary </code>
      <sl-copy-button value="npm install style-dictionary"></sl-copy-button>
    `;
  }
}

customElements.define('sd-install', SdInstall);
