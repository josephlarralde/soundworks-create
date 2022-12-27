import { Client } from '@soundworks/core/client.js';
import { LitElement, html, render, css, nothing } from 'lit';

import '../../components/sw-infos-button.js';
import '../../components/sw-credits.js';

interface Component { render: Function }

function isComponent(object: any): object is Component {
  return 'render' in object;
}

/**
 * This simple layout is provided for convenience, feel free to edit or even
 * remove it if you want to use you own logic.
 *
 * @example
 * const $layout = createLayout(client, $container);
 * const myComponent = {
 *   render() {
 *     return html`<h1>${Math.random()}</h1>`
 *   },
 * };
 * $layout.addComponent(myComponent);
 * setInterval(() => $layout.requestUpdate(), 1000);
 */
class SimpleLayout extends LitElement {
  client: Client;
  components: Set<string | Component>
  showCredits: boolean;

  static get styles() {
    return css`
      :host > div {
        padding: 20px;
      }

      sw-infos-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 1001;
      }

      sw-credits {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1000;
        width: 100vw;
      }
    `;
  }

  constructor() {
    super();

    this.client = null;
    this.components = new Set();

    this.showCredits = false;
  }

  // comp is anything that have a render method
  addComponent(comp: string | Component) {
    this.components.add(comp);
    this.requestUpdate();
  }

  deleteComponent(comp: string | Component) {
    this.components.delete(comp);
    this.requestUpdate();
  }

  toggleCredits() {
    this.showCredits = !this.showCredits;
    this.requestUpdate();
  }

  render() {
    return html`
      <div>
        ${Array.from(this.components).map(comp => isComponent(comp) ? comp.render() : comp)}

        <!-- credits -->
        ${this.showCredits ? html`<sw-credits .client="${this.client}"></sw-credits>` : nothing}
        <sw-infos-button @click="${this.toggleCredits}"></sw-infos-button>
      </div>
    `;
  }
}

customElements.define('simple-layout', SimpleLayout);

export default function createLayout(client: Client, $container: HTMLElement) {
  const layoutId = `${client.role}-${client.id}`;

  render(html`
    <simple-layout
      .client="${client}"
      id="${layoutId}"
    ></simple-layout>
  `, $container);

  const $layout = document.querySelector(`#${layoutId}`);

  return $layout;
}
