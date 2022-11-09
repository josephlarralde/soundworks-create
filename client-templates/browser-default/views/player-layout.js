import { LitElement, html, render } from 'lit';

class PlayerLayout extends LitElement {
  static get properties() {
    return {
      clientType: { type: String, attribute: 'client-type' },
      clientId: { type: Number, attribute: 'client-id', },
    };
  }

  constructor() {
    super();

    this.clientType = null;
    this.clientId = null;
    this._components = new Set();
  }

  // comp is anything that have a render method
  addComponent(comp) {
    this._components.add(comp);
    this.requestUpdate();
  }

  deleteComponent(comp) {
    this._components.delete(comp);
    this.requestUpdate();
  }

  render() {
    return html`
      <div style="padding: 20px">
        <header>
          <h1 style="margin: 20px 0">${this.clientType} [id: ${this.clientId}]</h1>
        </header>
        <section style="margin-top: 20px">
          ${Array.from(this._components).map(comp => comp.render())}
        </section>
      </div>
    `;
  }
}

customElements.define('player-layout', PlayerLayout);

export default function createLayout(client, $container) {
  const layoutId = `${client.type}-${client.id}`;

  render(html`
    <player-layout
      id="${layoutId}"
      client-type="${client.type}"
      client-id="${client.id}"
    ></player-layout>
  `, $container);

  const $layout = document.querySelector(`#${layoutId}`);

  return $layout;
}
