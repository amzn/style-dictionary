import { LitElement, css, html } from 'lit';
import { darkTokens } from '../../theme/tokens/dark';

const colors: (keyof typeof darkTokens.color)[] = ['accent', 'green', 'orange', 'purple', 'red'];
const colors2 = ['red', 'orange', 'green', 'teal', 'blue', 'purple'];

const shades = ['-low', '', '-high'];
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
  `;

  declare name: string;
  static properties = { name: { type: String } };

  constructor() {
    super();
    this.name = 'Default';
  }

  // Render the UI as a function of component state
  render() {
    return html`<ul>
      ${colors2.map(
        (key) =>
          html`<li class="color">
            ${shades2.map(
              (shade) => html`
                <div
                  class="color__shade"
                  style="background-color: var(--sl-color-core-${key}-${shade}); width:1rem; height: 1rem;"
                ></div>
              `,
            )}
          </li>`,
      )}
      ${colors.map(
        (key) =>
          html`<li class="color">
            ${shades.map(
              (shade) => html`
                <div
                  class="color__shade"
                  style="background-color: var(--sl-color-${key}${shade}); width:1rem; height: 1rem;"
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
    </ul>`;
  }
}

customElements.define('sd-colors', SdColors);
