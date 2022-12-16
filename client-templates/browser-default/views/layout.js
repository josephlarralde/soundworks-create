import { LitElement, html, render, css } from 'lit';

class SimpleLayout extends LitElement {
  static get styles() {
    return css`
      :host > div {
        padding: 20px;
      }
    `;
  }

  constructor() {
    super();

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
      <div>
        ${Array.from(this._components).map(comp => comp.render ? comp.render() : comp)}
      </div>
    `;
  }
}

customElements.define('simple-layout', SimpleLayout);

export default function createLayout(client, $container) {
  const layoutId = `${client.type}-${client.id}`;

  render(html`
    <simple-layout
      id="${layoutId}"
    ></simple-layout>
  `, $container);

  const $layout = document.querySelector(`#${layoutId}`);

  return $layout;
}
