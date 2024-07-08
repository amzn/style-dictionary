import { LitElement, css, html } from 'lit';
import { darkTokens } from '../../theme/tokens/dark';
import { shades } from '../../theme/tokens/core';

const colors: (keyof typeof darkTokens.color)[] = ['accent', 'green', 'orange', 'purple', 'red'];
const colors2 = [
  'gray',
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
];

// const shades = ['-low', '', '-high'];
const shades2 = ['darker', 'dark', 'light', 'lighter'];

const fontCodeColors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 21, 22, 23, 24, 25, 26, 27, 28, 29];

export class SdColors extends LitElement {
  static styles = css`
    :host {
    }

    .color {
      display: flex;
      flex-direction: row;
    }

    .color__shade {
      flex: 1;
      height: 2rem;
      text-align: center;
      font-size: 2rem;
    }

    .border-color {
      width: 2rem;
      height: 2rem;
      border: 1px solid transparent;
    }
  `;

  declare name: string;
  static properties = { name: { type: String } };

  constructor() {
    super();
    this.name = 'Default';
  }

  // Render the UI as a function of component state
  render() {
    return html` <div>
      <ul>
        ${['primary', 'secondary', 'tertiary'].map(
          (key) => html`
            <li class="border-color" style="border-color: var(--sl-color-border-${key})"></li>
          `,
        )}
      </ul>
      <ul>
        ${colors2.map(
          (key) =>
            html`<li class="color">
              ${shades2.map(
                (shade) => html`
                  <div
                    class="color__shade"
                    style="background-color: var(--sl-color-${key}-${shade}); width:1rem; height: 1rem;"
                  ></div>
                `,
              )}
            </li>`,
        )}
        ${colors2.map(
          (key) =>
            html`<li class="color">
              ${shades.map(
                (shade) => html`
                  <div
                    class="color__shade"
                    style="background-color: var(--sl-color-${key}-${shade}); width:1rem; height: 1rem;"
                  ></div>
                `,
              )}
            </li>`,
        )}
        <li class="color">
          ${fontCodeColors.map(
            (key) => html`
              <div class="color__shade" style="color: var(--sl-color-font-code-${key});">Aa</div>
            `,
          )}
        </li>
      </ul>
    </div>`;
  }
}

customElements.define('sd-colors', SdColors);
