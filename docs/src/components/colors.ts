import { LitElement, css, html } from 'lit';
import { hue } from '../../theme/tokens/core';

const shades = ['-low', '', '-high'];

const fontCodeColors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 21, 22, 23, 24, 25, 26, 27, 28, 29];

export class SdColors extends LitElement {
  static styles = css`
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
      <h3>Color palette</h3>
      <ul>
        ${Object.keys(hue).map(
          (key) =>
            html`<li class="color">
              ${shades.map(
                (shade) => html`
                  <div
                    class="color__shade"
                    style="background-color: var(--sl-color-${key}${shade});"
                  ></div>
                `,
              )}
            </li>`,
        )}
      </ul>
      <h3>Background colors</h3>
      <ul class="color">
        ${['primary', 'secondary', 'tertiary'].map(
          (key) => html`
            <li class="color__shade" style="background-color: var(--sl-color-background-${key})">
              ${key}
            </li>
          `,
        )}
      </ul>
      <h3>Border colors</h3>
      <ul>
        ${['primary', 'secondary', 'tertiary'].map(
          (key) => html`
            <li class="border-color" style="border-color: var(--sl-color-border-${key})">${key}</li>
          `,
        )}
      </ul>
      <h3>Syntax highlight colors</h3>
      <ul>
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
